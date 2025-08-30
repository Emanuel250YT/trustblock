const express = require('express');
const router = express.Router();
const stakingService = require('../services/stakingService');
const blockchainService = require('../services/blockchainService');

/**
 * @route POST /api/staking/validator/register
 * @desc Registra un nuevo validador comunitario
 */
router.post('/validator/register', async (req, res) => {
  try {
    const { walletAddress, category, stake, signature } = req.body;

    if (!walletAddress || !category || !stake || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos: walletAddress, category, stake, signature'
      });
    }

    const validCategories = ['journalist', 'fact_checker', 'expert', 'community'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Categoría inválida',
        validOptions: validCategories
      });
    }

    // Verificar stake mínimo
    const minStake = await stakingService.getMinimumStake('validator');
    if (parseFloat(stake) < minStake) {
      return res.status(400).json({
        error: `Stake mínimo requerido: ${minStake} ETH`
      });
    }

    // Verificar firma
    const isValidSignature = await stakingService.verifyValidatorSignature(
      walletAddress,
      signature,
      category
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Registrar en blockchain
    const txHash = await blockchainService.registerCommunityValidator(
      walletAddress,
      category,
      stake
    );

    // Guardar información adicional
    await stakingService.saveValidatorInfo(walletAddress, {
      category,
      stake,
      registrationDate: new Date(),
      isActive: true,
      registrationTx: txHash
    });

    res.status(201).json({
      success: true,
      message: 'Validador registrado exitosamente',
      data: {
        walletAddress,
        category,
        stake,
        transactionHash: txHash
      }
    });

  } catch (error) {
    console.error('Error al registrar validador:', error);
    res.status(500).json({
      error: 'Error al registrar validador',
      message: error.message
    });
  }
});

/**
 * @route GET /api/staking/validator/:walletAddress
 * @desc Obtiene información de un validador específico
 */
router.get('/validator/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Obtener info del smart contract
    const blockchainInfo = await blockchainService.getValidatorInfo(walletAddress);

    // Obtener info adicional del servicio
    const serviceInfo = await stakingService.getValidatorInfo(walletAddress);

    // Obtener estadísticas
    const stats = await stakingService.getValidatorStats(walletAddress);

    res.json({
      success: true,
      data: {
        walletAddress,
        category: blockchainInfo.category || serviceInfo.category,
        stake: blockchainInfo.stake,
        reputation: blockchainInfo.reputation,
        isActive: blockchainInfo.isActive,
        registrationDate: serviceInfo.registrationDate,
        stats: {
          totalValidations: stats.totalValidations,
          successRate: stats.successRate,
          rewardsEarned: stats.rewardsEarned,
          currentStreak: stats.currentStreak
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener info del validador:', error);
    res.status(500).json({
      error: 'Error al obtener información',
      message: error.message
    });
  }
});

/**
 * @route POST /api/staking/validator/:walletAddress/add-stake
 * @desc Permite a un validador añadir más stake
 */
router.post('/validator/:walletAddress/add-stake', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { amount, signature } = req.body;

    if (!amount || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos: amount, signature'
      });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: 'La cantidad debe ser mayor a 0'
      });
    }

    // Verificar que el validador existe y está activo
    const validator = await stakingService.getValidatorInfo(walletAddress);
    if (!validator || !validator.isActive) {
      return res.status(404).json({
        error: 'Validador no encontrado o inactivo'
      });
    }

    // Verificar firma
    const isValidSignature = await stakingService.verifyStakeSignature(
      walletAddress,
      signature,
      amount,
      'add'
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Añadir stake en blockchain
    const txHash = await blockchainService.addValidatorStake(walletAddress, amount);

    // Actualizar información local
    await stakingService.updateValidatorStake(walletAddress, amount, 'add');

    res.json({
      success: true,
      message: 'Stake añadido exitosamente',
      data: {
        walletAddress,
        addedAmount: amount,
        transactionHash: txHash
      }
    });

  } catch (error) {
    console.error('Error al añadir stake:', error);
    res.status(500).json({
      error: 'Error al añadir stake',
      message: error.message
    });
  }
});

