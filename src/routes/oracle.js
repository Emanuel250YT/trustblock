const express = require('express');
const router = express.Router();
const oracleService = require('../services/oracleService');
const blockchainService = require('../services/blockchainService');

/**
 * @route POST /api/oracle/register
 * @desc Registra un nuevo oráculo de IA
 */
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, specialization, stake, signature } = req.body;

    if (!walletAddress || !specialization || !stake || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos: walletAddress, specialization, stake, signature'
      });
    }

    const validSpecializations = ['fake_news', 'deepfake', 'image_manipulation', 'text_analysis'];
    if (!validSpecializations.includes(specialization)) {
      return res.status(400).json({
        error: 'Especialización inválida',
        validOptions: validSpecializations
      });
    }

    // Verificar firma
    const isValidSignature = await oracleService.verifyOracleSignature(
      walletAddress,
      signature,
      specialization
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Registrar en blockchain
    const txHash = await blockchainService.registerOracle(
      walletAddress,
      specialization,
      stake
    );

    // Guardar configuración del oráculo
    await oracleService.saveOracleConfig(walletAddress, {
      specialization,
      stake,
      isActive: true,
      registrationTx: txHash
    });

    res.status(201).json({
      success: true,
      message: 'Oráculo registrado exitosamente',
      data: {
        walletAddress,
        specialization,
        stake,
        transactionHash: txHash
      }
    });

  } catch (error) {
    console.error('Error al registrar oráculo:', error);
    res.status(500).json({
      error: 'Error al registrar oráculo',
      message: error.message
    });
  }
});

/**
 * @route POST /api/oracle/validate
 * @desc Permite a un oráculo validar contenido
 */
router.post('/validate', async (req, res) => {
  try {
    const {
      walletAddress,
      contentHash,
      vote,
      evidenceHash,
      confidence,
      signature
    } = req.body;

    if (!walletAddress || !contentHash || vote === undefined || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos: walletAddress, contentHash, vote, signature'
      });
    }

    if (![0, 1, 2].includes(parseInt(vote))) {
      return res.status(400).json({
        error: 'Voto inválido',
        message: 'El voto debe ser 0 (fake), 1 (real), o 2 (incierto)'
      });
    }

    // Verificar que el oráculo esté registrado
    const oracle = await oracleService.getOracleInfo(walletAddress);
    if (!oracle || !oracle.isActive) {
      return res.status(403).json({
        error: 'Oráculo no autorizado o inactivo'
      });
    }

    // Verificar firma
    const isValidSignature = await oracleService.verifyValidationSignature(
      walletAddress,
      signature,
      contentHash,
      vote
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma de validación inválida'
      });
    }

    // Ejecutar análisis de IA según especialización
    const aiAnalysis = await oracleService.performAIAnalysis(
      contentHash,
      oracle.specialization
    );

    // Enviar validación al smart contract
    const txHash = await blockchainService.oracleValidate(
      contentHash,
      parseInt(vote),
      evidenceHash || aiAnalysis.evidenceHash,
      walletAddress
    );

    // Guardar análisis detallado
    await oracleService.saveValidationAnalysis(contentHash, walletAddress, {
      vote: parseInt(vote),
      confidence: confidence || aiAnalysis.confidence,
      evidenceHash: evidenceHash || aiAnalysis.evidenceHash,
      specialization: oracle.specialization,
      timestamp: new Date(),
      transactionHash: txHash,
      aiMetrics: aiAnalysis.metrics
    });

    res.json({
      success: true,
      message: 'Validación enviada exitosamente',
      data: {
        contentHash,
        vote: parseInt(vote),
        confidence: confidence || aiAnalysis.confidence,
        transactionHash: txHash,
        oracle: walletAddress,
        specialization: oracle.specialization
      }
    });

  } catch (error) {
    console.error('Error en validación de oráculo:', error);
    res.status(500).json({
      error: 'Error al procesar validación',
      message: error.message
    });
  }
});

/**
 * @route GET /api/oracle/:walletAddress
 * @desc Obtiene información de un oráculo específico
 */
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Obtener info del smart contract
    const blockchainInfo = await blockchainService.getOracleInfo(walletAddress);

    // Obtener info adicional del servicio
    const serviceInfo = await oracleService.getOracleInfo(walletAddress);

    // Obtener estadísticas de validación
    const stats = await oracleService.getOracleStats(walletAddress);

    res.json({
      success: true,
      data: {
        walletAddress,
        specialization: blockchainInfo.specialization || serviceInfo.specialization,
        stake: blockchainInfo.stake,
        reputation: blockchainInfo.reputation,
        isActive: blockchainInfo.isActive,
        stats: {
          totalValidations: stats.totalValidations,
          successRate: stats.successRate,
          averageConfidence: stats.averageConfidence,
          rewardsEarned: stats.rewardsEarned
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener info del oráculo:', error);
    res.status(500).json({
      error: 'Error al obtener información',
      message: error.message
    });
  }
});

/**
 * @route GET /api/oracle/list/active
 * @desc Lista todos los oráculos activos
 */
router.get('/list/active', async (req, res) => {
  try {
    const activeOracles = await oracleService.getActiveOracles();

    res.json({
      success: true,
      data: activeOracles,
      meta: {
        count: activeOracles.length,
        specializations: _getSpecializationCounts(activeOracles)
      }
    });

  } catch (error) {
    console.error('Error al listar oráculos:', error);
    res.status(500).json({
      error: 'Error al obtener lista de oráculos',
      message: error.message
    });
  }
});

/**
 * @route POST /api/oracle/:walletAddress/withdraw
 * @desc Permite a un oráculo retirar su stake
 */
router.post('/:walletAddress/withdraw', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({
        error: 'Firma requerida para retirar stake'
      });
    }

    // Verificar firma
    const isValidSignature = await oracleService.verifyWithdrawSignature(
      walletAddress,
      signature
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Ejecutar retiro en blockchain
    const txHash = await blockchainService.withdrawOracleStake(walletAddress);

    // Marcar oráculo como inactivo
    await oracleService.deactivateOracle(walletAddress);

    res.json({
      success: true,
      message: 'Stake retirado exitosamente',
      data: {
        walletAddress,
        transactionHash: txHash
      }
    });

  } catch (error) {
    console.error('Error al retirar stake:', error);
    res.status(500).json({
      error: 'Error al retirar stake',
      message: error.message
    });
  }
});

/**
 * @route GET /api/oracle/analytics/performance
 * @desc Obtiene análisis de rendimiento general de oráculos
 */
router.get('/analytics/performance', async (req, res) => {
  try {
    const performance = await oracleService.getPerformanceAnalytics();

    res.json({
      success: true,
      data: performance
    });

  } catch (error) {
    console.error('Error al obtener analytics:', error);
    res.status(500).json({
      error: 'Error al generar analytics',
      message: error.message
    });
  }
});

/**
 * Función helper para contar especializaciones
 */
function _getSpecializationCounts(oracles) {
  const counts = {};
  oracles.forEach(oracle => {
    counts[oracle.specialization] = (counts[oracle.specialization] || 0) + 1;
  });
  return counts;
}

module.exports = router;
