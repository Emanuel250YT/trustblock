const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const path = require('path');
const os = require('os');

class LighthouseService {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.LIGHTHOUSE_API_KEY;
    this.gatewayUrl = config.gatewayUrl || 'https://gateway.lighthouse.storage/ipfs';

    if (!this.apiKey) {
      throw new Error('❌ LIGHTHOUSE_API_KEY is required');
    }

    console.log('🏮 Lighthouse Service inicializado con SDK oficial');
  }

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

      const tempFile = await this._createTempFile(
        JSON.stringify(newsPackage, null, 2),
        `news_${metadata.id || Date.now()}.json`
      );

      const uploadResponse = await lighthouse.upload(tempFile, this.apiKey);
      fs.unlinkSync(tempFile);

      const result = {
        hash: uploadResponse.data.Hash,
        name: uploadResponse.data.Name,
        size: uploadResponse.data.Size,
        gateway_url: `${this.gatewayUrl}/${uploadResponse.data.Hash}`,
        lighthouse_url: `https://files.lighthouse.storage/viewFile/${uploadResponse.data.Hash}`,
        metadata: newsPackage.metadata
      };

      console.log('✅ Noticia subida exitosamente:', result.hash);
      return result;

    } catch (error) {
      console.error('❌ Error subiendo noticia:', error);
      throw new Error(`Error en upload de noticia: ${error.message}`);
    }
  }

  async uploadText(text, filename = null) {
    try {
      const tempFile = await this._createTempFile(
        text,
        filename || `text_${Date.now()}.txt`
      );

      const uploadResponse = await lighthouse.upload(tempFile, this.apiKey);
      fs.unlinkSync(tempFile);

      return {
        hash: uploadResponse.data.Hash,
        name: uploadResponse.data.Name,
        size: uploadResponse.data.Size,
        gateway_url: `${this.gatewayUrl}/${uploadResponse.data.Hash}`,
        lighthouse_url: `https://files.lighthouse.storage/viewFile/${uploadResponse.data.Hash}`
      };

    } catch (error) {
      console.error('❌ Error subiendo texto:', error);
      throw new Error(`Error en upload de texto: ${error.message}`);
    }
  }

  async downloadContent(hash) {
    try {
      console.log(`📥 Descargando contenido: ${hash}`);

      const url = `${this.gatewayUrl}/${hash}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();

      try {
        return JSON.parse(content);
      } catch {
        return content;
      }

    } catch (error) {
      console.error('❌ Error descargando contenido:', error);
      throw new Error(`Error descargando ${hash}: ${error.message}`);
    }
  }

  async _createTempFile(content, filename) {
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, filename);

    fs.writeFileSync(tempFile, content, 'utf8');

    return tempFile;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isConfigured() {
    return !!this.apiKey;
  }

  getGatewayUrl(hash) {
    return `${this.gatewayUrl}/${hash}`;
  }
}

module.exports = LighthouseService;
