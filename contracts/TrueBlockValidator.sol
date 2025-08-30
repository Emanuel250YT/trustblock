// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TrueBlockValidator
 * @dev Smart contract principal para la validación de noticias en TrueBlock
 * Maneja el staking, slashing y consenso de oráculos y validadores comunitarios
 */
contract TrueBlockValidator is ReentrancyGuard, Ownable, Pausable {
    // Estructura para almacenar información de validación de noticias
    struct NewsValidation {
        string contentHash; // Hash IPFS del contenido
        address[] oracles; // Oráculos que validaron
        address[] validators; // Validadores comunitarios
        uint256[] oracleVotes; // Votos de oráculos (0=fake, 1=real, 2=uncertain)
        uint256[] validatorVotes; // Votos de validadores comunitarios
        uint256 timestamp;
        uint256 finalScore; // Puntuación final (0-100)
        bool isFinalized;
        string evidenceHash; // Hash IPFS de evidencias
    }

    // Estructura para oráculos de IA
    struct Oracle {
        address oracleAddress;
        uint256 stake;
        uint256 reputation; // Reputación basada en aciertos
        bool isActive;
        string specialization; // "fake_news", "deepfake", "image_manipulation"
    }

    // Estructura para validadores comunitarios
    struct CommunityValidator {
        address validatorAddress;
        uint256 stake;
        uint256 reputation;
        bool isActive;
        string category; // "journalist", "fact_checker", "expert"
    }

    // Variables de estado
    mapping(string => NewsValidation) public validations;
    mapping(address => Oracle) public oracles;
    mapping(address => CommunityValidator) public communityValidators;

    address[] public activeOracles;
    address[] public activeCommunityValidators;

    uint256 public constant MIN_ORACLE_STAKE = 1 ether;
    uint256 public constant MIN_VALIDATOR_STAKE = 0.1 ether;
    uint256 public constant VALIDATION_REWARD = 0.01 ether;
    uint256 public constant SLASHING_PERCENTAGE = 30; // 30% del stake

    // Eventos
    event NewsSubmitted(string indexed contentHash, address indexed submitter);
    event OracleValidated(
        string indexed contentHash,
        address indexed oracle,
        uint256 vote
    );
    event CommunityValidated(
        string indexed contentHash,
        address indexed validator,
        uint256 vote
    );
    event ValidationFinalized(string indexed contentHash, uint256 finalScore);
    event OracleRegistered(address indexed oracle, string specialization);
    event ValidatorRegistered(address indexed validator, string category);
    event StakeSlashed(address indexed participant, uint256 amount);
    event RewardDistributed(address indexed participant, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Registra un oráculo de IA
     */
    function registerOracle(string memory specialization) external payable {
        require(
            msg.value >= MIN_ORACLE_STAKE,
            "Stake insuficiente para oraculo"
        );
        require(!oracles[msg.sender].isActive, "Oraculo ya registrado");

        oracles[msg.sender] = Oracle({
            oracleAddress: msg.sender,
            stake: msg.value,
            reputation: 100, // Reputación inicial
            isActive: true,
            specialization: specialization
        });

        activeOracles.push(msg.sender);
        emit OracleRegistered(msg.sender, specialization);
    }

    /**
     * @dev Registra un validador comunitario
     */
    function registerCommunityValidator(
        string memory category
    ) external payable {
        require(
            msg.value >= MIN_VALIDATOR_STAKE,
            "Stake insuficiente para validador"
        );
        require(
            !communityValidators[msg.sender].isActive,
            "Validador ya registrado"
        );

        communityValidators[msg.sender] = CommunityValidator({
            validatorAddress: msg.sender,
            stake: msg.value,
            reputation: 100,
            isActive: true,
            category: category
        });

        activeCommunityValidators.push(msg.sender);
        emit ValidatorRegistered(msg.sender, category);
    }

    /**
     * @dev Envía una noticia para validación
     */
    function submitNews(string memory contentHash) external {
        require(bytes(contentHash).length > 0, "Hash de contenido requerido");
        require(!validations[contentHash].isFinalized, "Noticia ya validada");

        if (validations[contentHash].timestamp == 0) {
            validations[contentHash] = NewsValidation({
                contentHash: contentHash,
                oracles: new address[](0),
                validators: new address[](0),
                oracleVotes: new uint256[](0),
                validatorVotes: new uint256[](0),
                timestamp: block.timestamp,
                finalScore: 0,
                isFinalized: false,
                evidenceHash: ""
            });
        }

        emit NewsSubmitted(contentHash, msg.sender);
    }

    /**
     * @dev Permite a un oráculo votar sobre una noticia
     */
    function oracleValidate(
        string memory contentHash,
        uint256 vote,
        string memory evidenceHash
    ) external whenNotPaused {
        require(oracles[msg.sender].isActive, "Oraculo no activo");
        require(vote <= 2, "Voto invalido"); // 0=fake, 1=real, 2=uncertain
        require(
            !validations[contentHash].isFinalized,
            "Validacion ya finalizada"
        );

        NewsValidation storage validation = validations[contentHash];

        // Verificar que el oráculo no haya votado ya
        for (uint i = 0; i < validation.oracles.length; i++) {
            require(validation.oracles[i] != msg.sender, "Oraculo ya voto");
        }

        validation.oracles.push(msg.sender);
        validation.oracleVotes.push(vote);

        if (
            bytes(evidenceHash).length > 0 &&
            bytes(validation.evidenceHash).length == 0
        ) {
            validation.evidenceHash = evidenceHash;
        }

        emit OracleValidated(contentHash, msg.sender, vote);

        // Intentar finalizar si hay suficientes votos
        _tryFinalize(contentHash);
    }

    /**
     * @dev Permite a un validador comunitario votar
     */
    function communityValidate(
        string memory contentHash,
        uint256 vote
    ) external whenNotPaused {
        require(
            communityValidators[msg.sender].isActive,
            "Validador no activo"
        );
        require(vote <= 2, "Voto invalido");
        require(
            !validations[contentHash].isFinalized,
            "Validacion ya finalizada"
        );

        NewsValidation storage validation = validations[contentHash];

        // Verificar que el validador no haya votado ya
        for (uint i = 0; i < validation.validators.length; i++) {
            require(
                validation.validators[i] != msg.sender,
                "Validador ya voto"
            );
        }

        validation.validators.push(msg.sender);
        validation.validatorVotes.push(vote);

        emit CommunityValidated(contentHash, msg.sender, vote);

        // Intentar finalizar
        _tryFinalize(contentHash);
    }

    /**
     * @dev Intenta finalizar la validación si hay suficientes votos
     */
    function _tryFinalize(string memory contentHash) internal {
        NewsValidation storage validation = validations[contentHash];

        // Requiere al menos 3 oráculos y 5 validadores para finalizar
        if (
            validation.oracles.length >= 3 && validation.validators.length >= 5
        ) {
            _finalizeValidation(contentHash);
        }
    }

    /**
     * @dev Finaliza la validación y calcula el score final
     */
    function _finalizeValidation(string memory contentHash) internal {
        NewsValidation storage validation = validations[contentHash];

        // Calcular consenso de oráculos (peso 70%)
        uint256 oracleScore = _calculateOracleConsensus(validation.oracleVotes);

        // Calcular consenso comunitario (peso 30%)
        uint256 communityScore = _calculateCommunityConsensus(
            validation.validatorVotes
        );

        // Score final ponderado
        validation.finalScore = (oracleScore * 70 + communityScore * 30) / 100;
        validation.isFinalized = true;

        emit ValidationFinalized(contentHash, validation.finalScore);

        // Distribuir recompensas y aplicar slashing si es necesario
        _distributeRewardsAndSlashing(contentHash);
    }

    /**
     * @dev Calcula el consenso de oráculos
     */
    function _calculateOracleConsensus(
        uint256[] memory votes
    ) internal pure returns (uint256) {
        if (votes.length == 0) return 50;

        uint256 realVotes = 0;
        uint256 fakeVotes = 0;

        for (uint i = 0; i < votes.length; i++) {
            if (votes[i] == 1) realVotes++;
            else if (votes[i] == 0) fakeVotes++;
            // Votos inciertos (2) no cuentan
        }

        uint256 totalDecisiveVotes = realVotes + fakeVotes;
        if (totalDecisiveVotes == 0) return 50; // Neutral si solo hay votos inciertos

        return (realVotes * 100) / totalDecisiveVotes;
    }

    /**
     * @dev Calcula el consenso comunitario
     */
    function _calculateCommunityConsensus(
        uint256[] memory votes
    ) internal pure returns (uint256) {
        if (votes.length == 0) return 50;

        uint256 realVotes = 0;
        uint256 fakeVotes = 0;

        for (uint i = 0; i < votes.length; i++) {
            if (votes[i] == 1) realVotes++;
            else if (votes[i] == 0) fakeVotes++;
        }

        uint256 totalDecisiveVotes = realVotes + fakeVotes;
        if (totalDecisiveVotes == 0) return 50;

        return (realVotes * 100) / totalDecisiveVotes;
    }

    /**
     * @dev Distribuye recompensas y aplica slashing
     */
    function _distributeRewardsAndSlashing(string memory contentHash) internal {
        NewsValidation storage validation = validations[contentHash];
        uint256 majorityVote = validation.finalScore >= 50 ? 1 : 0;

        // Recompensar oráculos que votaron con la mayoría
        for (uint i = 0; i < validation.oracles.length; i++) {
            address oracle = validation.oracles[i];
            uint256 vote = validation.oracleVotes[i];

            if (vote == majorityVote) {
                // Recompensar
                _rewardParticipant(oracle, VALIDATION_REWARD);
                oracles[oracle].reputation += 5;
            } else if (vote != 2) {
                // No slashing por votos inciertos
                // Slashing
                _slashParticipant(oracle, true);
                if (oracles[oracle].reputation > 10) {
                    oracles[oracle].reputation -= 10;
                }
            }
        }

        // Recompensar validadores comunitarios
        for (uint i = 0; i < validation.validators.length; i++) {
            address validator = validation.validators[i];
            uint256 vote = validation.validatorVotes[i];

            if (vote == majorityVote) {
                _rewardParticipant(validator, VALIDATION_REWARD / 2);
                communityValidators[validator].reputation += 3;
            } else if (vote != 2) {
                _slashParticipant(validator, false);
                if (communityValidators[validator].reputation > 5) {
                    communityValidators[validator].reputation -= 5;
                }
            }
        }
    }

    /**
     * @dev Recompensa a un participante
     */
    function _rewardParticipant(address participant, uint256 amount) internal {
        payable(participant).transfer(amount);
        emit RewardDistributed(participant, amount);
    }

    /**
     * @dev Aplica slashing a un participante
     */
    function _slashParticipant(address participant, bool isOracle) internal {
        uint256 slashAmount;

        if (isOracle) {
            slashAmount =
                (oracles[participant].stake * SLASHING_PERCENTAGE) /
                100;
            oracles[participant].stake -= slashAmount;
        } else {
            slashAmount =
                (communityValidators[participant].stake * SLASHING_PERCENTAGE) /
                100;
            communityValidators[participant].stake -= slashAmount;
        }

        emit StakeSlashed(participant, slashAmount);
    }

    /**
     * @dev Obtiene información de validación
     */
    function getValidation(
        string memory contentHash
    )
        external
        view
        returns (
            address[] memory oracleAddresses,
            uint256[] memory oracleVotes,
            address[] memory validatorAddresses,
            uint256[] memory validatorVotes,
            uint256 finalScore,
            bool isFinalized,
            string memory evidenceHash
        )
    {
        NewsValidation storage validation = validations[contentHash];
        return (
            validation.oracles,
            validation.oracleVotes,
            validation.validators,
            validation.validatorVotes,
            validation.finalScore,
            validation.isFinalized,
            validation.evidenceHash
        );
    }

    /**
     * @dev Permite retirar stake (solo si no hay validaciones pendientes)
     */
    function withdrawStake() external nonReentrant {
        require(
            oracles[msg.sender].isActive ||
                communityValidators[msg.sender].isActive,
            "No eres un participante activo"
        );

        uint256 withdrawAmount;

        if (oracles[msg.sender].isActive) {
            withdrawAmount = oracles[msg.sender].stake;
            oracles[msg.sender].stake = 0;
            oracles[msg.sender].isActive = false;
        } else {
            withdrawAmount = communityValidators[msg.sender].stake;
            communityValidators[msg.sender].stake = 0;
            communityValidators[msg.sender].isActive = false;
        }

        require(withdrawAmount > 0, "No hay stake para retirar");
        payable(msg.sender).transfer(withdrawAmount);
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

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
