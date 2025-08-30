const fs = require('fs').promises;
const path = require('path');

class DatabaseService {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data/database.json');
    this.data = null;
  }

  async initialize() {
    try {
      const dbContent = await fs.readFile(this.dbPath, 'utf8');
      this.data = JSON.parse(dbContent);
      console.log('✅ Base de datos inicializada');
    } catch (error) {
      console.log('📝 Creando nueva base de datos...');
      this.data = {
        news: [],
        oracles: [],
        validators: [],
        validations: [],
        truthboard_articles: [],
        votes: [],
        staking_records: []
      };
      await this.save();
    }
  }

  async save() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error guardando base de datos:', error);
      throw error;
    }
  }

  async addNews(newsData) {
    if (!this.data) await this.initialize();
    
    const news = {
      id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      contentHash: newsData.contentHash,
      title: newsData.title,
      content: newsData.content,
      url: newsData.url,
      source: newsData.source,
      category: newsData.category,
      timestamp: new Date().toISOString(),
      status: newsData.status || 'pending',
      score: newsData.score || 0,
      isFake: newsData.isFake || false
    };

    this.data.news.push(news);
    await this.save();
    return news;
  }

  async addOracle(oracleData) {
    if (!this.data) await this.initialize();
    
    const oracle = {
      id: `oracle_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      address: oracleData.address,
      name: oracleData.name,
      specialization: oracleData.specialization,
      accuracy: oracleData.accuracy,
      stake: oracleData.stake,
      reputation: oracleData.reputation || 500,
      totalValidations: 0,
      successfulValidations: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.data.oracles.push(oracle);
    await this.save();
    return oracle;
  }

  async addValidator(validatorData) {
    if (!this.data) await this.initialize();
    
    const validator = {
      id: `validator_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      address: validatorData.address,
      name: validatorData.name,
      category: validatorData.category,
      reputation: validatorData.reputation,
      stake: validatorData.stake,
      totalVotes: 0,
      successfulVotes: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.data.validators.push(validator);
    await this.save();
    return validator;
  }

  async addValidation(validationData) {
    if (!this.data) await this.initialize();
    
    const validation = {
      id: `validation_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      contentHash: validationData.contentHash,
      totalVotes: validationData.totalVotes,
      trueVotes: validationData.trueVotes,
      fakeVotes: validationData.fakeVotes,
      score: validationData.score,
      status: validationData.status,
      createdAt: new Date().toISOString(),
      finalizedAt: validationData.finalized ? new Date().toISOString() : null
    };

    this.data.validations.push(validation);
    await this.save();
    return validation;
  }

  async addTruthBoardArticle(articleData) {
    if (!this.data) await this.initialize();
    
    const article = {
      id: `zk_article_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      title: articleData.title,
      content: articleData.content,
      region: articleData.region,
      category: articleData.category,
      ipfsHash: articleData.ipfsHash,
      citreaTxHash: articleData.citreaTxHash,
      donationAddress: articleData.donationAddress,
      anonymityScore: Math.floor(Math.random() * 10) + 90, // 90-99
      createdAt: new Date().toISOString(),
      totalDonations: 0,
      validationCount: 0
    };

    this.data.truthboard_articles.push(article);
    await this.save();
    return article;
  }

  async addVote(voteData) {
    if (!this.data) await this.initialize();
    
    const vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      contentHash: voteData.contentHash,
      voterAddress: voteData.voterAddress,
      vote: voteData.vote, // true = real, false = fake
      confidence: voteData.confidence,
      evidence: voteData.evidence,
      txHash: voteData.txHash,
      createdAt: new Date().toISOString()
    };

    this.data.votes.push(vote);
    await this.save();
    return vote;
  }

  async getNews(filters = {}) {
    if (!this.data) await this.initialize();
    
    let news = [...this.data.news];
    
    if (filters.status) {
      news = news.filter(n => n.status === filters.status);
    }
    if (filters.category) {
      news = news.filter(n => n.category === filters.category);
    }
    if (filters.minScore) {
      news = news.filter(n => n.score >= filters.minScore);
    }
    
    return news.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getNewsByHash(contentHash) {
    if (!this.data) await this.initialize();
    return this.data.news.find(n => n.contentHash === contentHash);
  }

  async getOracles() {
    if (!this.data) await this.initialize();
    return this.data.oracles.sort((a, b) => b.accuracy - a.accuracy);
  }

  async getValidators() {
    if (!this.data) await this.initialize();
    return this.data.validators.sort((a, b) => b.reputation - a.reputation);
  }

  async getValidation(contentHash) {
    if (!this.data) await this.initialize();
    return this.data.validations.find(v => v.contentHash === contentHash);
  }

  async getTruthBoardArticles(region = null) {
    if (!this.data) await this.initialize();
    
    let articles = this.data.truthboard_articles;
    if (region) {
      articles = articles.filter(a => a.region === region);
    }
    
    return articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getStats() {
    if (!this.data) await this.initialize();
    
    return {
      totalNews: this.data.news.length,
      verifiedNews: this.data.news.filter(n => n.status === 'verified').length,
      fakeNews: this.data.news.filter(n => n.status === 'fake').length,
      totalOracles: this.data.oracles.length,
      totalValidators: this.data.validators.length,
      totalValidations: this.data.validations.length,
      totalVotes: this.data.votes.length,
      truthboardArticles: this.data.truthboard_articles.length
    };
  }
}

module.exports = new DatabaseService();
