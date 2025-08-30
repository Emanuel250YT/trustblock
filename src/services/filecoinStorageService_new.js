const { ethers } = require('ethers');
const crypto = require('crypto');
const LighthouseService = require('./lighthouseService');

/**
 * Servicio para integración con Filecoin y almacenamiento permanente usando Lighthouse.storage
 * Gestión directa a través de Lighthouse sin fallbacks a Estuary o IPFS
 */
class FilecoinStorageService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.lighthouseService = new LighthouseService();
    this.filecoinConfig = {
      // Filecoin Virtual Machine (FVM) - Mainnet
      rpcUrl: process.env.FILECOIN_RPC_URL || 'https://api.node.glif.io/rpc/v1',
      chainId: 314, // Filecoin Mainnet
      contractAddress: process.env.TRUTHBOARD_FILECOIN_CONTRACT_ADDRESS
    };
    this.init();
  }

  async init() {
    try {
      // Configurar provider para Filecoin FVM
      this.provider = new ethers.JsonRpcProvider(this.filecoinConfig.rpcUrl);

      // Configurar signer
      if (process.env.FILECOIN_PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.FILECOIN_PRIVATE_KEY, this.provider);
      }

      // Verificar configuración de Lighthouse
      const lighthouseConfig = this.lighthouseService.isConfigured();
      if (lighthouseConfig.ready) {
        console.log('✅ Lighthouse.storage configurado correctamente');
      } else {
        console.log('⚠️ Lighthouse.storage requiere configuración adicional');
      }

      console.log('🏮 FilecoinStorageService inicializado con Lighthouse');
      console.log(`🔗 Chain ID: ${this.filecoinConfig.chainId}`);
      console.log(`📁 Lighthouse Storage activo`);
    } catch (error) {
      console.error('❌ Error inicializando Filecoin service:', error);
    }
  }

  /**
   * Archiva contenido de noticia validada en Filecoin usando Lighthouse
   */
  async archiveValidatedNews(newsData) {
    try {
      const { contentHash, title, content, validationScore, validators } = newsData;

      console.log(`📚 Archivando noticia validada con Lighthouse: ${contentHash.substring(0, 10)}...`);

      // Usar directamente el servicio Lighthouse para noticias
      const lighthouseResult = await this.lighthouseService.uploadNews(content, {
        id: contentHash,
        title: title,
        validationScore: validationScore,
        validators: validators?.length || 0,
        archivedAt: new Date().toISOString(),
        version: '1.0'
      });

      if (lighthouseResult.success) {
        console.log(`✅ Noticia archivada exitosamente en Filecoin: ${lighthouseResult.cid}`);
        console.log(`💾 URL: ${lighthouseResult.url}`);
        console.log(`💰 Costo estimado: ${lighthouseResult.estimatedCost.estimatedCostUSD} USD`);

        return {
          success: true,
          contentHash,
          lighthouseCid: lighthouseResult.cid,
          archiveUrl: lighthouseResult.url,
          permanentStorage: true,
          estimatedRetrieval: '< 1 minute',
          storageProvider: 'Lighthouse',
          estimatedCost: lighthouseResult.estimatedCost
        };
      }

      throw new Error(`Lighthouse upload failed: ${lighthouseResult.error}`);

    } catch (error) {
      console.error('❌ Error archivando noticia:', error);
      return {
        success: false,
        error: error.message,
        contentHash
      };
    }
  }

  /**
   * Almacena evidencia de validación de forma permanente usando Lighthouse
   */
  async storeValidationEvidence(evidenceData) {
    try {
      const { newsHash, evidenceFiles, validationScore, validators } = evidenceData;

      console.log(`📋 Almacenando evidencia con Lighthouse para: ${newsHash.substring(0, 10)}...`);

      // Usar el servicio Lighthouse para evidencia
      const lighthouseResult = await this.lighthouseService.uploadValidationEvidence(evidenceFiles, {
        newsHash: newsHash,
        validationScore: validationScore,
        validatorCount: validators?.length || 0,
        timestamp: new Date().toISOString()
      });

      if (lighthouseResult.success) {
        console.log(`✅ Evidencia almacenada exitosamente: ${lighthouseResult.cid}`);

        return {
          success: true,
          evidenceHash: lighthouseResult.cid,
          newsHash,
          archiveUrl: lighthouseResult.url,
          validationScore,
          storageProvider: 'Lighthouse',
          estimatedCost: lighthouseResult.estimatedCost
        };
      }

      throw new Error(`Lighthouse evidence upload failed: ${lighthouseResult.error}`);

    } catch (error) {
      console.error('❌ Error almacenando evidencia:', error);
      return {
        success: false,
        error: error.message,
        newsHash
      };
    }
  }

  /**
   * Sube contenido directamente a Lighthouse.storage
   */
  async uploadToLighthouse(content) {
    try {
      const contentString = JSON.stringify(content);

      const lighthouseResult = await this.lighthouseService.uploadToLighthouse(
        contentString,
        {
          name: `content_${Date.now()}.json`,
          contentType: 'application/json'
        }
      );

      if (lighthouseResult.success) {
        console.log(`🏮 Lighthouse upload successful: ${lighthouseResult.Hash}`);
        return lighthouseResult.Hash;
      }

      throw new Error(`Lighthouse upload failed: ${lighthouseResult.error}`);

    } catch (error) {
      console.error('❌ Error subiendo contenido a Lighthouse:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de almacenamiento
   */
  async getStorageStatistics() {
    try {
      const lighthouseStats = await this.lighthouseService.getStorageStats();

      return {
        success: true,
        lighthouse: lighthouseStats.success ? lighthouseStats.stats : null,
        totalFiles: lighthouseStats.success ? lighthouseStats.stats.fileCount : 0,
        totalSize: lighthouseStats.success ? lighthouseStats.stats.totalSize : 0,
        provider: 'Lighthouse',
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Detecta el idioma del contenido (función helper)
   */
  detectLanguage(content) {
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le'];
    const englishWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on'];

    const words = content.toLowerCase().split(/\s+/).slice(0, 100);
    let spanishScore = 0;
    let englishScore = 0;

    words.forEach(word => {
      if (spanishWords.includes(word)) spanishScore++;
      if (englishWords.includes(word)) englishScore++;
    });

    return spanishScore > englishScore ? 'es' : 'en';
  }
}

module.exports = FilecoinStorageService;
