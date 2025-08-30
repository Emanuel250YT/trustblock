const crypto = require('crypto');

class StakingService {
  constructor() {
    this.validators = new Map(); // Mock storage
    this.rewards = new Map();
    this.stakingHistory = new Map();
    this.minimumStakes = {
      oracle: 1.0,     // 1 ETH
      validator: 0.1   // 0.1 ETH
    };
  }

  /**
   * Obtiene stake mínimo requerido
   */
  async getMinimumStake(type) {
    return this.minimumStakes[type] || 0.1;
  }

  /**
   * Verifica firma de validador
   */
  async verifyValidatorSignature(walletAddress, signature, category) {
    try {
      const message = `TrueBlock Validator Registration: ${category}`;

      // Mock verification - en producción usar ethers.js
      return signature.length > 50 && walletAddress.startsWith('0x');
    } catch (error) {
      console.error('Error verificando firma de validador:', error);
      return false;
    }
  }

  /**
   * Verifica firma de stake
   */
  async verifyStakeSignature(walletAddress, signature, amount, operation) {
    try {
      const message = `TrueBlock Stake ${operation}: ${amount}`;

      // Mock verification
      return signature.length > 50 && walletAddress.startsWith('0x');
    } catch (error) {
      console.error('Error verificando firma de stake:', error);
      return false;
    }
  }

  /**
   * Verifica firma de retiro
   */
  async verifyWithdrawSignature(walletAddress, signature) {
    try {
      const message = `TrueBlock Withdraw: ${walletAddress}`;

      // Mock verification
      return signature.length > 50 && walletAddress.startsWith('0x');
    } catch (error) {
      console.error('Error verificando firma de retiro:', error);
      return false;
    }
  }

  /**
   * Verifica firma de reclamo de recompensas
   */
  async verifyClaimSignature(walletAddress, signature) {
    try {
      const message = `TrueBlock Claim Rewards: ${walletAddress}`;

      // Mock verification
      return signature.length > 50 && walletAddress.startsWith('0x');
    } catch (error) {
      console.error('Error verificando firma de reclamo:', error);
      return false;
    }
  }

