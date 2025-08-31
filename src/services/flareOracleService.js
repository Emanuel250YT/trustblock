const { ethers } = require('ethers');
const TrueBlockFlareOracleABI = require('../contracts/TrueBlockFlareOracle.json');

/**
 * Servicio para interactuar con Flare Network
 * Maneja FTSO, FDC y Secure Random Numbers
 */
class FlareOracleService {
  constructor() {
    this.networks = {
      mainnet: {
        chainId: 14,
        rpcUrl: 'https://flare-api.flare.network/ext/C/rpc',
        explorer: 'https://flarescan.com/',
        contractAddress: process.env.FLARE_MAINNET_CONTRACT || null
      },
      coston: {
        chainId: 16,
        rpcUrl: 'https://costonapi.flare.network/ext/C/rpc',
        explorer: 'https://coston.testnet.flarescan.com/',
        contractAddress: process.env.FLARE_COSTON_CONTRACT || null
      },
      coston2: {
        chainId: 114,
        rpcUrl: 'https://coston2-api.flare.network/ext/C/rpc',
        explorer: 'https://coston2.testnet.flarescan.com/',
        contractAddress: process.env.FLARE_COSTON2_CONTRACT || null
      }
    };

    this.currentNetwork = process.env.FLARE_NETWORK || 'coston2';
    this.provider = new ethers.JsonRpcProvider(this.networks[this.currentNetwork].rpcUrl);
    this.contract = null;

    this.initializeContract();
  }

  /**
   * Inicializar contrato de Flare Oracle
   */
  async initializeContract() {
    try {
      const network = this.networks[this.currentNetwork];
      if (!network.contractAddress) {
        console.warn(`⚠️ No hay dirección de contrato para Flare ${this.currentNetwork}`);
        return;
      }

      this.contract = new ethers.Contract(
        network.contractAddress,
        TrueBlockFlareOracleABI.abi,
        this.provider
      );

      console.log(`✅ Flare Oracle Service inicializado en ${this.currentNetwork}`);
    } catch (error) {
      console.error('❌ Error inicializando Flare Oracle Service:', error);
    }
  }

  /**
   * Obtener precios usando FTSO
   */
  async getPriceFeeds(symbols = ['BTC', 'ETH', 'USDC', 'FLR']) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const prices = {};

      for (const symbol of symbols) {
        try {
          const price = await this.contract.getPriceFromFTSO(symbol);
          prices[symbol] = {
            value: price.toString(),
            symbol: symbol,
            timestamp: Date.now()
          };
        } catch (error) {
          console.warn(`⚠️ No se pudo obtener precio para ${symbol}:`, error.message);
          prices[symbol] = {
            value: '0',
            symbol: symbol,
            timestamp: Date.now(),
            error: error.message
          };
        }
      }

      return {
        success: true,
        data: prices,
        network: this.currentNetwork,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Error obteniendo price feeds:', error);
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }

