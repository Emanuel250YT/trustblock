const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Servicio de integración con Lighthouse.storage para almacenamiento en Filecoin
 * Lighthouse proporciona una API simple para almacenar archivos en IPFS y Filecoin
 */
class LighthouseService {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.LIGHTHOUSE_API_KEY;
    this.baseUrl = config.baseUrl || 'https://node.lighthouse.storage';
    this.gatewayUrl = config.gatewayUrl || 'https://gateway.lighthouse.storage/ipfs';

    if (!this.apiKey) {
      console.warn('⚠️ LIGHTHOUSE_API_KEY not found in environment variables');
    }

    this.config = {
      maxFileSize: config.maxFileSize || 100 * 1024 * 1024, // 100MB por defecto
      defaultDuration: config.defaultDuration || 2592000, // 30 días por defecto
      ...config
    };

    console.log('🏮 Lighthouse Service inicializado');
  }

  /**
   * Sube contenido de noticia a Lighthouse/Filecoin
   */
  async uploadNews(content, metadata = {}) {
    try {
      console.log('📰 Subiendo noticia a Lighthouse...');

      const newsPackage = {
        content: content,
        metadata: {
          type: 'news',
          title: metadata.title || 'Sin título',
          timestamp: new Date().toISOString(),
          validationScore: metadata.validationScore || 0,
          validators: metadata.validators || 0,
          ...metadata
        },
        version: '1.0'
      };

      const result = await this.uploadToLighthouse(newsPackage, {
        name: `news_${metadata.id || Date.now()}.json`
      });

      if (result.success) {
        console.log(`✅ Noticia subida exitosamente: ${result.Hash}`);

        return {
          success: true,
          cid: result.Hash,
          size: result.Size,
          url: `${this.gatewayUrl}/${result.Hash}`,
          name: result.Name,
          estimatedCost: this.estimateStorageCost(result.Size),
          timestamp: new Date().toISOString()
        };
      }

      throw new Error(result.error || 'Error desconocido subiendo noticia');

    } catch (error) {
      console.error('❌ Error subiendo noticia a Lighthouse:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sube evidencia de validación a Lighthouse
   */
  async uploadValidationEvidence(evidenceFiles, metadata = {}) {
    try {
      console.log('📋 Subiendo evidencia de validación a Lighthouse...');

      const evidencePackage = {
        evidence: evidenceFiles,
        metadata: {
          type: 'validation_evidence',
          newsHash: metadata.newsHash,
          validationScore: metadata.validationScore,
          validatorCount: metadata.validatorCount,
          timestamp: metadata.timestamp || new Date().toISOString(),
          ...metadata
        },
        forensics: {
          blockchain: 'Citrea',
          immutable: true,
          verifiable: true
        }
      };

      const result = await this.uploadToLighthouse(evidencePackage, {
        name: `evidence_${metadata.newsHash?.substring(0, 10) || Date.now()}.json`
      });

      if (result.success) {
        console.log(`✅ Evidencia subida exitosamente: ${result.Hash}`);

        return {
          success: true,
          cid: result.Hash,
          size: result.Size,
          url: `${this.gatewayUrl}/${result.Hash}`,
          name: result.Name,
          estimatedCost: this.estimateStorageCost(result.Size),
          timestamp: new Date().toISOString()
        };
      }

      throw new Error(result.error || 'Error desconocido subiendo evidencia');

    } catch (error) {
      console.error('❌ Error subiendo evidencia a Lighthouse:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sube archivo directamente a Lighthouse
   */
  async uploadFile(filePath, options = {}) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no encontrado: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      if (stats.size > this.config.maxFileSize) {
        throw new Error(`Archivo demasiado grande: ${stats.size} bytes (máximo: ${this.config.maxFileSize})`);
      }

      console.log(`📄 Subiendo archivo: ${path.basename(filePath)} (${stats.size} bytes)`);

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await axios.post(
        `${this.baseUrl}/api/v0/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          },
          timeout: 60000 // 60 segundos timeout
        }
      );

      if (response.data && response.data.Hash) {
        console.log(`✅ Archivo subido: ${response.data.Hash}`);

        return {
          success: true,
          ...response.data,
          url: `${this.gatewayUrl}/${response.data.Hash}`,
          estimatedCost: this.estimateStorageCost(response.data.Size)
        };
      }

      throw new Error('Respuesta inválida de Lighthouse');

    } catch (error) {
      console.error('❌ Error subiendo archivo a Lighthouse:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Función genérica para subir contenido a Lighthouse
   */
  async uploadToLighthouse(content, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('API Key de Lighthouse no configurada');
      }

      // Convertir contenido a buffer si es necesario
      let contentBuffer;
      if (typeof content === 'string') {
        contentBuffer = Buffer.from(content, 'utf8');
      } else if (Buffer.isBuffer(content)) {
        contentBuffer = content;
      } else {
        contentBuffer = Buffer.from(JSON.stringify(content), 'utf8');
      }

      if (contentBuffer.length > this.config.maxFileSize) {
        throw new Error(`Contenido demasiado grande: ${contentBuffer.length} bytes`);
      }

      const formData = new FormData();
      formData.append('file', contentBuffer, {
        filename: options.name || `upload_${Date.now()}.json`,
        contentType: options.contentType || 'application/json'
      });

      console.log(`🚀 Subiendo a Lighthouse: ${contentBuffer.length} bytes`);

      const response = await axios.post(
        `${this.baseUrl}/api/v0/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            ...formData.getHeaders()
          },
          timeout: 60000,
          maxContentLength: this.config.maxFileSize,
          maxBodyLength: this.config.maxFileSize
        }
      );

      if (response.data && response.data.Hash) {
        return {
          success: true,
          ...response.data
        };
      }

      throw new Error('Respuesta inválida de Lighthouse API');

    } catch (error) {
      console.error('❌ Error en uploadToLighthouse:', error);

      if (error.response) {
        console.error('📡 Response status:', error.response.status);
        console.error('📡 Response data:', error.response.data);
      }

      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Obtiene información de un archivo por su CID
   */
  async getFileInfo(cid) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v0/object/stat?arg=${cid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000
        }
      );

      return {
        success: true,
        cid: cid,
        ...response.data,
        url: `${this.gatewayUrl}/${cid}`
      };

    } catch (error) {
      console.error(`❌ Error obteniendo info de ${cid}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Descarga contenido desde Lighthouse/IPFS
   */
  async downloadContent(cid) {
    try {
      console.log(`📥 Descargando contenido: ${cid}`);

      const response = await axios.get(
        `${this.gatewayUrl}/${cid}`,
        {
          timeout: 30000,
          responseType: 'text'
        }
      );

      return {
        success: true,
        content: response.data,
        cid: cid
      };

    } catch (error) {
      console.error(`❌ Error descargando ${cid}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene estadísticas de uso
   */
  async getStorageStats() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v0/user/stats`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        stats: response.data
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
   * Estima el costo de almacenamiento
   */
  estimateStorageCost(sizeInBytes) {
    // Lighthouse usa un modelo de precios simplificado
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const baseCostPerMB = 0.0001; // Costo base estimado en USD por MB

    return {
      size: sizeInBytes,
      sizeFormatted: this.formatBytes(sizeInBytes),
      estimatedCostUSD: (sizeInMB * baseCostPerMB).toFixed(6),
      note: 'Costo estimado - verificar precios actuales en Lighthouse'
    };
  }

  /**
   * Formatea bytes a formato legible
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Verifica la configuración del servicio
   */
  isConfigured() {
    return {
      hasApiKey: !!this.apiKey,
      baseUrl: this.baseUrl,
      gatewayUrl: this.gatewayUrl,
      maxFileSize: this.formatBytes(this.config.maxFileSize),
      ready: !!this.apiKey
    };
  }
}

module.exports = LighthouseService;
