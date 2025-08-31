// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/FlareInterfaces.sol";

/**
 * @title TrueBlockFlareOracle
 * @dev Oracle hub integrado con Flare Network para TrueBlock ecosystem
 * Utiliza FTSO, FDC y Secure Random para validación de noticias
 */
contract TrueBlockFlareOracle {
    // Interfaces de Flare
    FtsoV2Interface private ftso;
    FdcInterface private fdc;
    SecureRandomInterface private secureRandom;

    // Estado del contrato
    address public owner;
    mapping(bytes32 => NewsValidation) public validations;
    mapping(string => MediaCredibility) public mediaCredibility;
    mapping(address => ValidatorProfile) public validators;

    // Estructuras de datos
    struct NewsValidation {
        bytes32 newsHash;
        string sourceUrl;
        uint256 timestamp;
        uint256 credibilityScore;
        uint256 priceContext;
        bytes32 randomSeed;
        bool isValidated;
        address[] validators;
        mapping(address => bool) hasValidated;
    }

    struct MediaCredibility {
        string mediaName;
        uint256 credibilityScore;
        uint256 validationsCount;
        uint256 lastUpdate;
        bool isVerified;
    }

    struct ValidatorProfile {
        uint256 reputation;
        uint256 validationsCount;
        uint256 stakedAmount;
        bool isActive;
    }

    // Eventos
    event NewsSubmitted(
        bytes32 indexed newsHash,
        string sourceUrl,
        uint256 timestamp
    );
    event ValidationCompleted(
        bytes32 indexed newsHash,
        uint256 credibilityScore
    );
    event MediaCredibilityUpdated(string mediaName, uint256 newScore);
    event ValidatorRegistered(address indexed validator, uint256 stakedAmount);

    // Modificadores
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Solo el owner puede ejecutar esta funcion"
        );
        _;
    }

    modifier onlyActiveValidator() {
        require(validators[msg.sender].isActive, "Validador no activo");
        _;
    }

    constructor(
        address _ftsoAddress,
        address _fdcAddress,
        address _secureRandomAddress
    ) {
        owner = msg.sender;
        ftso = FtsoV2Interface(_ftsoAddress);
        fdc = FdcInterface(_fdcAddress);
        secureRandom = SecureRandomInterface(_secureRandomAddress);
    }

    /**
     * @dev Registrar nuevo validador con stake
     */
    function registerValidator() external payable {
        require(msg.value >= 0.1 ether, "Stake minimo requerido");
        require(!validators[msg.sender].isActive, "Validador ya registrado");

        validators[msg.sender] = ValidatorProfile({
            reputation: 100,
            validationsCount: 0,
            stakedAmount: msg.value,
            isActive: true
        });

        emit ValidatorRegistered(msg.sender, msg.value);
    }

    /**
     * @dev Enviar noticia para validación con contexto de precio
     */
    function submitNewsForValidation(
        bytes32 _newsHash,
        string memory _sourceUrl,
        string memory _priceSymbol
    ) external {
        require(_newsHash != bytes32(0), "Hash de noticia invalido");

        // Obtener precio actual usando FTSO
        uint256 currentPrice = getPriceFromFTSO(_priceSymbol);

        // Generar número aleatorio para selección de validadores
        bytes32 randomSeed = getSecureRandomNumber();

        // Crear nueva validación
        NewsValidation storage validation = validations[_newsHash];
        validation.newsHash = _newsHash;
        validation.sourceUrl = _sourceUrl;
        validation.timestamp = block.timestamp;
        validation.priceContext = currentPrice;
        validation.randomSeed = randomSeed;
        validation.isValidated = false;

        emit NewsSubmitted(_newsHash, _sourceUrl, block.timestamp);
    }

    /**
     * @dev Validar noticia usando datos de FDC
     */
    function validateNewsWithFDC(
        bytes32 _newsHash,
        bytes32 _attestationData,
        bytes32[] memory _merkleProof
    ) external onlyActiveValidator {
        NewsValidation storage validation = validations[_newsHash];
        require(!validation.isValidated, "Noticia ya validada");
        require(
            !validation.hasValidated[msg.sender],
            "Ya validaste esta noticia"
        );

        // Verificar datos usando FDC
        bool isDataValid = verifyFDCData(_attestationData, _merkleProof);
        require(isDataValid, "Datos FDC invalidos");

        // Registrar validación
        validation.validators.push(msg.sender);
        validation.hasValidated[msg.sender] = true;

        // Actualizar perfil del validador
        validators[msg.sender].validationsCount++;
        validators[msg.sender].reputation += 10;

        // Si hay suficientes validaciones, calcular score final
        if (validation.validators.length >= 3) {
            uint256 credibilityScore = calculateCredibilityScore(_newsHash);
            validation.credibilityScore = credibilityScore;
            validation.isValidated = true;

            emit ValidationCompleted(_newsHash, credibilityScore);
        }
    }

    /**
     * @dev Actualizar credibilidad de medio usando datos Web2
     */
    function updateMediaCredibility(
        string memory _mediaName,
        bytes32 _webDataHash,
        bytes32[] memory _merkleProof
    ) external {
        // Verificar datos Web2 usando FDC
        bool isDataValid = verifyFDCData(_webDataHash, _merkleProof);
        require(isDataValid, "Datos Web2 invalidos");

        MediaCredibility storage media = mediaCredibility[_mediaName];

        // Calcular nuevo score basado en datos Web2 verificados
        uint256 newScore = calculateMediaScore(_mediaName, _webDataHash);

        media.mediaName = _mediaName;
        media.credibilityScore = newScore;
        media.validationsCount++;
        media.lastUpdate = block.timestamp;
        media.isVerified = true;

        emit MediaCredibilityUpdated(_mediaName, newScore);
    }

    /**
     * @dev Obtener precio actual de un símbolo usando FTSO
     */
    function getPriceFromFTSO(
        string memory _symbol
    ) public view returns (uint256) {
        // Convertir símbolo a bytes21 para FTSO
        bytes21 symbolBytes = bytes21(bytes(_symbol));

        try ftso.getFeedValue(symbolBytes) returns (
            uint256 value,
            int8 decimals,
            uint64 timestamp
        ) {
            return value;
        } catch {
            return 0;
        }
    }

    /**
     * @dev Obtener múltiples precios para contexto económico
     */
    function getEconomicContext()
        external
        view
        returns (
            uint256 btcPrice,
            uint256 ethPrice,
            uint256 usdcPrice,
            uint256 timestamp
        )
    {
        btcPrice = getPriceFromFTSO("BTC");
        ethPrice = getPriceFromFTSO("ETH");
        usdcPrice = getPriceFromFTSO("USDC");
        timestamp = block.timestamp;
    }

    /**
     * @dev Generar número aleatorio seguro
     */
    function getSecureRandomNumber() public view returns (bytes32) {
        try secureRandom.getRandomNumber() returns (uint256 randomNum) {
            return keccak256(abi.encodePacked(randomNum, block.timestamp));
        } catch {
            return
                keccak256(abi.encodePacked(block.timestamp, block.prevrandao));
        }
    }

    /**
     * @dev Verificar datos usando FDC
     */
    function verifyFDCData(
        bytes32 _attestationData,
        bytes32[] memory _merkleProof
    ) internal view returns (bool) {
        // Implementar verificación FDC
        // Por ahora retornamos true para testing
        return true;
    }

    /**
     * @dev Calcular score de credibilidad de noticia
     */
    function calculateCredibilityScore(
        bytes32 _newsHash
    ) internal view returns (uint256) {
        NewsValidation storage validation = validations[_newsHash];

        uint256 baseScore = 50;
        uint256 validatorBonus = validation.validators.length * 10;
        uint256 timeBonus = block.timestamp - validation.timestamp < 3600
            ? 20
            : 0;

        // Aplicar contexto de precio para noticias económicas
        uint256 priceBonus = validation.priceContext > 0 ? 15 : 0;

        return baseScore + validatorBonus + timeBonus + priceBonus;
    }

    /**
     * @dev Calcular score de credibilidad de medio
     */
    function calculateMediaScore(
        string memory _mediaName,
        bytes32 _webDataHash
    ) internal pure returns (uint256) {
        // Algoritmo simplificado para calcular credibilidad
        uint256 baseScore = 60;
        uint256 dataBonus = uint256(_webDataHash) % 40; // 0-39 bonus

        return baseScore + dataBonus;
    }

    /**
     * @dev Obtener validación completa
     */
    function getValidation(
        bytes32 _newsHash
    )
        external
        view
        returns (
            string memory sourceUrl,
            uint256 timestamp,
            uint256 credibilityScore,
            uint256 priceContext,
            bool isValidated,
            uint256 validatorCount
        )
    {
        NewsValidation storage validation = validations[_newsHash];

        return (
            validation.sourceUrl,
            validation.timestamp,
            validation.credibilityScore,
            validation.priceContext,
            validation.isValidated,
            validation.validators.length
        );
    }

    /**
     * @dev Obtener credibilidad de medio
     */
    function getMediaCredibility(
        string memory _mediaName
    )
        external
        view
        returns (
            uint256 credibilityScore,
            uint256 validationsCount,
            uint256 lastUpdate,
            bool isVerified
        )
    {
        MediaCredibility storage media = mediaCredibility[_mediaName];

        return (
            media.credibilityScore,
            media.validationsCount,
            media.lastUpdate,
            media.isVerified
        );
    }

    /**
     * @dev Obtener perfil de validador
     */
    function getValidatorProfile(
        address _validator
    )
        external
        view
        returns (
            uint256 reputation,
            uint256 validationsCount,
            uint256 stakedAmount,
            bool isActive
        )
    {
        ValidatorProfile storage profile = validators[_validator];

        return (
            profile.reputation,
            profile.validationsCount,
            profile.stakedAmount,
            profile.isActive
        );
    }

    /**
     * @dev Retirar stake (solo validadores)
     */
    function withdrawStake() external {
        ValidatorProfile storage profile = validators[msg.sender];
        require(profile.isActive, "Validador no activo");
        require(profile.stakedAmount > 0, "No hay stake para retirar");

        uint256 amount = profile.stakedAmount;
        profile.stakedAmount = 0;
        profile.isActive = false;

        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Funciones de emergencia para el owner
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function updateInterfaces(
        address _newFtso,
        address _newFdc,
        address _newSecureRandom
    ) external onlyOwner {
        if (_newFtso != address(0)) ftso = FtsoV2Interface(_newFtso);
        if (_newFdc != address(0)) fdc = FdcInterface(_newFdc);
        if (_newSecureRandom != address(0))
            secureRandom = SecureRandomInterface(_newSecureRandom);
    }
}
