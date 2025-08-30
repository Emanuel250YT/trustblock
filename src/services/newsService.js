const crypto = require('crypto');

class NewsService {
  constructor() {
    this.newsDatabase = new Map(); // Mock storage
    this.reports = new Map();
    this.sourceReliability = new Map();
    this.exportLimits = new Map(); // Rate limiting para exports
  }

  /**
   * Obtiene feed de noticias validadas
   */
  async getNewsFeed(page = 1, limit = 20, filters = {}) {
    try {
      // Mock data generation
      const mockNews = this.generateMockNews(page * limit + 50);

      // Aplicar filtros
      let filteredNews = mockNews;

      if (filters.status) {
        filteredNews = filteredNews.filter(news =>
          this.getNewsStatus(news.finalScore, news.isFinalized) === filters.status
        );
      }

      if (filters.category) {
        filteredNews = filteredNews.filter(news =>
          news.category === filters.category
        );
      }

      if (filters.minScore) {
        filteredNews = filteredNews.filter(news =>
          news.finalScore >= filters.minScore
        );
      }

      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedNews = filteredNews.slice(startIndex, endIndex);

      return {
        news: paginatedNews,
        total: filteredNews.length
      };
    } catch (error) {
      console.error('Error obteniendo feed:', error);
      throw error;
    }
  }

  /**
   * Obtiene noticias en tendencia
   */
  async getTrendingNews(timeframe = '24h', limit = 10) {
    try {
      const timeframeMappings = {
        '1h': 1,
        '6h': 6,
        '24h': 24,
        '7d': 168
      };

      const hours = timeframeMappings[timeframe] || 24;
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

      // Mock trending news
      const trending = this.generateMockNews(limit * 2)
        .filter(news => new Date(news.timestamp) > cutoffTime)
        .sort((a, b) => b.validationActivity - a.validationActivity)
        .slice(0, limit);

      return trending;
    } catch (error) {
      console.error('Error obteniendo trending:', error);
      throw error;
    }
  }