  /**
   * Obtener contexto económico completo
   */
  async getEconomicContext() {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const context = await this.contract.getEconomicContext();

      return {
        success: true,
        data: {
          btcPrice: context.btcPrice.toString(),
          ethPrice: context.ethPrice.toString(),
          usdcPrice: context.usdcPrice.toString(),
          timestamp: context.timestamp.toString(),
          network: this.currentNetwork
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo contexto económico:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enviar noticia para validación con contexto de precio
   */
  async submitNewsForValidation(newsHash, sourceUrl, priceSymbol = 'BTC', privateKey) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.submitNewsForValidation(
        newsHash,
        sourceUrl,
        priceSymbol
      );

      const receipt = await tx.wait();

      return {
        success: true,
        data: {
          transactionHash: receipt.hash,
          newsHash: newsHash,
          sourceUrl: sourceUrl,
          priceSymbol: priceSymbol,
          network: this.currentNetwork,
          explorer: `${this.networks[this.currentNetwork].explorer}tx/${receipt.hash}`
        }
      };
    } catch (error) {
      console.error('❌ Error enviando noticia para validación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validar noticia usando FDC data
   */
  async validateNewsWithFDC(newsHash, attestationData, merkleProof, privateKey) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.validateNewsWithFDC(
        newsHash,
        attestationData,
        merkleProof
      );

      const receipt = await tx.wait();

      return {
        success: true,
        data: {
          transactionHash: receipt.hash,
          newsHash: newsHash,
          validator: wallet.address,
          network: this.currentNetwork,
          explorer: `${this.networks[this.currentNetwork].explorer}tx/${receipt.hash}`
        }
      };
    } catch (error) {
      console.error('❌ Error validando noticia con FDC:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener número aleatorio seguro
   */
  async getSecureRandomNumber() {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const randomNumber = await this.contract.getSecureRandomNumber();

      return {
        success: true,
        data: {
          randomNumber: randomNumber,
          timestamp: Date.now(),
          network: this.currentNetwork
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo número aleatorio:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Registrar validador con stake
   */
  async registerValidator(stakeAmount, privateKey) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.registerValidator({
        value: ethers.parseEther(stakeAmount.toString())
      });

      const receipt = await tx.wait();

      return {
        success: true,
        data: {
          transactionHash: receipt.hash,
          validator: wallet.address,
          stakedAmount: stakeAmount,
          network: this.currentNetwork,
          explorer: `${this.networks[this.currentNetwork].explorer}tx/${receipt.hash}`
        }
      };
    } catch (error) {
      console.error('❌ Error registrando validador:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar credibilidad de medio con datos Web2
   */
  async updateMediaCredibility(mediaName, webDataHash, merkleProof, privateKey) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);

      const tx = await contractWithSigner.updateMediaCredibility(
        mediaName,
        webDataHash,
        merkleProof
      );

      const receipt = await tx.wait();

      return {
        success: true,
        data: {
          transactionHash: receipt.hash,
          mediaName: mediaName,
          updatedBy: wallet.address,
          network: this.currentNetwork,
          explorer: `${this.networks[this.currentNetwork].explorer}tx/${receipt.hash}`
        }
      };
    } catch (error) {
      console.error('❌ Error actualizando credibilidad de medio:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener validación completa
   */
  async getValidation(newsHash) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const validation = await this.contract.getValidation(newsHash);

      return {
        success: true,
        data: {
          sourceUrl: validation.sourceUrl,
          timestamp: validation.timestamp.toString(),
          credibilityScore: validation.credibilityScore.toString(),
          priceContext: validation.priceContext.toString(),
          isValidated: validation.isValidated,
          validatorCount: validation.validatorCount.toString(),
          newsHash: newsHash,
          network: this.currentNetwork
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo validación:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener credibilidad de medio
   */
  async getMediaCredibility(mediaName) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const credibility = await this.contract.getMediaCredibility(mediaName);

      return {
        success: true,
        data: {
          mediaName: mediaName,
          credibilityScore: credibility.credibilityScore.toString(),
          validationsCount: credibility.validationsCount.toString(),
          lastUpdate: credibility.lastUpdate.toString(),
          isVerified: credibility.isVerified,
          network: this.currentNetwork
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo credibilidad de medio:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener perfil de validador
   */
  async getValidatorProfile(validatorAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contrato no inicializado');
      }

      const profile = await this.contract.getValidatorProfile(validatorAddress);

      return {
        success: true,
        data: {
          validatorAddress: validatorAddress,
          reputation: profile.reputation.toString(),
          validationsCount: profile.validationsCount.toString(),
          stakedAmount: ethers.formatEther(profile.stakedAmount),
          isActive: profile.isActive,
          network: this.currentNetwork
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo perfil de validador:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener información de la red actual
   */
  getNetworkInfo() {
    return {
      network: this.currentNetwork,
      ...this.networks[this.currentNetwork],
      contractAddress: this.networks[this.currentNetwork].contractAddress
    };
  }

  /**
   * Verificar si el servicio está disponible
   */
  async isAvailable() {
    try {
      if (!this.contract) {
        return false;
      }

      // Hacer una llamada simple para verificar conectividad
      await this.provider.getBlockNumber();
      return true;
    } catch (error) {
      console.error('❌ Flare Oracle Service no disponible:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas del oracle
   */
  async getOracleStats() {
    try {
      const [blockNumber, prices, randomNumber] = await Promise.all([
        this.provider.getBlockNumber(),
        this.getPriceFeeds(['BTC', 'ETH']),
        this.getSecureRandomNumber()
      ]);

      return {
        success: true,
        data: {
          network: this.currentNetwork,
          blockNumber: blockNumber,
          pricesAvailable: prices.success,
          randomAvailable: randomNumber.success,
          contractDeployed: !!this.contract,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del oracle:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = FlareOracleService;
