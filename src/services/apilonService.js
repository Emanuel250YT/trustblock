const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Apilon Service for Filecoin Storage Integration
 * Provides seamless integration with Filecoin network through Apilon
 */
class ApilonService {
  constructor() {
    this.apiUrl = process.env.APILON_API_URL || 'https://api.apilon.io';
    this.apiKey = process.env.APILON_API_KEY;
    this.storageProvider = process.env.APILON_STORAGE_PROVIDER;
    this.dealDuration = parseInt(process.env.APILON_DEAL_DURATION) || 525600; // 1 year
    this.replicationFactor = parseInt(process.env.APILON_REPLICATION_FACTOR) || 3;
    this.verifiedDeal = process.env.APILON_VERIFIED_DEAL === 'true';

    if (!this.apiKey) {
      console.warn('⚠️ APILON_API_KEY not found in environment variables');
    }
  }

  /**
   * Upload content to Filecoin via Apilon
   * @param {Buffer|string} content - Content to upload
   * @param {string} filename - Name of the file
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Upload result with CID and deal info
   */
  async uploadToFilecoin(content, filename, metadata = {}) {
    try {
      const formData = new FormData();

      // Add file content
      if (Buffer.isBuffer(content)) {
        formData.append('file', content, filename);
      } else if (typeof content === 'string') {
        formData.append('file', Buffer.from(content), filename);
      } else {
        throw new Error('Content must be Buffer or string');
      }

      // Add metadata
      formData.append('metadata', JSON.stringify({
        name: filename,
        description: metadata.description || 'TrueBlock content',
        dealDuration: this.dealDuration,
        replicationFactor: this.replicationFactor,
        verifiedDeal: this.verifiedDeal,
        storageProvider: this.storageProvider,
        ...metadata
      }));

      const response = await axios.post(`${this.apiUrl}/v1/storage/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders()
        },
        timeout: 120000 // 2 minutes timeout
      });

      return {
        success: true,
        cid: response.data.cid,
        dealId: response.data.dealId,
        dataCap: response.data.dataCap,
        storageProvider: response.data.storageProvider,
        estimatedCost: response.data.estimatedCost,
        dealStatus: response.data.dealStatus || 'pending'
      };

    } catch (error) {
      console.error('❌ Error uploading to Apilon:', error.message);
      return {
        success: false,
        error: error.message,
        code: error.response?.status
      };
    }
  }

  /**
   * Upload news content with proper categorization
   * @param {string} newsContent - The news article content
   * @param {Object} newsMetadata - News metadata (title, author, etc.)
   * @returns {Promise<Object>} Upload result
   */
  async uploadNews(newsContent, newsMetadata) {
    const filename = `news_${Date.now()}_${newsMetadata.id || 'unknown'}.json`;

    const structuredContent = {
      type: 'news_article',
      timestamp: new Date().toISOString(),
      content: newsContent,
      metadata: newsMetadata,
      verification: {
        platform: 'TrueBlock',
        version: '1.0.0'
      }
    };

    return await this.uploadToFilecoin(
      JSON.stringify(structuredContent, null, 2),
      filename,
      {
        description: `TrueBlock News: ${newsMetadata.title || 'Untitled'}`,
        category: 'news_content',
        author: newsMetadata.author,
        priority: 'high'
      }
    );
  }

  /**
   * Upload validation evidence
   * @param {Object} validationData - Validation evidence and metadata
   * @returns {Promise<Object>} Upload result
   */
  async uploadValidationEvidence(validationData) {
    const filename = `validation_${Date.now()}_${validationData.newsId}.json`;

    const structuredEvidence = {
      type: 'validation_evidence',
      timestamp: new Date().toISOString(),
      newsId: validationData.newsId,
      evidence: validationData.evidence,
      validator: validationData.validator,
      score: validationData.score,
      metadata: validationData.metadata || {}
    };

    return await this.uploadToFilecoin(
      JSON.stringify(structuredEvidence, null, 2),
      filename,
      {
        description: `Validation Evidence for News ${validationData.newsId}`,
        category: 'validation_evidence',
        validator: validationData.validator,
        priority: 'medium'
      }
    );
  }

  /**
   * Upload journalist profile
   * @param {Object} profileData - Journalist profile data
   * @returns {Promise<Object>} Upload result
   */
  async uploadJournalistProfile(profileData) {
    const filename = `journalist_profile_${Date.now()}_${profileData.address}.json`;

    return await this.uploadToFilecoin(
      JSON.stringify(profileData, null, 2),
      filename,
      {
        description: `Journalist Profile: ${profileData.name || 'Anonymous'}`,
        category: 'journalist_profile',
        region: profileData.region,
        priority: 'low'
      }
    );
  }

  /**
   * Get file status from Filecoin
   * @param {string} cid - Content Identifier
   * @returns {Promise<Object>} File status and deal information
   */
  async getFileStatus(cid) {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/storage/status/${cid}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        cid: cid,
        status: response.data.status,
        dealInfo: response.data.dealInfo,
        retrievalInfo: response.data.retrievalInfo,
        lastUpdate: response.data.lastUpdate
      };

    } catch (error) {
      console.error('❌ Error getting file status:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retrieve content from Filecoin
   * @param {string} cid - Content Identifier
   * @returns {Promise<Object>} Retrieved content
   */
  async retrieveContent(cid) {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/storage/retrieve/${cid}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        timeout: 60000 // 1 minute timeout for retrieval
      });

      return {
        success: true,
        content: response.data.content,
        metadata: response.data.metadata,
        retrievedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error retrieving content:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * List all stored files for the account
   * @param {Object} filters - Optional filters (category, date range, etc.)
   * @returns {Promise<Object>} List of stored files
   */
  async listStoredFiles(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axios.get(`${this.apiUrl}/v1/storage/list?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        files: response.data.files,
        totalCount: response.data.totalCount,
        totalSize: response.data.totalSize
      };

    } catch (error) {
      console.error('❌ Error listing files:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get storage statistics
   * @returns {Promise<Object>} Storage usage statistics
   */
  async getStorageStats() {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/account/storage-stats`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        stats: {
          totalFiles: response.data.totalFiles,
          totalSize: response.data.totalSize,
          activeDeals: response.data.activeDeals,
          monthlyCost: response.data.monthlyCost,
          availableDataCap: response.data.availableDataCap
        }
      };

    } catch (error) {
      console.error('❌ Error getting storage stats:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Initialize Apilon connection and validate credentials
   * @returns {Promise<boolean>} Connection status
   */
  async initialize() {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/account/info`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      console.log('✅ Apilon connection established successfully');
      console.log(`📊 Account: ${response.data.accountName}`);
      console.log(`💾 Available Data Cap: ${response.data.availableDataCap} GB`);

      return true;

    } catch (error) {
      console.error('❌ Failed to initialize Apilon connection:', error.message);
      return false;
    }
  }
}

module.exports = ApilonService;
