const axios = require('axios');
const crypto = require('crypto');
// const { create } = require('ipfs-http-client'); // Temporalmente deshabilitado

class ValidationService {
  constructor() {
    this.ipfsClient = null;
    this.aiServices = {
      openai: process.env.OPENAI_API_KEY,
      huggingface: process.env.HUGGINGFACE_API_KEY
    };
    // this.initIPFS(); // Temporalmente deshabilitado
  }

  async initIPFS() {
    try {
      // this.ipfsClient = create({
      //     url: process.env.IPFS_NODE_URL || 'http://localhost:5001'
      // });
      console.log('✅ IPFS client inicializado (mock)');
    } catch (error) {
      console.error('❌ Error inicializando IPFS:', error);
    }
  }  /**
   * Procesa contenido de noticia (URL o texto)
   */
  async processContent({ url, content, title }) {
    try {
      let processedContent = {
        timestamp: new Date().toISOString(),
        source: url || 'direct_input'
      };

      if (url) {
        // Extraer contenido de URL
        const extracted = await this.extractContentFromURL(url);
        processedContent = {
          ...processedContent,
          title: title || extracted.title,
          content: extracted.content,
          summary: extracted.summary,
          metadata: extracted.metadata,
          url: url
        };
      } else {
        // Procesar contenido directo
        processedContent = {
          ...processedContent,
          title: title || 'Contenido directo',
          content: content,
          summary: await this.generateSummary(content),
          metadata: this.extractMetadata(content)
        };
      }

      // Generar hash único del contenido
      processedContent.contentId = this.generateContentHash(processedContent.content);

      return processedContent;
    } catch (error) {
      console.error('Error procesando contenido:', error);
      throw error;
    }
  }

