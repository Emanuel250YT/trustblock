const { ethers } = require('ethers');
const contractABI = require('../contracts/TrueBlockValidator.json');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.init();
  }

  async init() {
    try {
      // Configurar provider
      this.provider = new ethers.JsonRpcProvider(
        process.env.BASE_RPC_URL || 'http://127.0.0.1:8545'
      );

      // Configurar signer si hay private key
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      // Configurar contrato si hay dirección
      if (process.env.CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          contractABI.abi,
          this.signer || this.provider
        );
      }

      console.log('✅ Blockchain service inicializado');
    } catch (error) {
      console.error('❌ Error inicializando blockchain service:', error);
    }
  }

  /**
   * Envía una noticia al smart contract para validación
   */
  async submitNews(contentHash) {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contrato o signer no configurado');
      }

      const tx = await this.contract.submitNews(contentHash);
      await tx.wait();

      console.log(`📝 Noticia enviada: ${contentHash}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error al enviar noticia:', error);
      throw error;
    }
  }

  /**
   * Registra un oráculo en el smart contract
   */
  async registerOracle(walletAddress, specialization, stakeAmount) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      // Crear signer temporal para el oráculo
      const oracleSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(oracleSigner);

      const tx = await contractWithSigner.registerOracle(specialization, {
        value: ethers.parseEther(stakeAmount.toString())
      });
      await tx.wait();

      console.log(`🤖 Oráculo registrado: ${walletAddress}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error al registrar oráculo:', error);
      throw error;
    }
  }

  /**
   * Registra un validador comunitario
   */
  async registerCommunityValidator(walletAddress, category, stakeAmount) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const validatorSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(validatorSigner);

      const tx = await contractWithSigner.registerCommunityValidator(category, {
        value: ethers.parseEther(stakeAmount.toString())
      });
      await tx.wait();

      console.log(`👥 Validador registrado: ${walletAddress}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error al registrar validador:', error);
      throw error;
    }
  }

  /**
   * Envía validación de oráculo
   */
  async oracleValidate(contentHash, vote, evidenceHash, oracleAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const oracleSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(oracleSigner);

      const tx = await contractWithSigner.oracleValidate(
        contentHash,
        vote,
        evidenceHash || ""
      );
      await tx.wait();

      console.log(`🔍 Validación de oráculo: ${contentHash}, Voto: ${vote}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error en validación de oráculo:', error);
      throw error;
    }
  }

  /**
   * Envía validación comunitaria
   */
  async communityValidate(contentHash, vote, validatorAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const validatorSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(validatorSigner);

      const tx = await contractWithSigner.communityValidate(contentHash, vote);
      await tx.wait();

      console.log(`👤 Validación comunitaria: ${contentHash}, Voto: ${vote}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error en validación comunitaria:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de validación del smart contract
   */
  async getValidation(contentHash) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const result = await this.contract.getValidation(contentHash);

      return {
        oracleAddresses: result[0],
        oracleVotes: result[1].map(v => Number(v)),
        validatorAddresses: result[2],
        validatorVotes: result[3].map(v => Number(v)),
        finalScore: Number(result[4]),
        isFinalized: result[5],
        evidenceHash: result[6]
      };
    } catch (error) {
      console.error('Error al obtener validación:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de un oráculo
   */
  async getOracleInfo(walletAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const oracle = await this.contract.oracles(walletAddress);

      return {
        oracleAddress: oracle[0],
        stake: ethers.formatEther(oracle[1]),
        reputation: Number(oracle[2]),
        isActive: oracle[3],
        specialization: oracle[4]
      };
    } catch (error) {
      console.error('Error al obtener info del oráculo:', error);
      throw error;
    }
  }

  /**
   * Obtiene información de un validador
   */
  async getValidatorInfo(walletAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const validator = await this.contract.communityValidators(walletAddress);

      return {
        validatorAddress: validator[0],
        stake: ethers.formatEther(validator[1]),
        reputation: Number(validator[2]),
        isActive: validator[3],
        category: validator[4]
      };
    } catch (error) {
      console.error('Error al obtener info del validador:', error);
      throw error;
    }
  }

  /**
   * Retira stake de oráculo
   */
  async withdrawOracleStake(walletAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const oracleSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(oracleSigner);

      const tx = await contractWithSigner.withdrawStake();
      await tx.wait();

      console.log(`💰 Stake de oráculo retirado: ${walletAddress}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error al retirar stake de oráculo:', error);
      throw error;
    }
  }

  /**
   * Retira stake de validador
   */
  async withdrawValidatorStake(walletAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const validatorSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(validatorSigner);

      const tx = await contractWithSigner.withdrawStake();
      await tx.wait();

      console.log(`💰 Stake de validador retirado: ${walletAddress}, TX: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error al retirar stake de validador:', error);
      throw error;
    }
  }

  /**
   * Añade stake adicional para un validador
   */
  async addValidatorStake(walletAddress, amount) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      // Por simplicidad, usamos el mismo signer
      // En producción, cada validador tendría su propia clave
      const validatorSigner = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      const contractWithSigner = this.contract.connect(validatorSigner);

      // El contrato actual no tiene función específica para añadir stake
      // Se simula el comportamiento
      console.log(`💎 Stake añadido para validador: ${walletAddress}, Cantidad: ${amount}`);
      return `0x${'0'.repeat(64)}`; // Mock transaction hash
    } catch (error) {
      console.error('Error al añadir stake:', error);
      throw error;
    }
  }

  /**
   * Reclama recompensas (mock implementation)
   */
  async claimRewards(walletAddress) {
    try {
      // Implementación mock - en el contrato real se implementaría
      console.log(`🎁 Recompensas reclamadas para: ${walletAddress}`);
      return `0x${'1'.repeat(64)}`; // Mock transaction hash
    } catch (error) {
      console.error('Error al reclamar recompensas:', error);
      throw error;
    }
  }

  /**
   * Obtiene balance del contrato
   */
  async getContractBalance() {
    try {
      if (!this.contract || !this.provider) {
        throw new Error('Contrato o provider no configurado');
      }

      const balance = await this.provider.getBalance(this.contract.target);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error al obtener balance del contrato:', error);
      throw error;
    }
  }

  /**
   * Obtiene eventos del contrato
   */
  async getContractEvents(eventName, fromBlock = 'latest') {
    try {
      if (!this.contract) {
        throw new Error('Contrato no configurado');
      }

      const filter = this.contract.filters[eventName]();
      const events = await this.contract.queryFilter(filter, fromBlock);

      return events.map(event => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        args: event.args,
        timestamp: event.blockNumber // Simplificado
      }));
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  /**
   * Verifica si el servicio está conectado
   */
  isConnected() {
    return !!(this.provider && this.contract);
  }

  /**
   * Obtiene la red actual
   */
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        throw new Error('Provider no configurado');
      }

      const network = await this.provider.getNetwork();
      return {
        name: network.name,
        chainId: Number(network.chainId),
        ensAddress: network.ensAddress
      };
    } catch (error) {
      console.error('Error al obtener info de red:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();