  /**
   * Busca noticias
   */
  async searchNews(searchParams) {
    try {
      let results = this.generateMockNews(100);

      // Filtrar por query de texto
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        results = results.filter(news =>
          news.title.toLowerCase().includes(query) ||
          news.summary.toLowerCase().includes(query)
        );
      }

      // Filtrar por fuente
      if (searchParams.source) {
        results = results.filter(news =>
          news.source.includes(searchParams.source)
        );
      }

      // Filtrar por fecha
      if (searchParams.dateFrom) {
        results = results.filter(news =>
          new Date(news.timestamp) >= searchParams.dateFrom
        );
      }

      if (searchParams.dateTo) {
        results = results.filter(news =>
          new Date(news.timestamp) <= searchParams.dateTo
        );
      }

      // Filtrar solo verificadas
      if (searchParams.verified) {
        results = results.filter(news =>
          this.getNewsStatus(news.finalScore, news.isFinalized) === 'verified'
        );
      }

      // Paginación
      const startIndex = (searchParams.page - 1) * searchParams.limit;
      const endIndex = startIndex + searchParams.limit;

      return {
        news: results.slice(startIndex, endIndex),
        total: results.length
      };
    } catch (error) {
      console.error('Error en búsqueda:', error);
      throw error;
    }
  }

  /**
   * Genera badge de verificación
   */
  async generateVerificationBadge(validation, format = 'json') {
    try {
      const status = this.getNewsStatus(validation.finalScore, validation.isFinalized);
      const confidence = validation.finalScore;

      const badgeData = {
        status,
        score: confidence,
        timestamp: new Date().toISOString(),
        verified_by: 'TrueBlock',
        total_validators: validation.oracleVotes?.length + validation.validatorVotes?.length || 0
      };

      if (format === 'svg') {
        return this.generateSVGBadge(badgeData);
      } else if (format === 'html') {
        return this.generateHTMLBadge(badgeData);
      } else {
        return badgeData;
      }
    } catch (error) {
      console.error('Error generando badge:', error);
      throw error;
    }
  }

  /**
   * Genera badge SVG
   */
  generateSVGBadge(badgeData) {
    const colors = {
      verified: '#28a745',
      fake: '#dc3545',
      uncertain: '#ffc107',
      pending: '#6c757d'
    };

    const color = colors[badgeData.status] || colors.pending;

    return `
        <svg width="120" height="20" xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="b" x2="0" y2="100%">
                <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
                <stop offset="1" stop-opacity=".1"/>
            </linearGradient>
            <clipPath id="a">
                <rect width="120" height="20" rx="3" fill="#fff"/>
            </clipPath>
            <g clip-path="url(#a)">
                <path fill="#555" d="M0 0h65v20H0z"/>
                <path fill="${color}" d="M65 0h55v20H65z"/>
                <path fill="url(#b)" d="M0 0h120v20H0z"/>
            </g>
            <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">
                <text x="335" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="550">TrueBlock</text>
                <text x="335" y="140" transform="scale(.1)" textLength="550">TrueBlock</text>
                <text x="915" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="450">${badgeData.status}</text>
                <text x="915" y="140" transform="scale(.1)" textLength="450">${badgeData.status}</text>
            </g>
        </svg>`;
  }

  /**
   * Genera badge HTML
   */
  generateHTMLBadge(badgeData) {
    const colors = {
      verified: '#28a745',
      fake: '#dc3545',
      uncertain: '#ffc107',
      pending: '#6c757d'
    };

    const color = colors[badgeData.status] || colors.pending;

    return `
        <div style="
            display: inline-block;
            padding: 4px 8px;
            background-color: ${color};
            color: white;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
        ">
            ✓ TrueBlock: ${badgeData.status.toUpperCase()} (${badgeData.score}%)
        </div>`;
  }

  /**
   * Procesa reporte de noticia
   */
  async processNewsReport(reportData) {
    try {
      const reportId = crypto.randomUUID();
      const contentHash = this.generateContentHash(reportData.url || reportData.content);

      // Verificar si ya existe validación
      const existingValidation = this.newsDatabase.get(contentHash);

      const report = {
        id: reportId,
        contentHash,
        ...reportData,
        existingValidation: !!existingValidation,
        status: existingValidation ? 'already_validated' : 'pending_validation',
        createdAt: new Date()
      };

      this.reports.set(reportId, report);

      console.log(`📢 Reporte procesado: ${reportId} para contenido: ${contentHash}`);

      return report;
    } catch (error) {
      console.error('Error procesando reporte:', error);
      throw error;
    }
  }

  /**
   * Obtiene analytics de desinformación
   */
  async getMisinformationAnalytics(params) {
    try {
      const { timeframe, category, source } = params;

      // Mock analytics data
      return {
        summary: {
          totalAnalyzed: Math.floor(Math.random() * 1000) + 500,
          fakeNewsDetected: Math.floor(Math.random() * 200) + 50,
          deepfakesFound: Math.floor(Math.random() * 50) + 10,
          manipulatedImages: Math.floor(Math.random() * 100) + 20,
          misinformationRate: Math.round((Math.random() * 20 + 5) * 100) / 100
        },
        trends: {
          daily: this.generateTrendData(7),
          weekly: this.generateTrendData(4),
          monthly: this.generateTrendData(12)
        },
        topSources: this.generateTopSources(),
        categories: {
          politics: Math.floor(Math.random() * 100),
          health: Math.floor(Math.random() * 80),
          technology: Math.floor(Math.random() * 60),
          sports: Math.floor(Math.random() * 40),
          entertainment: Math.floor(Math.random() * 50)
        },
        geography: {
          countries: {
            'Argentina': Math.floor(Math.random() * 100),
            'México': Math.floor(Math.random() * 120),
            'Colombia': Math.floor(Math.random() * 80),
            'Chile': Math.floor(Math.random() * 60),
            'España': Math.floor(Math.random() * 90)
          }
        },
        timeframe,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error obteniendo analytics:', error);
      throw error;
    }
  }

  /**
   * Obtiene confiabilidad de fuentes
   */
  async getSourceReliability(limit = 50) {
    try {
      const sources = [
        'elpais.com', 'lanacion.com.ar', 'clarin.com', 'elmundo.es',
        'bbc.com', 'cnn.com', 'reuters.com', 'ap.org',
        'infobae.com', 'cronista.com', 'ambito.com', 'perfil.com'
      ];

      const reliability = sources.map(source => ({
        domain: source,
        reliabilityScore: Math.round((Math.random() * 40 + 60) * 100) / 100, // 60-100%
        totalArticles: Math.floor(Math.random() * 1000) + 100,
        fakeNewsRate: Math.round((Math.random() * 20) * 100) / 100, // 0-20%
        lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        category: this.getSourceCategory(source)
      }));

      return reliability
        .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error obteniendo confiabilidad:', error);
      throw error;
    }
  }

  /**
   * Verifica límites de exportación
   */
  async checkExportLimits(ip) {
    try {
      const limits = this.exportLimits.get(ip) || { count: 0, resetTime: Date.now() };
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;

      // Reset cada hora
      if (now > limits.resetTime + oneHour) {
        limits.count = 0;
        limits.resetTime = now;
      }

      // Límite: 5 exportaciones por hora
      if (limits.count >= 5) {
        return {
          allowed: false,
          retryAfter: Math.ceil((limits.resetTime + oneHour - now) / 1000)
        };
      }

      limits.count++;
      this.exportLimits.set(ip, limits);

      return { allowed: true };
    } catch (error) {
      console.error('Error verificando límites:', error);
      return { allowed: false };
    }
  }

  /**
   * Exporta dataset público
   */
  async exportPublicDataset(params) {
    try {
      const { format, dateFrom, dateTo, includeContent } = params;

      // Generar datos mock para export
      let data = this.generateMockNews(500);

      // Filtrar por fechas
      if (dateFrom) {
        data = data.filter(item => new Date(item.timestamp) >= dateFrom);
      }
      if (dateTo) {
        data = data.filter(item => new Date(item.timestamp) <= dateTo);
      }

      // Anonimizar datos sensibles
      const sanitizedData = data.map(item => ({
        contentHash: item.contentHash,
        timestamp: item.timestamp,
        finalScore: item.finalScore,
        isFinalized: item.isFinalized,
        category: item.category,
        source: item.source.split('.')[0] + '.***', // Anonimizar dominio
        oracleVotes: item.oracleVotes,
        validatorVotes: item.validatorVotes,
        ...(includeContent && {
          title: item.title.substring(0, 100) + '...',
          summary: item.summary
        })
      }));

      if (format === 'csv') {
        return this.convertToCSV(sanitizedData);
      } else {
        return JSON.stringify(sanitizedData, null, 2);
      }
    } catch (error) {
      console.error('Error exportando dataset:', error);
      throw error;
    }
  }

  /**
   * Convierte datos a CSV
   */
  convertToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  }

  /**
   * Obtiene estado de noticia
   */
  getNewsStatus(finalScore, isFinalized) {
    if (!isFinalized) return 'pending';
    if (finalScore >= 70) return 'verified';
    if (finalScore <= 30) return 'fake';
    return 'uncertain';
  }

  /**
   * Genera hash de contenido
   */
  generateContentHash(content) {
    return crypto.createHash('sha256').update(content || '').digest('hex');
  }

  /**
   * Genera datos mock de noticias
   */
  generateMockNews(count) {
    const categories = ['politics', 'health', 'technology', 'sports', 'entertainment'];
    const sources = ['elpais.com', 'lanacion.com.ar', 'bbc.com', 'infobae.com'];
    const titles = [
      'Nueva ley aprobada en el congreso',
      'Descubrimiento científico revolucionario',
      'Avances en inteligencia artificial',
      'Resultados deportivos destacados',
      'Estreno de película esperada'
    ];

    return Array.from({ length: count }, (_, i) => ({
      contentHash: `hash_${Date.now()}_${i}`,
      title: titles[i % titles.length] + ` ${i + 1}`,
      summary: `Resumen de la noticia ${i + 1}. Contenido relevante sobre el tema.`,
      source: sources[i % sources.length],
      category: categories[i % categories.length],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      finalScore: Math.floor(Math.random() * 100),
      isFinalized: Math.random() > 0.2,
      oracleVotes: Math.floor(Math.random() * 5) + 1,
      validatorVotes: Math.floor(Math.random() * 10) + 1,
      validationActivity: Math.floor(Math.random() * 100)
    }));
  }

  /**
   * Genera datos de tendencia
   */
  generateTrendData(periods) {
    return Array.from({ length: periods }, (_, i) => ({
      period: i + 1,
      totalNews: Math.floor(Math.random() * 100) + 50,
      fakeNews: Math.floor(Math.random() * 20) + 5,
      verified: Math.floor(Math.random() * 70) + 30
    }));
  }

  /**
   * Genera fuentes principales
   */
  generateTopSources() {
    return [
      { source: 'elpais.com', fakeNewsCount: 5, totalNews: 120 },
      { source: 'infobae.com', fakeNewsCount: 8, totalNews: 95 },
      { source: 'lanacion.com.ar', fakeNewsCount: 3, totalNews: 110 },
      { source: 'bbc.com', fakeNewsCount: 2, totalNews: 85 }
    ].map(item => ({
      ...item,
      fakeNewsRate: Math.round((item.fakeNewsCount / item.totalNews) * 10000) / 100
    }));
  }

  /**
   * Obtiene categoría de fuente
   */
  getSourceCategory(source) {
    const categories = {
      'elpais.com': 'mainstream_media',
      'lanacion.com.ar': 'mainstream_media',
      'bbc.com': 'international_media',
      'cnn.com': 'international_media',
      'infobae.com': 'digital_media'
    };

    return categories[source] || 'other';
  }

  /**
   * Obtiene contenido completo de una noticia por hash
   */
  async getNewsContent(contentHash) {
    try {
      // Simular obtención de IPFS
      const mockContent = {
        title: 'Título de la noticia recuperada',
        fullContent: 'Contenido completo de la noticia con todos los detalles...',
        originalUrl: 'https://example.com/news',
        timestamp: new Date().toISOString(),
        source: 'example.com',
        category: 'technology',
        language: 'es'
      };

      return mockContent;
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return null;
    }
  }

  /**
   * Obtiene archivo de Filecoin si existe
   */
  async getFilecoinArchive(contentHash) {
    try {
      // Simular búsqueda en Filecoin
      const random = Math.random();
      if (random > 0.5) {
        return {
          cid: `bafybei${contentHash.substring(2, 10)}archive`,
          dealId: `deal_${Date.now()}`,
          retrievalUrl: `https://gateway.ipfs.io/ipfs/bafybei${contentHash.substring(2, 10)}archive`
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo archivo Filecoin:', error);
      return null;
    }
  }

  /**
   * Procesa contenido para crear estructura estándar
   */
  async processContent({ url, content, title }) {
    try {
      let processedTitle = title;
      let processedContent = content;
      let source = '';

      if (url) {
        // Extraer dominio como fuente
        const urlObj = new URL(url);
        source = urlObj.hostname;
        
        // Si no hay título o contenido, simular extracción
        if (!processedTitle) {
          processedTitle = 'Título extraído de URL';
        }
        if (!processedContent) {
          processedContent = 'Contenido extraído de la URL proporcionada...';
        }
      }

      // Generar resumen
      const summary = processedContent.length > 200 
        ? processedContent.substring(0, 200) + '...'
        : processedContent;

      return {
        title: processedTitle,
        content: processedContent,
        summary,
        url: url || '',
        source,
        timestamp: new Date().toISOString(),
        category: this.detectCategory(processedContent, processedTitle)
      };
    } catch (error) {
      console.error('Error procesando contenido:', error);
      throw error;
    }
  }

  /**
   * Detecta categoría del contenido
   */
  detectCategory(content, title) {
    const text = (content + ' ' + title).toLowerCase();
    
    if (text.includes('bitcoin') || text.includes('crypto') || text.includes('blockchain')) {
      return 'cryptocurrency';
    }
    if (text.includes('ai') || text.includes('artificial') || text.includes('technology')) {
      return 'technology';
    }
    if (text.includes('climate') || text.includes('environment') || text.includes('carbon')) {
      return 'environment';
    }
    if (text.includes('health') || text.includes('medical') || text.includes('disease')) {
      return 'health';
    }
    if (text.includes('election') || text.includes('politics') || text.includes('government')) {
      return 'politics';
    }
    
    return 'general';
  }
}

module.exports = new NewsService();
