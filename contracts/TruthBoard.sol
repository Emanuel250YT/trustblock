// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TruthBoard - Anonymous News Publishing with ZK Proofs on Citrea
 * @dev Permite publicación anónima de noticias con donaciones privadas y validación comunitaria
 * Optimizado para Citrea Bitcoin ZK Rollup
 */
contract TruthBoard is ReentrancyGuard, Ownable, Pausable {
    // Estructura para noticias anónimas
    struct AnonymousNews {
        bytes32 contentHash; // Hash del contenido encriptado
        bytes32 zkProofHash; // Hash de la prueba ZK de identidad
        uint256 timestamp;
        uint256 donationPool; // Pool de donaciones para esta noticia
        uint256 validationScore; // Score de validación (0-100)
        bool isValidated; // Si fue validada por la comunidad
        bool isAnchored; // Si fue anclada en Bitcoin via Citrea
        string ipfsHash; // Hash IPFS del contenido encriptado
        address[] validators; // Direcciones de validadores (pueden ser anónimas)
        uint256[] votes; // Votos de validación
    }

    // Estructura para validadores anónimos
    struct AnonymousValidator {
        bytes32 commitmentHash; // Commitment hash para ZK identity
        uint256 reputation; // Reputación del validador
        uint256 totalValidations; // Total de validaciones realizadas
        bool isActive; // Si está activo
        string region; // Región (opcional, para contexto local)
    }

    // Estructura para donaciones anónimas
    struct AnonymousDonation {
        bytes32 newsHash; // Hash de la noticia
        uint256 amount; // Cantidad donada (oculta real con ZK)
        bytes32 donorCommitment; // Commitment del donante
        uint256 timestamp;
        bool isDistributed; // Si fue distribuida
    }

    // Mapeos principales
    mapping(bytes32 => AnonymousNews) public newsRegistry;
    mapping(bytes32 => AnonymousValidator) public validators;
    mapping(bytes32 => AnonymousDonation[]) public newsDonations;
    mapping(address => bytes32) public addressToCommitment;

    // Arrays para iteración
    bytes32[] public allNewsHashes;
    bytes32[] public validatedNewsHashes;
    bytes32[] public anchoredNewsHashes;

    // Configuración del sistema
    uint256 public constant MIN_VALIDATION_VOTES = 3;
    uint256 public constant VALIDATION_THRESHOLD = 70; // 70% para considerar válida
    uint256 public constant ANCHOR_THRESHOLD = 85; // 85% para anclar en Bitcoin
    uint256 public validatorFee = 0.001 ether; // Fee para ser validador
    uint256 public totalDonationPool;

    // Eventos
    event AnonymousNewsPublished(
        bytes32 indexed newsHash,
        bytes32 zkProofHash,
        string ipfsHash
    );
    event AnonymousDonationReceived(
        bytes32 indexed newsHash,
        bytes32 donorCommitment,
        uint256 amount
    );
    event NewsValidated(
        bytes32 indexed newsHash,
        uint256 finalScore,
        address validator
    );
    event NewsAnchored(bytes32 indexed newsHash, uint256 blockNumber);
    event ValidatorRegistered(bytes32 indexed commitmentHash, string region);
    event RewardsDistributed(bytes32 indexed newsHash, uint256 totalAmount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Registra un validador anónimo usando ZK commitment
     */
    function registerAnonymousValidator(
        bytes32 commitmentHash,
        string memory region,
        bytes memory zkProof
    ) external payable {
        require(msg.value >= validatorFee, "Insufficient validator fee");
        require(
            validators[commitmentHash].commitmentHash == bytes32(0),
            "Validator already exists"
        );
        require(
            verifyValidatorZKProof(commitmentHash, zkProof),
            "Invalid ZK proof"
        );

        validators[commitmentHash] = AnonymousValidator({
            commitmentHash: commitmentHash,
            reputation: 100, // Reputación inicial
            totalValidations: 0,
            isActive: true,
            region: region
        });

        // Mapear address a commitment para facilitar consultas
        addressToCommitment[msg.sender] = commitmentHash;

        emit ValidatorRegistered(commitmentHash, region);
    }

    /**
     * @dev Publica una noticia de forma anónima
     */
    function publishAnonymousNews(
        bytes32 contentHash,
        bytes32 zkProofHash,
        string memory ipfsHash,
        bytes memory zkIdentityProof
    ) external {
        require(
            verifyPublisherZKProof(zkProofHash, zkIdentityProof),
            "Invalid publisher ZK proof"
        );
        require(
            newsRegistry[contentHash].timestamp == 0,
            "News already exists"
        );

        newsRegistry[contentHash] = AnonymousNews({
            contentHash: contentHash,
            zkProofHash: zkProofHash,
            timestamp: block.timestamp,
            donationPool: 0,
            validationScore: 0,
            isValidated: false,
            isAnchored: false,
            ipfsHash: ipfsHash,
            validators: new address[](0),
            votes: new uint256[](0)
        });

        allNewsHashes.push(contentHash);

        emit AnonymousNewsPublished(contentHash, zkProofHash, ipfsHash);
    }

    /**
     * @dev Dona de forma anónima a una noticia
     */
    function donateAnonymously(
        bytes32 newsHash,
        bytes32 donorCommitment,
        bytes memory zkDonationProof
    ) external payable {
        require(msg.value > 0, "Donation must be greater than 0");
        require(newsRegistry[newsHash].timestamp != 0, "News does not exist");
        require(
            verifyDonationZKProof(donorCommitment, msg.value, zkDonationProof),
            "Invalid donation ZK proof"
        );

        // Añadir donación al pool
        newsRegistry[newsHash].donationPool += msg.value;
        totalDonationPool += msg.value;

        // Registrar donación anónima
        newsDonations[newsHash].push(
            AnonymousDonation({
                newsHash: newsHash,
                amount: msg.value,
                donorCommitment: donorCommitment,
                timestamp: block.timestamp,
                isDistributed: false
            })
        );

        emit AnonymousDonationReceived(newsHash, donorCommitment, msg.value);
    }

    /**
     * @dev Valida una noticia (validador anónimo)
     */
    function validateNews(
        bytes32 newsHash,
        uint256 vote, // 0-100 score
        bytes memory zkValidatorProof
    ) external {
        require(newsRegistry[newsHash].timestamp != 0, "News does not exist");
        require(vote <= 100, "Invalid vote score");
        require(!newsRegistry[newsHash].isValidated, "News already validated");

        bytes32 validatorCommitment = addressToCommitment[msg.sender];
        require(
            validatorCommitment != bytes32(0),
            "Not a registered validator"
        );
        require(
            validators[validatorCommitment].isActive,
            "Validator not active"
        );
        require(
            verifyValidationZKProof(
                validatorCommitment,
                newsHash,
                vote,
                zkValidatorProof
            ),
            "Invalid validation ZK proof"
        );

        // Verificar que no haya votado antes
        for (uint i = 0; i < newsRegistry[newsHash].validators.length; i++) {
            require(
                newsRegistry[newsHash].validators[i] != msg.sender,
                "Already voted"
            );
        }

        // Registrar voto
        newsRegistry[newsHash].validators.push(msg.sender);
        newsRegistry[newsHash].votes.push(vote);

        // Actualizar estadísticas del validador
        validators[validatorCommitment].totalValidations++;

        emit NewsValidated(newsHash, vote, msg.sender);

        // Verificar si se puede finalizar validación
        if (newsRegistry[newsHash].validators.length >= MIN_VALIDATION_VOTES) {
            _finalizeValidation(newsHash);
        }
    }

    /**
     * @dev Finaliza la validación de una noticia
     */
    function _finalizeValidation(bytes32 newsHash) internal {
        AnonymousNews storage news = newsRegistry[newsHash];

        // Calcular score promedio ponderado por reputación
        uint256 totalScore = 0;
        uint256 totalWeight = 0;

        for (uint i = 0; i < news.validators.length; i++) {
            bytes32 validatorCommitment = addressToCommitment[
                news.validators[i]
            ];
            uint256 weight = validators[validatorCommitment].reputation;
            totalScore += news.votes[i] * weight;
            totalWeight += weight;
        }

        if (totalWeight > 0) {
            news.validationScore = totalScore / totalWeight;
        }

        // Marcar como validada si supera el umbral
        if (news.validationScore >= VALIDATION_THRESHOLD) {
            news.isValidated = true;
            validatedNewsHashes.push(newsHash);

            // Distribuir recompensas a validadores
            _distributeValidationRewards(newsHash);

            // Si supera el umbral de anclaje, preparar para Bitcoin
            if (news.validationScore >= ANCHOR_THRESHOLD) {
                _prepareForAnchoring(newsHash);
            }
        }
    }

    /**
     * @dev Prepara una noticia para ser anclada en Bitcoin via Citrea
     */
    function _prepareForAnchoring(bytes32 newsHash) internal {
        AnonymousNews storage news = newsRegistry[newsHash];

        // Marcar para anclaje
        news.isAnchored = true;
        anchoredNewsHashes.push(newsHash);

        emit NewsAnchored(newsHash, block.number);

        // En Citrea, esto triggearía el proceso de settlement en Bitcoin
        // El estado se incluiría en el próximo batch que se envía a Bitcoin
    }

    /**
     * @dev Distribuye recompensas de validación
     */
    function _distributeValidationRewards(bytes32 newsHash) internal {
        AnonymousNews storage news = newsRegistry[newsHash];

        if (news.donationPool > 0 && news.validators.length > 0) {
            uint256 rewardPerValidator = news.donationPool /
                news.validators.length;

            for (uint i = 0; i < news.validators.length; i++) {
                payable(news.validators[i]).transfer(rewardPerValidator);

                // Actualizar reputación basada en acierto
                bytes32 validatorCommitment = addressToCommitment[
                    news.validators[i]
                ];
                if (news.votes[i] >= VALIDATION_THRESHOLD) {
                    validators[validatorCommitment].reputation += 5;
                } else {
                    if (validators[validatorCommitment].reputation > 5) {
                        validators[validatorCommitment].reputation -= 5;
                    }
                }
            }

            // Marcar donaciones como distribuidas
            AnonymousDonation[] storage donations = newsDonations[newsHash];
            for (uint i = 0; i < donations.length; i++) {
                donations[i].isDistributed = true;
            }

            emit RewardsDistributed(newsHash, news.donationPool);
            news.donationPool = 0;
        }
    }

    /**
     * @dev Obtiene información de una noticia
     */
    function getNewsInfo(
        bytes32 newsHash
    )
        external
        view
        returns (
            bytes32 contentHash,
            uint256 timestamp,
            uint256 donationPool,
            uint256 validationScore,
            bool isValidated,
            bool isAnchored,
            string memory ipfsHash,
            uint256 validatorCount
        )
    {
        AnonymousNews storage news = newsRegistry[newsHash];
        return (
            news.contentHash,
            news.timestamp,
            news.donationPool,
            news.validationScore,
            news.isValidated,
            news.isAnchored,
            news.ipfsHash,
            news.validators.length
        );
    }

    /**
     * @dev Obtiene estadísticas globales
     */
    function getGlobalStats()
        external
        view
        returns (
            uint256 totalNews,
            uint256 validatedNews,
            uint256 anchoredNews,
            uint256 totalDonations
        )
    {
        return (
            allNewsHashes.length,
            validatedNewsHashes.length,
            anchoredNewsHashes.length,
            totalDonationPool
        );
    }

    /**
     * @dev Verifica prueba ZK del validador (mock implementation)
     */
    function verifyValidatorZKProof(
        bytes32 commitment,
        bytes memory proof
    ) internal pure returns (bool) {
        // En implementación real, verificaría la prueba ZK
        return proof.length > 0 && commitment != bytes32(0);
    }

    /**
     * @dev Verifica prueba ZK del publicador (mock implementation)
     */
    function verifyPublisherZKProof(
        bytes32 zkProofHash,
        bytes memory proof
    ) internal pure returns (bool) {
        // En implementación real, verificaría identidad sin revelarla
        return proof.length > 0 && zkProofHash != bytes32(0);
    }

    /**
     * @dev Verifica prueba ZK de donación (mock implementation)
     */
    function verifyDonationZKProof(
        bytes32 donorCommitment,
        uint256 amount,
        bytes memory proof
    ) internal pure returns (bool) {
        // En implementación real, verificaría la donación sin revelar identidad
        return proof.length > 0 && donorCommitment != bytes32(0) && amount > 0;
    }

    /**
     * @dev Verifica prueba ZK de validación (mock implementation)
     */
    function verifyValidationZKProof(
        bytes32 validatorCommitment,
        bytes32 newsHash,
        uint256 vote,
        bytes memory proof
    ) internal pure returns (bool) {
        // En implementación real, verificaría que el validador puede votar sin revelar identidad completa
        return
            proof.length > 0 &&
            validatorCommitment != bytes32(0) &&
            newsHash != bytes32(0) &&
            vote <= 100;
    }

    /**
     * @dev Funciones de administración
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateValidatorFee(uint256 newFee) external onlyOwner {
        validatorFee = newFee;
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
