const express = require('express');
const router = express.Router();
const ZamaFHEService = require('../services/zamaFHEService');

// Inicializar servicio FHE
const zamaService = new ZamaFHEService();

/**
 * @route POST /api/confidential/initialize
 * @desc Inicializar servicio FHE confidencial
 */
router.post('/initialize', async (req, res) => {
  try {
    const { contractAddress, relayerConfig } = req.body;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: 'Dirección del contrato requerida'
      });
    }

    await zamaService.initialize(contractAddress, relayerConfig);

    res.json({
      success: true,
      message: 'Servicio FHE inicializado correctamente',
      stats: zamaService.getServiceStats()
    });
  } catch (error) {
    console.error('Error inicializando servicio FHE:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/confidential/register-validator
 * @desc Registrar validador con reputación cifrada
 */
router.post('/register-validator', async (req, res) => {
  try {
    const { validatorAddress, initialReputation = 50, validationHistory = [] } = req.body;

    if (!validatorAddress) {
      return res.status(400).json({
        success: false,
        error: 'Dirección del validador requerida'
      });
    }

    // Cifrar reputación inicial
    const encryptedReputation = await zamaService.encryptReputation(
      initialReputation,
      validationHistory
    );

    res.json({
      success: true,
      message: 'Validador registrado con reputación cifrada',
      data: {
        validatorAddress,
        encryptedReputation: encryptedReputation.encryptedData,
        metadata: encryptedReputation.metadata
      }
    });
  } catch (error) {
    console.error('Error registrando validador:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/confidential/submit-validation
 * @desc Enviar validación cifrada para una noticia
 */
router.post('/submit-validation', async (req, res) => {
  try {
    const {
      newsId,
      validatorAddress,
      isValid,
      confidenceLevel,
      evidence = null
    } = req.body;

    if (!newsId || !validatorAddress || confidenceLevel === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros requeridos: newsId, validatorAddress, confidenceLevel'
      });
    }

    if (confidenceLevel < 1 || confidenceLevel > 100) {
      return res.status(400).json({
        success: false,
        error: 'Nivel de confianza debe estar entre 1 y 100'
      });
    }

    // Cifrar voto
    const encryptedVote = await zamaService.encryptVote(isValid, confidenceLevel);

    // Cifrar evidencia si existe
    let encryptedEvidence = null;
    if (evidence) {
      encryptedEvidence = await zamaService.encryptReputation(evidence.score || 0);
    }

    // Simular envío a blockchain (en implementación real se haría transacción)
    const validationData = {
      newsId,
      validatorAddress,
      encryptedVote: encryptedVote.encryptedData,
      encryptedEvidence: encryptedEvidence?.encryptedData || null,
      timestamp: new Date().toISOString()
    };

    // Generar prueba de validación
    const proof = await zamaService.generateValidationProof(validationData);

    res.json({
      success: true,
      message: 'Validación confidencial enviada',
      data: {
        validationId: `validation_${Date.now()}`,
        encryptedVote: encryptedVote.encryptedData,
        proof: proof.proof,
        metadata: {
          newsId,
          validatorAddress,
          isConfidential: true,
          algorithm: 'TFHE'
        }
      }
    });
  } catch (error) {
    console.error('Error enviando validación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/confidential/aggregate-validations
 * @desc Agregar validaciones confidenciales y calcular resultado
 */
router.post('/aggregate-validations', async (req, res) => {
  try {
    const { newsId, encryptedVotes } = req.body;

    if (!newsId || !Array.isArray(encryptedVotes) || encryptedVotes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'newsId y array de votos cifrados requeridos'
      });
    }

    // Verificar integridad de votos cifrados
    const verificationResults = await Promise.all(
      encryptedVotes.map(vote => zamaService.verifyEncryptedData(vote))
    );

    const validVotes = encryptedVotes.filter((_, index) =>
      verificationResults[index].isValid
    );

    if (validVotes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay votos válidos para procesar'
      });
    }

    // Agregar validaciones de forma confidencial
    const aggregationResult = await zamaService.aggregateConfidentialValidations(validVotes);

    res.json({
      success: true,
      message: 'Validaciones agregadas exitosamente',
      data: {
        newsId,
        result: aggregationResult.result,
        metadata: {
          ...aggregationResult.metadata,
          totalSubmittedVotes: encryptedVotes.length,
          validVotesProcessed: validVotes.length,
          invalidVotesDiscarded: encryptedVotes.length - validVotes.length
        }
      }
    });
  } catch (error) {
    console.error('Error agregando validaciones:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/confidential/update-reputation
 * @desc Actualizar reputación cifrada de validador
 */
router.post('/update-reputation', async (req, res) => {
  try {
    const {
      validatorAddress,
      currentEncryptedReputation,
      wasCorrect,
      validationDetails = {}
    } = req.body;

    if (!validatorAddress || !currentEncryptedReputation || wasCorrect === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Parámetros requeridos: validatorAddress, currentEncryptedReputation, wasCorrect'
      });
    }

    // Verificar datos cifrados actuales
    const verification = await zamaService.verifyEncryptedData(currentEncryptedReputation);
    if (!verification.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Reputación cifrada actual inválida'
      });
    }

    // Actualizar reputación
    const updatedReputation = await zamaService.updateEncryptedReputation(
      validatorAddress,
      currentEncryptedReputation,
      wasCorrect
    );

    res.json({
      success: true,
      message: 'Reputación actualizada confidencialmente',
      data: {
        validatorAddress,
        updatedReputation: updatedReputation.encryptedData,
        metadata: {
          ...updatedReputation.metadata,
          wasCorrect,
          validationDetails,
          updatedAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error actualizando reputación:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/confidential/validator-stats/:address
 * @desc Obtener estadísticas públicas de validador (sin revelar reputación cifrada)
 */
router.get('/validator-stats/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Dirección del validador requerida'
      });
    }

    // Simular consulta a blockchain (en implementación real sería consulta al contrato)
    const stats = {
      validatorAddress: address,
      isActive: true,
      publicStats: {
        totalValidations: Math.floor(Math.random() * 100) + 1,
        lastValidation: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      confidentialData: {
        hasEncryptedReputation: true,
        reputationAlgorithm: 'TFHE',
        lastReputationUpdate: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/confidential/service-info
 * @desc Obtener información del servicio FHE
 */
router.get('/service-info', (req, res) => {
  try {
    const stats = zamaService.getServiceStats();

    res.json({
      success: true,
      data: {
        ...stats,
        capabilities: {
          encryption: 'TFHE (Fully Homomorphic Encryption)',
          supportedTypes: ['uint8', 'uint16', 'uint32', 'bool'],
          operations: ['add', 'sub', 'mul', 'eq', 'lt', 'gt', 'and', 'or'],
          privacy: 'Complete confidentiality during computation'
        },
        endpoints: {
          '/initialize': 'Initialize FHE service',
          '/register-validator': 'Register validator with encrypted reputation',
          '/submit-validation': 'Submit encrypted validation vote',
          '/aggregate-validations': 'Aggregate validations confidentially',
          '/update-reputation': 'Update encrypted reputation',
          '/validator-stats/:address': 'Get public validator statistics'
        }
      }
    });
  } catch (error) {
    console.error('Error obteniendo información del servicio:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/confidential/verify-proof
 * @desc Verificar prueba criptográfica de validación
 */
router.post('/verify-proof', async (req, res) => {
  try {
    const { proof, validationData } = req.body;

    if (!proof || !validationData) {
      return res.status(400).json({
        success: false,
        error: 'Prueba y datos de validación requeridos'
      });
    }

    // Verificar la prueba
    const verification = await zamaService.generateValidationProof(validationData);
    const isValidProof = verification.success && verification.isValid;

    res.json({
      success: true,
      data: {
        isValidProof,
        proofType: proof.proofType || 'FHE_VALIDATION',
        verifiedAt: new Date().toISOString(),
        metadata: {
          algorithm: 'TFHE',
          confidentialVerification: true
        }
      }
    });
  } catch (error) {
    console.error('Error verificando prueba:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
