const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const validationService = require('../services/validationService');

/**
 * @route GET /api/news/feed
 * @desc Obtiene feed de noticias validadas
 */
router.get('/feed', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      minScore
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (limitNum > 50) {
      return res.status(400).json({
        error: 'Límite máximo de 50 noticias por página'
      });
    }

    const filters = {
      status, // 'verified', 'fake', 'uncertain', 'pending'
      category,
      minScore: minScore ? parseInt(minScore) : undefined
    };

    const feed = await newsService.getNewsFeed(pageNum, limitNum, filters);

    res.json({
      success: true,
      data: feed.news,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: feed.total,
        totalPages: Math.ceil(feed.total / limitNum),
        hasNext: pageNum < Math.ceil(feed.total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error al obtener feed:', error);
    res.status(500).json({
      error: 'Error al obtener feed de noticias',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/trending
 * @desc Obtiene noticias en tendencia por validación
 */
router.get('/trending', async (req, res) => {
  try {
    const { timeframe = '24h', limit = 10 } = req.query;

    const validTimeframes = ['1h', '6h', '24h', '7d'];
    if (!validTimeframes.includes(timeframe)) {
      return res.status(400).json({
        error: 'Timeframe inválido',
        validOptions: validTimeframes
      });
    }

    const trending = await newsService.getTrendingNews(timeframe, parseInt(limit));

    res.json({
      success: true,
      data: trending,
      meta: {
        timeframe,
        count: trending.length
      }
    });

  } catch (error) {
    console.error('Error al obtener trending:', error);
    res.status(500).json({
      error: 'Error al obtener noticias trending',
      message: error.message
    });
  }
});

/**
 * @route POST /api/news/search
 * @desc Busca noticias por texto o criterios
 */
router.post('/search', async (req, res) => {
  try {
    const {
      query,
      filters = {},
      page = 1,
      limit = 20
    } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Query requerido',
        message: 'Debes proporcionar un texto de búsqueda'
      });
    }

    const searchParams = {
      query,
      filters: {
        status: filters.status,
        dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
        minScore: filters.minScore ? parseInt(filters.minScore) : undefined
      },
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const startTime = Date.now();
    const results = await newsService.searchNews(searchParams);
    const searchTime = ((Date.now() - startTime) / 1000).toFixed(2);

    res.json({
      success: true,
      data: {
        results: results.news,
        totalResults: results.total,
        searchTime: `${searchTime}s`
      },
      meta: {
        query,
        filters,
        page: parseInt(page),
        limit: parseInt(limit),
        total: results.total,
        totalPages: Math.ceil(results.total / parseInt(limit)),
        hasNext: parseInt(page) < Math.ceil(results.total / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({
      error: 'Error al buscar noticias',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/badge/:contentHash
 * @desc Genera badge de verificación para una noticia
 */
router.get('/badge/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;
    const { format = 'json' } = req.query;

    const validation = await validationService.getValidation(contentHash);

    if (!validation || !validation.isFinalized) {
      return res.status(404).json({
        error: 'Validación no encontrada o no finalizada'
      });
    }

    const badge = await newsService.generateVerificationBadge(validation, format);

    if (format === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(badge);
    } else if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(badge);
    } else {
      res.json({
        success: true,
        data: badge
      });
    }

  } catch (error) {
    console.error('Error al generar badge:', error);
    res.status(500).json({
      error: 'Error al generar badge',
      message: error.message
    });
  }
});

/**
 * @route POST /api/news/report
 * @desc Reporta una noticia sospechosa para validación prioritaria
 */
router.post('/report', async (req, res) => {
  try {
    const {
      url,
      content,
      reason,
      reporterEmail,
      priority = 'normal'
    } = req.body;

    if (!url && !content) {
      return res.status(400).json({
        error: 'URL o contenido requerido'
      });
    }

    if (!reason) {
      return res.status(400).json({
        error: 'Razón del reporte requerida'
      });
    }

    const validReasons = [
      'fake_news',
      'misleading',
      'manipulated_media',
      'spam',
      'deepfake',
      'other'
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        error: 'Razón inválida',
        validOptions: validReasons
      });
    }

    // Procesar reporte
    const report = await newsService.processNewsReport({
      url,
      content,
      reason,
      reporterEmail,
      priority,
      timestamp: new Date(),
      ip: req.ip
    });

    // Si la noticia no está validada, enviarla para validación prioritaria
    if (!report.existingValidation) {
      await validationService.submitForPriorityValidation(report.contentHash, {
        reason,
        priority,
        reportId: report.id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Reporte enviado exitosamente',
      data: {
        reportId: report.id,
        contentHash: report.contentHash,
        status: report.existingValidation ? 'already_validated' : 'queued_for_validation'
      }
    });

  } catch (error) {
    console.error('Error al procesar reporte:', error);
    res.status(500).json({
      error: 'Error al procesar reporte',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/analytics/misinformation
 * @desc Obtiene analytics sobre desinformación detectada
 */
router.get('/analytics/misinformation', async (req, res) => {
  try {
    const {
      timeframe = '7d',
      category,
      source
    } = req.query;

    const analytics = await newsService.getMisinformationAnalytics({
      timeframe,
      category,
      source
    });

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error al obtener analytics:', error);
    res.status(500).json({
      error: 'Error al generar analytics',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/sources/reliability
 * @desc Obtiene ranking de confiabilidad de fuentes
 */
router.get('/sources/reliability', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const reliability = await newsService.getSourceReliability(parseInt(limit));

    res.json({
      success: true,
      data: reliability,
      meta: {
        totalSources: reliability.length,
        lastUpdate: new Date()
      }
    });

  } catch (error) {
    console.error('Error al obtener confiabilidad:', error);
    res.status(500).json({
      error: 'Error al obtener datos de confiabilidad',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/export/dataset
 * @desc Exporta dataset público de validaciones (para investigación)
 */
router.get('/export/dataset', async (req, res) => {
  try {
    const {
      format = 'json',
      dateFrom,
      dateTo,
      includeContent = false
    } = req.query;

    if (!['json', 'csv'].includes(format)) {
      return res.status(400).json({
        error: 'Formato inválido. Soportados: json, csv'
      });
    }

    // Verificar límites de exportación
    const exportLimits = await newsService.checkExportLimits(req.ip);
    if (!exportLimits.allowed) {
      return res.status(429).json({
        error: 'Límite de exportación excedido',
        retryAfter: exportLimits.retryAfter
      });
    }

    const dataset = await newsService.exportPublicDataset({
      format,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      includeContent: includeContent === 'true'
    });

    // Establecer headers apropiados
    const filename = `trueblock_dataset_${Date.now()}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type',
      format === 'csv' ? 'text/csv' : 'application/json'
    );

    res.send(dataset);

  } catch (error) {
    console.error('Error al exportar dataset:', error);
    res.status(500).json({
      error: 'Error al generar dataset',
      message: error.message
    });
  }
});

/**
 * @route GET /api/news/:contentHash
 * @desc Obtiene el detalle completo de una noticia por su hash
 */
router.get('/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;

    if (!contentHash) {
      return res.status(400).json({
        error: 'Hash de contenido requerido'
      });
    }

    // Obtener contenido de IPFS
    const content = await newsService.getNewsContent(contentHash);
    
    if (!content) {
      return res.status(404).json({
        error: 'Noticia no encontrada',
        message: 'El hash proporcionado no corresponde a ninguna noticia'
      });
    }

    // Obtener validación detallada
    const validation = await validationService.getValidation(contentHash);
    
    // Obtener historial de validaciones
    const validationHistory = await validationService.getValidationHistory(contentHash);

    // Buscar archivo en Filecoin si existe
    let filecoinArchive = null;
    try {
      filecoinArchive = await newsService.getFilecoinArchive(contentHash);
    } catch (error) {
      // No está archivado en Filecoin, continuar
    }

    res.json({
      success: true,
      data: {
        contentHash,
        title: content.title,
        content: content.fullContent,
        url: content.originalUrl,
        status: validation?.status || 'pending',
        finalScore: validation?.finalScore || 0,
        detailedAnalysis: {
          fake_news_probability: validation?.breakdown?.fake_news_score || 0,
          bias_score: validation?.breakdown?.bias_score || 0,
          credibility_score: validation?.breakdown?.credibility_score || 0,
          fact_check_results: validation?.factCheckResults || {}
        },
        validationHistory: validationHistory || [],
        ipfsHash: contentHash,
        filecoinArchive: filecoinArchive?.cid || null,
        metadata: {
          timestamp: content.timestamp,
          source: content.source,
          category: content.category,
          language: content.language || 'es'
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener detalle de noticia:', error);
    res.status(500).json({
      error: 'Error al obtener noticia',
      message: error.message
    });
  }
});

module.exports = router;