  /**
   * Guarda información de validador
   */
  async saveValidatorInfo(walletAddress, info) {
    try {
      this.validators.set(walletAddress, {
        ...info,
        createdAt: new Date(),
        lastActive: new Date(),
        validationCount: 0,
        successfulValidations: 0
      });

      // Inicializar recompensas
      this.rewards.set(walletAddress, {
        totalEarned: 0,
        availableToWithdraw: 0,
        pendingRewards: 0,
        history: [],
        lastUpdate: new Date()
      });

      console.log(`💾 Información de validador guardada: ${walletAddress}`);
    } catch (error) {
      console.error('Error guardando información de validador:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de validador
   */
  async getValidatorInfo(walletAddress) {
    try {
      return this.validators.get(walletAddress) || null;
    } catch (error) {
      console.error('Error obteniendo info de validador:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de validador
   */
  async getValidatorStats(walletAddress) {
    try {
      const validator = this.validators.get(walletAddress);
      if (!validator) {
        return {
          totalValidations: 0,
          successRate: 0,
          rewardsEarned: 0,
          currentStreak: 0
        };
      }

      const successRate = validator.validationCount > 0
        ? (validator.successfulValidations / validator.validationCount) * 100
        : 0;

      return {
        totalValidations: validator.validationCount || 0,
        successRate: Math.round(successRate),
        rewardsEarned: this.rewards.get(walletAddress)?.totalEarned || 0,
        currentStreak: Math.floor(Math.random() * 10) // Mock streak
      };
    } catch (error) {
      console.error('Error obteniendo stats de validador:', error);
      throw error;
    }
  }

  /**
   * Actualiza stake de validador
   */
  async updateValidatorStake(walletAddress, amount, operation) {
    try {
      const validator = this.validators.get(walletAddress);
      if (!validator) {
        throw new Error('Validador no encontrado');
      }

      const currentStake = parseFloat(validator.stake);
      const changeAmount = parseFloat(amount);

      if (operation === 'add') {
        validator.stake = (currentStake + changeAmount).toString();
      } else if (operation === 'subtract') {
        validator.stake = Math.max(0, currentStake - changeAmount).toString();
      }

      validator.lastStakeUpdate = new Date();

      // Registrar en historial
      this.addStakingHistory(walletAddress, {
        operation,
        amount: changeAmount,
        newBalance: validator.stake,
        timestamp: new Date()
      });

      console.log(`💰 Stake actualizado para ${walletAddress}: ${operation} ${amount}`);
    } catch (error) {
      console.error('Error actualizando stake:', error);
      throw error;
    }
  }

  /**
   * Verifica si un validador puede retirar stake
   */
  async canValidatorWithdraw(walletAddress) {
    try {
      const validator = this.validators.get(walletAddress);
      if (!validator) {
        return { allowed: false, reason: 'Validador no encontrado' };
      }

      if (!validator.isActive) {
        return { allowed: false, reason: 'Validador no está activo' };
      }

      // Verificar si hay validaciones pendientes (mock)
      const hasPendingValidations = Math.random() > 0.8;
      if (hasPendingValidations) {
        return {
          allowed: false,
          reason: 'Tienes validaciones pendientes que deben completarse'
        };
      }

      // Verificar período de bloqueo (mock - ej: 7 días desde última validación)
      const lockPeriod = 7 * 24 * 60 * 60 * 1000; // 7 días en ms
      const timeSinceLastValidation = Date.now() - validator.lastActive.getTime();

      if (timeSinceLastValidation < lockPeriod) {
        const remainingTime = Math.ceil((lockPeriod - timeSinceLastValidation) / (24 * 60 * 60 * 1000));
        return {
          allowed: false,
          reason: `Período de bloqueo activo. Puedes retirar en ${remainingTime} días`
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error verificando retiro:', error);
      return { allowed: false, reason: 'Error verificando elegibilidad' };
    }
  }

  /**
   * Desactiva validador
   */
  async deactivateValidator(walletAddress) {
    try {
      const validator = this.validators.get(walletAddress);
      if (validator) {
        validator.isActive = false;
        validator.deactivatedAt = new Date();
      }

      console.log(`🔴 Validador desactivado: ${walletAddress}`);
    } catch (error) {
      console.error('Error desactivando validador:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de recompensas
   */
  async getRewardsInfo(walletAddress) {
    try {
      let rewardInfo = this.rewards.get(walletAddress);

      if (!rewardInfo) {
        rewardInfo = {
          totalEarned: 0,
          availableToWithdraw: 0,
          pendingRewards: 0,
          history: [],
          lastUpdate: new Date()
        };
        this.rewards.set(walletAddress, rewardInfo);
      }

      return rewardInfo;
    } catch (error) {
      console.error('Error obteniendo info de recompensas:', error);
      throw error;
    }
  }

  /**
   * Procesa reclamo de recompensas
   */
  async processRewardClaim(walletAddress, amount) {
    try {
      const rewardInfo = this.rewards.get(walletAddress);
      if (!rewardInfo) {
        throw new Error('Información de recompensas no encontrada');
      }

      rewardInfo.availableToWithdraw = Math.max(0, rewardInfo.availableToWithdraw - amount);
      rewardInfo.history.push({
        type: 'claim',
        amount,
        timestamp: new Date(),
        txHash: `0x${crypto.randomBytes(32).toString('hex')}`
      });
      rewardInfo.lastUpdate = new Date();

      console.log(`🎁 Recompensas reclamadas: ${walletAddress} - ${amount} ETH`);
    } catch (error) {
      console.error('Error procesando reclamo:', error);
      throw error;
    }
  }

  /**
   * Añade recompensa a un validador
   */
  async addReward(walletAddress, amount, type = 'validation') {
    try {
      let rewardInfo = this.rewards.get(walletAddress);

      if (!rewardInfo) {
        rewardInfo = {
          totalEarned: 0,
          availableToWithdraw: 0,
          pendingRewards: 0,
          history: [],
          lastUpdate: new Date()
        };
      }

      rewardInfo.totalEarned += amount;
      rewardInfo.availableToWithdraw += amount;
      rewardInfo.history.push({
        type,
        amount,
        timestamp: new Date()
      });
      rewardInfo.lastUpdate = new Date();

      this.rewards.set(walletAddress, rewardInfo);

      console.log(`💰 Recompensa añadida: ${walletAddress} - ${amount} ETH (${type})`);
    } catch (error) {
      console.error('Error añadiendo recompensa:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas globales de staking
   */
  async getGlobalStakingStats() {
    try {
      const allValidators = Array.from(this.validators.values());
      const activeValidators = allValidators.filter(v => v.isActive);

      const totalStaked = activeValidators.reduce((sum, v) => {
        return sum + parseFloat(v.stake || 0);
      }, 0);

      const totalRewards = Array.from(this.rewards.values()).reduce((sum, r) => {
        return sum + r.totalEarned;
      }, 0);

      return {
        totalValidators: activeValidators.length,
        totalStaked: totalStaked.toFixed(4),
        totalRewardsDistributed: totalRewards.toFixed(4),
        averageStake: activeValidators.length > 0
          ? (totalStaked / activeValidators.length).toFixed(4)
          : 0,
        categories: this.getCategoryBreakdown(activeValidators),
        stakingAPY: this.calculateStakingAPY(),
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Error obteniendo stats globales:', error);
      throw error;
    }
  }

  /**
   * Obtiene breakdown por categorías
   */
  getCategoryBreakdown(validators) {
    const breakdown = {};
    validators.forEach(validator => {
      breakdown[validator.category] = (breakdown[validator.category] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Calcula APY de staking (mock)
   */
  calculateStakingAPY() {
    return Math.random() * 20 + 5; // Entre 5% y 25%
  }

  /**
   * Obtiene leaderboard de validadores
   */
  async getValidatorLeaderboard(category = null, limit = 20) {
    try {
      const allValidators = [];

      for (const [address, validator] of this.validators) {
        if (!validator.isActive) continue;
        if (category && validator.category !== category) continue;

        const stats = await this.getValidatorStats(address);
        allValidators.push({
          address,
          category: validator.category,
          stake: parseFloat(validator.stake),
          reputation: stats.successRate,
          totalValidations: stats.totalValidations,
          rewardsEarned: stats.rewardsEarned,
          currentStreak: stats.currentStreak
        });
      }

      // Ordenar por reputación y luego por stake
      allValidators.sort((a, b) => {
        if (b.reputation !== a.reputation) {
          return b.reputation - a.reputation;
        }
        return b.stake - a.stake;
      });

      return allValidators.slice(0, limit);
    } catch (error) {
      console.error('Error obteniendo leaderboard:', error);
      throw error;
    }
  }

  /**
   * Añade entrada al historial de staking
   */
  addStakingHistory(walletAddress, entry) {
    let history = this.stakingHistory.get(walletAddress);
    if (!history) {
      history = [];
    }

    history.push(entry);

    // Mantener solo los últimos 100 registros
    if (history.length > 100) {
      history = history.slice(-100);
    }

    this.stakingHistory.set(walletAddress, history);
  }

  /**
   * Obtiene historial de staking
   */
  async getStakingHistory(walletAddress, limit = 20) {
    try {
      const history = this.stakingHistory.get(walletAddress) || [];
      return history.slice(-limit).reverse(); // Más recientes primero
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw error;
    }
  }

  /**
   * Calcula recompensa por voto
   */
  async calculateVoteReward(walletAddress, confidence) {
    try {
      const validator = this.validators.get(walletAddress);
      if (!validator) {
        return { amount: 0, token: 'ETH' };
      }

      // Recompensa base según categoría
      const baseRewards = {
        journalist: 0.005,
        fact_checker: 0.008,
        expert: 0.01,
        community: 0.002
      };

      const baseReward = baseRewards[validator.category] || 0.001;
      
      // Bonus por confianza alta
      const confidenceMultiplier = confidence >= 90 ? 1.5 : 
                                  confidence >= 75 ? 1.2 : 1.0;

      // Bonus por reputación
      const reputationMultiplier = validator.reputation >= 800 ? 1.3 :
                                  validator.reputation >= 600 ? 1.1 : 1.0;

      const finalReward = baseReward * confidenceMultiplier * reputationMultiplier;

      return {
        amount: parseFloat(finalReward.toFixed(6)),
        token: 'ETH'
      };
    } catch (error) {
      console.error('Error calculando recompensa:', error);
      return { amount: 0, token: 'ETH' };
    }
  }

  /**
   * Actualiza reputación de validador
   */
  async updateReputation(walletAddress, action, result = null) {
    try {
      const validator = this.validators.get(walletAddress);
      if (!validator) {
        return 500; // Reputación base para nuevos validadores
      }

      let reputationChange = 0;

      switch (action) {
        case 'vote_submitted':
          reputationChange = 1; // Pequeño bonus por participar
          break;
        case 'correct_validation':
          reputationChange = 10; // Bonus por validación correcta
          break;
        case 'incorrect_validation':
          reputationChange = -5; // Penalización por validación incorrecta
          break;
        case 'slashing':
          reputationChange = -50; // Penalización fuerte por comportamiento malicioso
          break;
        default:
          reputationChange = 0;
      }

      const newReputation = Math.max(0, Math.min(1000, validator.reputation + reputationChange));
      validator.reputation = newReputation;
      
      this.validators.set(walletAddress, validator);

      // Registrar cambio en historial
      this.addStakingHistory(walletAddress, {
        timestamp: new Date().toISOString(),
        type: 'reputation_update',
        action,
        reputationChange,
        newReputation
      });

      return newReputation;
    } catch (error) {
      console.error('Error actualizando reputación:', error);
      return 500;
    }
  }
}

module.exports = new StakingService();
