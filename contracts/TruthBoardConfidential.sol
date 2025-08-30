// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IFHEVM.sol";

/**
 * @title TruthBoardConfidential
 * @dev Validación confidencial de noticias usando Fully Homomorphic Encryption (FHE) de Zama
 * Protege la identidad, reputación y votos de los validadores
 */
contract TruthBoardConfidential {
    // Interfaz FHE de Zama
    IFHEVM public immutable fhevm;

    // Eventos
    event NewsSubmitted(
        uint256 indexed newsId,
        address indexed submitter,
        bytes32 contentHash
    );
    event ValidationSubmitted(
        uint256 indexed newsId,
        address indexed validator,
        bytes encryptedVote
    );
    event ValidationCompleted(
        uint256 indexed newsId,
        bool isValid,
        uint8 confidenceScore
    );
    event ReputationUpdated(
        address indexed validator,
        bytes encryptedReputation
    );

    // Estructuras de datos
    struct ConfidentialNews {
        bytes32 contentHash;
        address submitter;
        uint256 timestamp;
        bool isValidated;
        bool validationResult;
        uint8 confidenceScore;
        uint8 totalValidators;
        mapping(address => bool) hasValidated;
    }

    struct ConfidentialValidator {
        bool isActive;
        bytes encryptedReputation; // Reputación cifrada con FHE
        uint256 validationsCount;
        uint256 lastValidation;
    }

    // Variables de estado
    mapping(uint256 => ConfidentialNews) public confidentialNews;
    mapping(address => ConfidentialValidator) public confidentialValidators;
    mapping(uint256 => mapping(address => bytes)) private encryptedVotes; // Votos cifrados

    uint256 public newsCounter;
    uint256 public constant MIN_VALIDATORS = 3;
    uint256 public constant MAX_VALIDATORS = 10;

    address public owner;

    // Modificadores
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Solo el propietario puede ejecutar esta funcion"
        );
        _;
    }

    modifier onlyActiveValidator() {
        require(
            confidentialValidators[msg.sender].isActive,
            "No eres un validador activo"
        );
        _;
    }

    modifier validNewsId(uint256 newsId) {
        require(newsId > 0 && newsId <= newsCounter, "ID de noticia invalido");
        _;
    }

    constructor(address _fhevmAddress) {
        fhevm = IFHEVM(_fhevmAddress);
        owner = msg.sender;
        newsCounter = 0;
    }

    /**
     * @dev Registra un nuevo validador con reputación inicial cifrada
     */
    function registerValidator(
        bytes calldata encryptedInitialReputation
    ) external {
        require(
            !confidentialValidators[msg.sender].isActive,
            "Ya eres un validador activo"
        );

        confidentialValidators[msg.sender] = ConfidentialValidator({
            isActive: true,
            encryptedReputation: encryptedInitialReputation,
            validationsCount: 0,
            lastValidation: 0
        });
    }

    /**
     * @dev Envía una noticia para validación confidencial
     */
    function submitNewsForValidation(
        bytes32 contentHash,
        string calldata metadataIPFS
    ) external returns (uint256) {
        newsCounter++;

        ConfidentialNews storage news = confidentialNews[newsCounter];
        news.contentHash = contentHash;
        news.submitter = msg.sender;
        news.timestamp = block.timestamp;
        news.isValidated = false;
        news.totalValidators = 0;

        emit NewsSubmitted(newsCounter, msg.sender, contentHash);
        return newsCounter;
    }

    /**
     * @dev Envía un voto cifrado para validar una noticia
     * @param newsId ID de la noticia a validar
     * @param encryptedVote Voto cifrado (true/false con nivel de confianza)
     * @param encryptedEvidence Evidencia cifrada opcional
     */
    function submitConfidentialValidation(
        uint256 newsId,
        bytes calldata encryptedVote,
        bytes calldata encryptedEvidence
    ) external onlyActiveValidator validNewsId(newsId) {
        ConfidentialNews storage news = confidentialNews[newsId];

        require(!news.isValidated, "Esta noticia ya fue validada");
        require(!news.hasValidated[msg.sender], "Ya validaste esta noticia");
        require(
            news.totalValidators < MAX_VALIDATORS,
            "Maximo de validadores alcanzado"
        );

        // Guardar voto cifrado
        encryptedVotes[newsId][msg.sender] = encryptedVote;
        news.hasValidated[msg.sender] = true;
        news.totalValidators++;

        // Actualizar contador del validador
        confidentialValidators[msg.sender].validationsCount++;
        confidentialValidators[msg.sender].lastValidation = block.timestamp;

        emit ValidationSubmitted(newsId, msg.sender, encryptedVote);

        // Si tenemos suficientes validadores, procesar resultado
        if (news.totalValidators >= MIN_VALIDATORS) {
            _processConfidentialValidation(newsId);
        }
    }

    /**
     * @dev Procesa la validación usando operaciones FHE
     */
    function _processConfidentialValidation(uint256 newsId) private {
        ConfidentialNews storage news = confidentialNews[newsId];

        // Aquí aplicaríamos operaciones FHE para:
        // 1. Sumar votos cifrados sin descifrarlos
        // 2. Calcular promedio de confianza
        // 3. Determinar resultado final

        // Por simplicidad, simulamos el proceso FHE
        // En implementación real, usaríamos las librerías de Zama
        uint8 positiveVotes = 0;
        uint8 totalConfidence = 0;

        // Nota: En FHE real, esto se haría sin descifrar
        for (uint8 i = 0; i < news.totalValidators; i++) {
            // Simulación de operaciones FHE
            positiveVotes++; // Placeholder
            totalConfidence += 85; // Placeholder
        }

        bool isValid = positiveVotes > (news.totalValidators / 2);
        uint8 avgConfidence = totalConfidence / news.totalValidators;

        news.isValidated = true;
        news.validationResult = isValid;
        news.confidenceScore = avgConfidence;

        emit ValidationCompleted(newsId, isValid, avgConfidence);

        // Actualizar reputaciones cifradas de validadores
        _updateValidatorReputations(newsId, isValid);
    }

    /**
     * @dev Actualiza las reputaciones cifradas de los validadores
     */
    function _updateValidatorReputations(
        uint256 newsId,
        bool correctValidation
    ) private {
        ConfidentialNews storage news = confidentialNews[newsId];

        // Iterar sobre validadores y actualizar reputaciones de forma cifrada
        // En implementación FHE real, las operaciones serían completamente cifradas

        // Placeholder para operaciones FHE de reputación
        // Las reputaciones se actualizarían sin revelar valores exactos
    }

    /**
     * @dev Obtiene información pública de una noticia (sin datos sensibles)
     */
    function getNewsInfo(
        uint256 newsId
    )
        external
        view
        validNewsId(newsId)
        returns (
            bytes32 contentHash,
            address submitter,
            uint256 timestamp,
            bool isValidated,
            bool validationResult,
            uint8 confidenceScore,
            uint8 totalValidators
        )
    {
        ConfidentialNews storage news = confidentialNews[newsId];
        return (
            news.contentHash,
            news.submitter,
            news.timestamp,
            news.isValidated,
            news.validationResult,
            news.confidenceScore,
            news.totalValidators
        );
    }

    /**
     * @dev Obtiene la reputación cifrada de un validador
     */
    function getValidatorEncryptedReputation(
        address validator
    ) external view returns (bytes memory) {
        require(
            confidentialValidators[validator].isActive,
            "Validador no activo"
        );
        return confidentialValidators[validator].encryptedReputation;
    }

    /**
     * @dev Obtiene estadísticas públicas de un validador
     */
    function getValidatorStats(
        address validator
    )
        external
        view
        returns (
            bool isActive,
            uint256 validationsCount,
            uint256 lastValidation
        )
    {
        ConfidentialValidator storage val = confidentialValidators[validator];
        return (val.isActive, val.validationsCount, val.lastValidation);
    }

    /**
     * @dev Funciones de emergencia para el owner
     */
    function pauseValidator(address validator) external onlyOwner {
        confidentialValidators[validator].isActive = false;
    }

    function unpauseValidator(address validator) external onlyOwner {
        confidentialValidators[validator].isActive = true;
    }

    /**
     * @dev Obtiene el total de noticias en el sistema
     */
    function getTotalNews() external view returns (uint256) {
        return newsCounter;
    }

    /**
     * @dev Verifica si un validador ha validado una noticia específica
     */
    function hasValidatorValidated(
        uint256 newsId,
        address validator
    ) external view returns (bool) {
        return confidentialNews[newsId].hasValidated[validator];
    }
}
