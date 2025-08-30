// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TruthBoardFilecoin
 * @dev Smart contract para automatizar el almacenamiento permanente en Filecoin
 * @notice Maneja la archivación automática de contenido validado y evidencia
 */
contract TruthBoardFilecoin is ReentrancyGuard, Ownable, Pausable {
    // Estructuras
    struct StorageDeal {
        uint256 dealId;
        bytes32 contentHash;
        string cid; // Content Identifier en Filecoin
        uint256 size;
        uint256 duration;
        uint256 price;
        address paymentSource;
        StorageType storageType;
        uint256 createdAt;
        bool isActive;
    }

    struct ArchivePolicy {
        uint256 minReputationScore;
        uint256 minValidationScore;
        uint256 storageDuration;
        uint256 maxPricePerByte;
        bool autoArchive;
        bool communityFunded;
        bool daoApproved;
    }

    struct ValidationEvidence {
        bytes32 newsHash;
        string[] evidenceFiles; // CIDs de archivos de evidencia
        uint256 validationScore;
        address[] validators;
        uint256 timestamp;
        bool archived;
    }

    enum StorageType {
        NEWS_CONTENT,
        VALIDATION_EVIDENCE,
        PUBLIC_SNAPSHOT,
        REPUTATION_DATA,
        AUDIT_TRAIL
    }

    // Estado del contrato
    mapping(bytes32 => StorageDeal) public storageDeals;
    mapping(StorageType => ArchivePolicy) public archivePolicies;
    mapping(bytes32 => ValidationEvidence) public validationEvidence;
    mapping(address => uint256) public reputationScores;
    mapping(bytes32 => bool) public isArchived;

    // Pools de financiamiento
    uint256 public communityPool;
    uint256 public daoTreasury;
    uint256 public reputationRewards;

    // Configuración
    uint256 public constant MIN_STORAGE_DURATION = 365 days; // 1 año mínimo
    uint256 public constant MAX_STORAGE_DURATION = 10 * 365 days; // 10 años máximo
    uint256 public maxDealSize = 32 * 1024 * 1024 * 1024; // 32GB
    address public filecoinAPI;

    // Eventos
    event StorageDealCreated(
        uint256 indexed dealId,
        bytes32 indexed contentHash,
        string cid,
        StorageType storageType,
        uint256 price
    );

    event ContentArchived(
        bytes32 indexed contentHash,
        string cid,
        StorageType storageType,
        address fundingSource
    );

    event ValidationEvidenceStored(
        bytes32 indexed newsHash,
        string[] evidenceCids,
        uint256 validationScore
    );

    event ArchivePolicyUpdated(
        StorageType storageType,
        uint256 minReputationScore,
        uint256 storageDuration
    );

    event ReputationUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore
    );

    constructor(address _filecoinAPI) Ownable(msg.sender) {
        filecoinAPI = _filecoinAPI;

        // Configurar políticas por defecto
        _setDefaultArchivePolicies();
    }

    /**
     * @dev Crea un deal de almacenamiento en Filecoin
     */
    function createStorageDeal(
        bytes32 _contentHash,
        string calldata _cid,
        uint256 _size,
        uint256 _duration,
        StorageType _storageType,
        address _paymentSource
    ) external nonReentrant whenNotPaused returns (uint256 dealId) {
        require(_size <= maxDealSize, "Content too large");
        require(_duration >= MIN_STORAGE_DURATION, "Duration too short");
        require(_duration <= MAX_STORAGE_DURATION, "Duration too long");
        require(!isArchived[_contentHash], "Already archived");

        // Verificar política de archivado
        ArchivePolicy memory policy = archivePolicies[_storageType];

        if (policy.autoArchive) {
            require(
                reputationScores[msg.sender] >= policy.minReputationScore,
                "Insufficient reputation"
            );
        }

        // Calcular precio del deal
        uint256 dealPrice = _calculateStoragePrice(
            _size,
            _duration,
            _storageType
        );
        require(dealPrice <= policy.maxPricePerByte * _size, "Price too high");

        // Crear deal ID único
        dealId = uint256(
            keccak256(
                abi.encodePacked(
                    _contentHash,
                    _cid,
                    block.timestamp,
                    block.number
                )
            )
        );

        // Crear el deal
        storageDeals[_contentHash] = StorageDeal({
            dealId: dealId,
            contentHash: _contentHash,
            cid: _cid,
            size: _size,
            duration: _duration,
            price: dealPrice,
            paymentSource: _paymentSource,
            storageType: _storageType,
            createdAt: block.timestamp,
            isActive: true
        });

        // Procesar pago
        _processPayment(dealPrice, _paymentSource, policy);

        // Marcar como archivado
        isArchived[_contentHash] = true;

        emit StorageDealCreated(
            dealId,
            _contentHash,
            _cid,
            _storageType,
            dealPrice
        );
        emit ContentArchived(_contentHash, _cid, _storageType, _paymentSource);

        return dealId;
    }

    /**
     * @dev Almacena evidencia de validación automáticamente
     */
    function storeValidationEvidence(
        bytes32 _newsHash,
        string[] calldata _evidenceCids,
        uint256 _validationScore,
        address[] calldata _validators
    ) external nonReentrant whenNotPaused {
        require(_validationScore <= 100, "Invalid validation score");
        require(_evidenceCids.length > 0, "No evidence provided");

        // Crear evidencia
        validationEvidence[_newsHash] = ValidationEvidence({
            newsHash: _newsHash,
            evidenceFiles: _evidenceCids,
            validationScore: _validationScore,
            validators: _validators,
            timestamp: block.timestamp,
            archived: false
        });

        // Auto-archivar si cumple criterios
        ArchivePolicy memory policy = archivePolicies[
            StorageType.VALIDATION_EVIDENCE
        ];

        if (
            policy.autoArchive && _validationScore >= policy.minValidationScore
        ) {
            _autoArchiveEvidence(_newsHash, _evidenceCids);
        }

        // Actualizar reputación de validadores
        _updateValidatorReputation(_validators, _validationScore);

        emit ValidationEvidenceStored(
            _newsHash,
            _evidenceCids,
            _validationScore
        );
    }

    /**
     * @dev Crea snapshot público de datos importantes
     */
    function createPublicSnapshot(
        string calldata _snapshotCid,
        bytes32 _merkleRoot,
        uint256 _blockNumber
    ) external onlyOwner nonReentrant {
        bytes32 snapshotHash = keccak256(
            abi.encodePacked(_snapshotCid, _merkleRoot, _blockNumber)
        );

        // Obtener tamaño estimado del snapshot
        uint256 estimatedSize = 100 * 1024 * 1024; // 100MB estimado
        uint256 duration = 5 * 365 days; // 5 años para snapshots públicos

        // Auto-financiar desde el pool de la comunidad
        _createInternalStorageDeal(
            snapshotHash,
            _snapshotCid,
            estimatedSize,
            duration,
            StorageType.PUBLIC_SNAPSHOT,
            address(this)
        );
    }

    /**
     * @dev Financia almacenamiento desde pool comunitario
     */
    function fundCommunityStorage(
        bytes32 _contentHash
    ) external payable nonReentrant {
        require(msg.value > 0, "No funding provided");

        StorageDeal storage deal = storageDeals[_contentHash];
        require(deal.isActive, "Deal not active");
        require(deal.paymentSource == address(0), "Already funded");

        communityPool += msg.value;
        deal.paymentSource = address(this);
    }

    /**
     * @dev Actualiza política de archivado
     */
    function updateArchivePolicy(
        StorageType _storageType,
        uint256 _minReputationScore,
        uint256 _minValidationScore,
        uint256 _storageDuration,
        uint256 _maxPricePerByte,
        bool _autoArchive,
        bool _communityFunded,
        bool _daoApproved
    ) external onlyOwner {
        archivePolicies[_storageType] = ArchivePolicy({
            minReputationScore: _minReputationScore,
            minValidationScore: _minValidationScore,
            storageDuration: _storageDuration,
            maxPricePerByte: _maxPricePerByte,
            autoArchive: _autoArchive,
            communityFunded: _communityFunded,
            daoApproved: _daoApproved
        });

        emit ArchivePolicyUpdated(
            _storageType,
            _minReputationScore,
            _storageDuration
        );
    }

    /**
     * @dev Obtiene información de un deal de almacenamiento
     */
    function getStorageDeal(
        bytes32 _contentHash
    ) external view returns (StorageDeal memory) {
        return storageDeals[_contentHash];
    }

    /**
     * @dev Obtiene evidencia de validación
     */
    function getValidationEvidence(
        bytes32 _newsHash
    ) external view returns (ValidationEvidence memory) {
        return validationEvidence[_newsHash];
    }

    /**
     * @dev Verifica si contenido está archivado permanentemente
     */
    function isContentArchived(
        bytes32 _contentHash
    ) external view returns (bool, string memory) {
        if (isArchived[_contentHash]) {
            return (true, storageDeals[_contentHash].cid);
        }
        return (false, "");
    }

    /**
     * @dev Obtiene estadísticas de almacenamiento
     */
    function getStorageStats()
        external
        view
        returns (
            uint256 totalDeals,
            uint256 totalSize,
            uint256 communityFunds,
            uint256 archivedContent
        )
    {
        // Implementación simplificada - en producción calcular desde mappings
        return (0, 0, communityPool, 0);
    }

    // Funciones internas

    function _calculateStoragePrice(
        uint256 _size,
        uint256 _duration,
        StorageType _storageType
    ) internal pure returns (uint256) {
        // Precio base: 0.0001 FIL por GB por año
        uint256 gbSize = (_size + (1024 * 1024 * 1024 - 1)) /
            (1024 * 1024 * 1024);
        uint256 yearsDuration = (_duration + (365 days - 1)) / 365 days;
        uint256 basePrice = gbSize * yearsDuration * 0.0001 ether;

        // Multiplicador por tipo de storage
        if (_storageType == StorageType.PUBLIC_SNAPSHOT) {
            return (basePrice * 150) / 100; // +50% para snapshots públicos
        } else if (_storageType == StorageType.VALIDATION_EVIDENCE) {
            return (basePrice * 125) / 100; // +25% para evidencia
        }

        return basePrice;
    }

    function _createInternalStorageDeal(
        bytes32 _contentHash,
        string calldata _cid,
        uint256 _size,
        uint256 _duration,
        StorageType _storageType,
        address _paymentSource
    ) internal returns (uint256 dealId) {
        // Calcular precio del deal
        uint256 dealPrice = _calculateStoragePrice(
            _size,
            _duration,
            _storageType
        );

        // Crear deal ID único
        dealId = uint256(
            keccak256(
                abi.encodePacked(
                    _contentHash,
                    _cid,
                    block.timestamp,
                    block.number
                )
            )
        );

        // Crear el deal
        storageDeals[_contentHash] = StorageDeal({
            dealId: dealId,
            contentHash: _contentHash,
            cid: _cid,
            size: _size,
            duration: _duration,
            price: dealPrice,
            paymentSource: _paymentSource,
            storageType: _storageType,
            createdAt: block.timestamp,
            isActive: true
        });

        // Marcar como archivado
        isArchived[_contentHash] = true;

        emit StorageDealCreated(
            dealId,
            _contentHash,
            _cid,
            _storageType,
            dealPrice
        );
        emit ContentArchived(_contentHash, _cid, _storageType, _paymentSource);

        return dealId;
    }

    function _processPayment(
        uint256 _amount,
        address _paymentSource,
        ArchivePolicy memory _policy
    ) internal {
        if (_policy.communityFunded) {
            require(communityPool >= _amount, "Insufficient community funds");
            communityPool -= _amount;
        } else if (_policy.daoApproved) {
            require(daoTreasury >= _amount, "Insufficient DAO funds");
            daoTreasury -= _amount;
        } else {
            require(_paymentSource != address(0), "No payment source");
            // En implementación completa, transferir desde _paymentSource
        }
    }

    function _autoArchiveEvidence(
        bytes32 _newsHash,
        string[] calldata _evidenceCids
    ) internal {
        for (uint i = 0; i < _evidenceCids.length; i++) {
            bytes32 evidenceHash = keccak256(abi.encodePacked(_newsHash, i));

            if (!isArchived[evidenceHash]) {
                uint256 estimatedSize = 10 * 1024 * 1024; // 10MB por archivo de evidencia
                uint256 duration = 3 * 365 days; // 3 años para evidencia

                _createInternalStorageDeal(
                    evidenceHash,
                    _evidenceCids[i],
                    estimatedSize,
                    duration,
                    StorageType.VALIDATION_EVIDENCE,
                    address(this)
                );
            }
        }

        validationEvidence[_newsHash].archived = true;
    }

    function _updateValidatorReputation(
        address[] calldata _validators,
        uint256 _score
    ) internal {
        for (uint i = 0; i < _validators.length; i++) {
            uint256 oldScore = reputationScores[_validators[i]];
            uint256 newScore = (oldScore * 9 + _score) / 10; // Promedio ponderado

            reputationScores[_validators[i]] = newScore;

            emit ReputationUpdated(_validators[i], oldScore, newScore);
        }
    }

    function _setDefaultArchivePolicies() internal {
        // Política para contenido de noticias
        archivePolicies[StorageType.NEWS_CONTENT] = ArchivePolicy({
            minReputationScore: 70,
            minValidationScore: 80,
            storageDuration: 2 * 365 days,
            maxPricePerByte: 0.001 ether,
            autoArchive: true,
            communityFunded: true,
            daoApproved: false
        });

        // Política para evidencia de validación
        archivePolicies[StorageType.VALIDATION_EVIDENCE] = ArchivePolicy({
            minReputationScore: 60,
            minValidationScore: 75,
            storageDuration: 3 * 365 days,
            maxPricePerByte: 0.0005 ether,
            autoArchive: true,
            communityFunded: true,
            daoApproved: true
        });

        // Política para snapshots públicos
        archivePolicies[StorageType.PUBLIC_SNAPSHOT] = ArchivePolicy({
            minReputationScore: 0,
            minValidationScore: 0,
            storageDuration: 5 * 365 days,
            maxPricePerByte: 0.002 ether,
            autoArchive: false,
            communityFunded: false,
            daoApproved: true
        });
    }

    // Funciones de administración

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateFilecoinAPI(address _newAPI) external onlyOwner {
        filecoinAPI = _newAPI;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function fundCommunityPool() external payable {
        communityPool += msg.value;
    }

    function fundDAOTreasury() external payable onlyOwner {
        daoTreasury += msg.value;
    }

    receive() external payable {
        communityPool += msg.value;
    }
}