/**
 * @route POST /api/staking/validator/:walletAddress/withdraw
 * @desc Permite a un validador retirar su stake
 */
router.post('/validator/:walletAddress/withdraw', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({
        error: 'Firma requerida para retirar stake'
      });
    }

    // Verificar que el validador puede retirar
    const canWithdraw = await stakingService.canValidatorWithdraw(walletAddress);
    if (!canWithdraw.allowed) {
      return res.status(400).json({
        error: 'No es posible retirar stake en este momento',
        reason: canWithdraw.reason
      });
    }

    // Verificar firma
    const isValidSignature = await stakingService.verifyWithdrawSignature(
      walletAddress,
      signature
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Ejecutar retiro en blockchain
    const txHash = await blockchainService.withdrawValidatorStake(walletAddress);

    // Marcar validador como inactivo
    await stakingService.deactivateValidator(walletAddress);

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
 * @route GET /api/staking/rewards/:walletAddress
 * @desc Obtiene información de recompensas para un participante
 */
router.get('/rewards/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const rewards = await stakingService.getRewardsInfo(walletAddress);

    res.json({
      success: true,
      data: {
        walletAddress,
        totalEarned: rewards.totalEarned,
        availableToWithdraw: rewards.availableToWithdraw,
        pendingRewards: rewards.pendingRewards,
        rewardHistory: rewards.history,
        lastUpdate: rewards.lastUpdate
      }
    });

  } catch (error) {
    console.error('Error al obtener recompensas:', error);
    res.status(500).json({
      error: 'Error al obtener información de recompensas',
      message: error.message
    });
  }
});

/**
 * @route POST /api/staking/rewards/:walletAddress/claim
 * @desc Permite reclamar recompensas pendientes
 */
router.post('/rewards/:walletAddress/claim', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { signature } = req.body;

    if (!signature) {
      return res.status(400).json({
        error: 'Firma requerida para reclamar recompensas'
      });
    }

    // Verificar que hay recompensas disponibles
    const rewards = await stakingService.getRewardsInfo(walletAddress);
    if (rewards.availableToWithdraw <= 0) {
      return res.status(400).json({
        error: 'No hay recompensas disponibles para reclamar'
      });
    }

    // Verificar firma
    const isValidSignature = await stakingService.verifyClaimSignature(
      walletAddress,
      signature
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida'
      });
    }

    // Procesar reclamo en blockchain
    const txHash = await blockchainService.claimRewards(walletAddress);

    // Actualizar estado local
    await stakingService.processRewardClaim(walletAddress, rewards.availableToWithdraw);

    res.json({
      success: true,
      message: 'Recompensas reclamadas exitosamente',
      data: {
        walletAddress,
        claimedAmount: rewards.availableToWithdraw,
        transactionHash: txHash
      }
    });

  } catch (error) {
    console.error('Error al reclamar recompensas:', error);
    res.status(500).json({
      error: 'Error al reclamar recompensas',
      message: error.message
    });
  }
});

/**
 * @route GET /api/staking/stats/global
 * @desc Obtiene estadísticas globales de staking
 */
router.get('/stats/global', async (req, res) => {
  try {
    const stats = await stakingService.getGlobalStakingStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas globales:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

/**
 * @route GET /api/staking/leaderboard/:category?
 * @desc Obtiene leaderboard de validadores por reputación
 */
router.get('/leaderboard/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 20;

    if (limit > 100) {
      return res.status(400).json({
        error: 'Límite máximo de 100 resultados'
      });
    }

    const leaderboard = await stakingService.getValidatorLeaderboard(category, limit);

    res.json({
      success: true,
      data: leaderboard,
      meta: {
        category: category || 'all',
        count: leaderboard.length,
        limit
      }
    });

  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({
      error: 'Error al obtener leaderboard',
      message: error.message
    });
  }
});

module.exports = router;