  /**
   * Extrae contenido de una URL
   */
  async extractContentFromURL(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'TrueBlock-Bot/1.0'
        }
      });

      // Análisis básico de HTML (en producción usar librerías como cheerio)
      const html = response.data;
      const title = this.extractTitle(html);
      const content = this.extractMainContent(html);
      const metadata = this.extractWebMetadata(html, url);

      return {
        title,
        content,
        summary: await this.generateSummary(content),
        metadata
      };
    } catch (error) {
      console.error('Error extrayendo contenido de URL:', error);
      throw new Error(`No se pudo extraer contenido de: ${url}`);
    }
  }

  /**
   * Extrae título de HTML
   */
  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'Sin título';
  }

  /**
   * Extrae contenido principal de HTML
   */
  extractMainContent(html) {
    // Implementación básica - en producción usar librerías especializadas
    let content = html.replace(/<script[^>]*>.*?<\/script>/gis, '');
    content = content.replace(/<style[^>]*>.*?<\/style>/gis, '');
    content = content.replace(/<[^>]+>/g, ' ');
    content = content.replace(/\s+/g, ' ').trim();

    return content.substring(0, 5000); // Límite de 5000 caracteres
  }

  /**
   * Extrae metadata web
   */
  extractWebMetadata(html, url) {
    const metadata = {
      url,
      domain: new URL(url).hostname,
      extractedAt: new Date().toISOString()
    };

    // Open Graph tags
    const ogTags = html.match(/<meta\s+property="og:([^"]+)"\s+content="([^"]+)"/gi);
    if (ogTags) {
      ogTags.forEach(tag => {
        const match = tag.match(/property="og:([^"]+)"\s+content="([^"]+)"/i);
        if (match) {
          metadata[`og_${match[1]}`] = match[2];
        }
      });
    }

    return metadata;
  }

  /**
   * Genera resumen usando IA
   */
  async generateSummary(content) {
    try {
      if (!this.aiServices.openai) {
        return content.substring(0, 200) + '...';
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente que genera resúmenes concisos de noticias en español.'
            },
            {
              role: 'user',
              content: `Resume este contenido en máximo 150 palabras: ${content.substring(0, 2000)}`
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.aiServices.openai}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generando resumen:', error);
      return content.substring(0, 200) + '...';
    }
  }

  /**
   * Extrae metadata básica del contenido
   */
  extractMetadata(content) {
    return {
      length: content.length,
      wordCount: content.split(/\s+/).length,
      hasUrls: /https?:\/\//.test(content),
      language: this.detectLanguage(content),
      extractedAt: new Date().toISOString()
    };
  }

  /**
   * Detecta idioma básico
   */
  detectLanguage(content) {
    const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no'];
    const englishWords = ['the', 'of', 'and', 'to', 'in', 'is', 'it', 'you', 'that', 'he'];

    const words = content.toLowerCase().split(/\s+/).slice(0, 100);

    let spanishScore = 0;
    let englishScore = 0;

    words.forEach(word => {
      if (spanishWords.includes(word)) spanishScore++;
      if (englishWords.includes(word)) englishScore++;
    });

    return spanishScore > englishScore ? 'es' : 'en';
  }

  /**
   * Genera hash único del contenido
   */
  generateContentHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Sube contenido a IPFS
   */
  async uploadToIPFS(content) {
    try {
      // Mock implementation - en producción usar IPFS real
      const contentString = JSON.stringify(content);
      const hash = crypto.createHash('sha256').update(contentString).digest('hex');

      console.log(`📁 Contenido subido a IPFS (mock): ${hash}`);
      return hash;
    } catch (error) {
      console.error('Error subiendo a IPFS:', error);
      // Fallback: usar hash local
      return this.generateContentHash(JSON.stringify(content));
    }
  }

  /**
   * Obtiene contenido de IPFS
   */
  async getFromIPFS(hash) {
    try {
      // Mock implementation - en producción obtener de IPFS real
      console.log(`📁 Obteniendo contenido de IPFS (mock): ${hash}`);

      // Retornar contenido mock basado en hash
      return {
        title: `Contenido ${hash.substring(0, 8)}`,
        content: 'Contenido de ejemplo almacenado en IPFS',
        timestamp: new Date().toISOString(),
        source: 'mock'
      };
    } catch (error) {
      console.error('Error obteniendo de IPFS:', error);
      throw error;
    }
  }  /**
   * Verifica firma de validador
   */
  async verifyValidatorSignature(walletAddress, signature, contentHash) {
    try {
      // Implementación simplificada - en producción usar ethers.js para verificar firmas
      const message = `TrueBlock validation: ${contentHash}`;
      const messageHash = crypto.createHash('sha256').update(message).digest('hex');

      // Mock verification - en producción verificar firma criptográfica real
      return signature.length > 50 && walletAddress.startsWith('0x');
    } catch (error) {
      console.error('Error verificando firma:', error);
      return false;
    }
  }

  /**
   * Obtiene validaciones recientes
   */
  async getRecentValidations(limit = 10) {
    try {
      // Mock data - en producción obtener de base de datos
      const mockValidations = Array.from({ length: limit }, (_, i) => ({
        contentHash: `hash_${Date.now()}_${i}`,
        title: `Noticia ejemplo ${i + 1}`,
        finalScore: Math.floor(Math.random() * 100),
        isFinalized: Math.random() > 0.3,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        oracleVotes: Math.floor(Math.random() * 5) + 1,
        communityVotes: Math.floor(Math.random() * 10) + 1
      }));

      return mockValidations;
    } catch (error) {
      console.error('Error obteniendo validaciones recientes:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de validación
   */
  async getValidationStats() {
    try {
      // Mock stats - en producción calcular de datos reales
      return {
        totalValidations: 1250,
        verifiedNews: 856,
        fakeNews: 234,
        uncertainNews: 160,
        activeOracles: 15,
        activeValidators: 87,
        averageValidationTime: '4.2 hours',
        successRate: 94.2,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  /**
   * Envía contenido para validación prioritaria
   */
  async submitForPriorityValidation(contentHash, options = {}) {
    try {
      console.log(`⚡ Enviando para validación prioritaria: ${contentHash}`);

      // En producción, esto activaría el sistema de prioridades
      return {
        contentHash,
        priority: options.priority || 'high',
        reason: options.reason,
        queuePosition: Math.floor(Math.random() * 5) + 1,
        estimatedTime: '15-30 minutes'
      };
    } catch (error) {
      console.error('Error en validación prioritaria:', error);
      throw error;
    }
  }

  /**
   * Obtiene validación específica
   */
  async getValidation(contentHash) {
    try {
      // En producción, obtener del blockchain service
      const blockchainService = require('./blockchainService');
      return await blockchainService.getValidation(contentHash);
    } catch (error) {
      console.error('Error obteniendo validación:', error);
      throw error;
    }
  }
}

module.exports = new ValidationService();
