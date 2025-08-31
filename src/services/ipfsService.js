const axios = require('axios');
const crypto = require('crypto');

class IPFSService {
  constructor() {
    // Usando Pinata como servicio IPFS (puedes registrarte gratis en pinata.cloud)
    this.pinataApiKey = process.env.PINATA_API_KEY || 'demo-key';
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY || 'demo-secret';
    this.pinataUrl = 'https://api.pinata.cloud';
    this.useRealIPFS = false; // Cambiar a true cuando tengas claves reales
  }

  async uploadContent(content) {
    try {
      if (this.useRealIPFS && this.pinataApiKey !== 'demo-key') {
        return await this.uploadToPinata(content);
      } else {
        return await this.generateMockHash(content);
      }
    } catch (error) {
      console.error('Error subiendo a IPFS:', error);
      // Fallback a hash simulado
      return await this.generateMockHash(content);
    }
  }

  async uploadToPinata(content) {
    try {
      const data = JSON.stringify({
        pinataContent: content,
        pinataMetadata: {
          name: `trueblock-content-${Date.now()}`,
          keyvalues: {
            timestamp: new Date().toISOString(),
            platform: 'trueblock'
          }
        }
      });

      const response = await axios.post(
        `${this.pinataUrl}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      console.log(`📤 Contenido subido a IPFS real: ${response.data.IpfsHash}`);
      return response.data.IpfsHash;

    } catch (error) {
      console.error('Error con Pinata:', error.message);
      throw error;
    }
  }

  async generateMockHash(content) {
    // Generar hash determinístico basado en el contenido
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);
    const hash = crypto.createHash('sha256').update(contentString).digest('hex');
    const ipfsHash = `Qm${hash.substring(0, 44)}`;
    
    console.log(`📤 Hash IPFS simulado generado: ${ipfsHash}`);
    return ipfsHash;
  }

  async retrieveContent(hash) {
    try {
      if (this.useRealIPFS) {
        // Intentar recuperar de IPFS público
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${hash}`, {
          timeout: 5000
        });
        return response.data;
      } else {
        // Contenido simulado
        return {
          title: 'Contenido recuperado de IPFS',
          content: 'Este es contenido simulado recuperado del hash IPFS',
          timestamp: new Date().toISOString(),
          hash: hash
        };
      }
    } catch (error) {
      console.error('Error recuperando de IPFS:', error);
      return null;
    }
  }

  async pinContent(hash) {
    try {
      if (this.useRealIPFS && this.pinataApiKey !== 'demo-key') {
        const response = await axios.post(
          `${this.pinataUrl}/pinning/pinByHash`,
          {
            hashToPin: hash,
            pinataMetadata: {
              name: `trueblock-pin-${Date.now()}`
            }
          },
          {
            headers: {
              'pinata_api_key': this.pinataApiKey,
              'pinata_secret_api_key': this.pinataSecretKey
            }
          }
        );

        console.log(`📌 Contenido pinneado: ${hash}`);
        return response.data;
      } else {
        console.log(`📌 Pin simulado: ${hash}`);
        return { pinned: true, hash };
      }
    } catch (error) {
      console.error('Error pinneando contenido:', error);
      return { pinned: false, error: error.message };
    }
  }

  async getStats() {
    try {
      if (this.useRealIPFS && this.pinataApiKey !== 'demo-key') {
        const response = await axios.get(
          `${this.pinataUrl}/data/userPinnedDataTotal`,
          {
            headers: {
              'pinata_api_key': this.pinataApiKey,
              'pinata_secret_api_key': this.pinataSecretKey
            }
          }
        );

        return {
          totalPins: response.data.pin_count,
          totalSize: response.data.pin_size_total,
          service: 'Pinata IPFS'
        };
      } else {
        return {
          totalPins: 0,
          totalSize: 0,
          service: 'IPFS Simulado'
        };
      }
    } catch (error) {
      console.error('Error obteniendo stats IPFS:', error);
      return {
        totalPins: 0,
        totalSize: 0,
        service: 'IPFS No disponible'
      };
    }
  }
}

module.exports = new IPFSService();
