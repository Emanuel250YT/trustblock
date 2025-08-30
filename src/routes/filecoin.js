const express = require('express');
const router = express.Router();
const filecoinStorageService = require('../services/filecoinStorageService');

/**
 * @route POST /api/filecoin/archive/news
 * @desc Archiva una noticia validada en Filecoin permanentemente
 */
router.post('/archive/news', async (req, res) => {
  try {
    const { contentHash, title, content, validationScore, validators } = req.body;

    if (!contentHash || !title || !content || validationScore === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: contentHash, title, content, validationScore'
      });
    }

    if (validationScore < 75) {
      return res.status(400).json({
        success: false,
        error: 'Solo se archivan noticias con score ≥ 75'
      });
    }

    const result = await filecoinStorageService.archiveValidatedNews({
      contentHash,
      title,
      content,
      validationScore,
      validators: validators || []
    });

    res.json({
      success: true,
      message: 'Noticia archivada permanentemente en Filecoin',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error archivando noticia',
      details: error.message
    });
  }
});

/**
 * @route POST /api/filecoin/evidence/store
 * @desc Almacena evidencia de validación en Filecoin
 */
router.post('/evidence/store', async (req, res) => {
  try {
    const { newsHash, evidenceFiles, validationScore, validators } = req.body;

    if (!newsHash || !validationScore || !validators) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: newsHash, validationScore, validators'
      });
    }

    const result = await filecoinStorageService.storeValidationEvidence({
      newsHash,
      evidenceFiles: evidenceFiles || [],
      validationScore,
      validators
    });

    res.json({
      success: true,
      message: 'Evidencia almacenada permanentemente',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error almacenando evidencia',
      details: error.message
    });
  }
});

/**
 * @route POST /api/filecoin/snapshot/create
 * @desc Crea un snapshot público de datos importantes
 */
router.post('/snapshot/create', async (req, res) => {
  try {
    const { blockNumber, merkleRoot, statistics } = req.body;

    if (!blockNumber || !merkleRoot) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: blockNumber, merkleRoot'
      });
    }

    const result = await filecoinStorageService.createPublicSnapshot({
      blockNumber,
      merkleRoot,
      statistics: statistics || {}
    });

    res.json({
      success: true,
      message: 'Snapshot público creado y archivado',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error creando snapshot',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/retrieve/:contentHash
 * @desc Recupera contenido archivado desde Filecoin
 */
router.get('/retrieve/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;

    if (!contentHash) {
      return res.status(400).json({
        success: false,
        error: 'Content hash requerido'
      });
    }

    const result = await filecoinStorageService.retrieveArchivedContent(contentHash);

    res.json({
      success: true,
      message: 'Contenido recuperado exitosamente',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error recuperando contenido',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/status/:contentHash
 * @desc Verifica si un contenido está archivado en Filecoin
 */
router.get('/status/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;

    const result = await filecoinStorageService.isContentArchived(contentHash);

    res.json({
      success: true,
      data: {
        contentHash,
        isArchived: result.archived,
        cid: result.cid,
        retrievalUrl: result.cid ? `https://ipfs.io/ipfs/${result.cid}` : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error verificando estado',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/statistics
 * @desc Obtiene estadísticas de almacenamiento en Filecoin
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await filecoinStorageService.getStorageStatistics();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/network/status
 * @desc Obtiene el estado de la red Filecoin
 */
router.get('/network/status', async (req, res) => {
  try {
    const status = await filecoinStorageService.getFilecoinNetworkStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estado de red',
      details: error.message
    });
  }
});

/**
 * @route POST /api/filecoin/upload/ipfs
 * @desc Sube contenido directamente a IPFS
 */
router.post('/upload/ipfs', async (req, res) => {
  try {
    const { content, metadata } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Contenido requerido'
      });
    }

    const uploadData = {
      content,
      metadata: metadata || {},
      uploadedAt: new Date().toISOString()
    };

    const cid = await filecoinStorageService.uploadToIPFS(uploadData);

    res.json({
      success: true,
      message: 'Contenido subido a IPFS',
      data: {
        cid,
        ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
        gatewayUrls: [
          `https://gateway.pinata.cloud/ipfs/${cid}`,
          `https://cloudflare-ipfs.com/ipfs/${cid}`,
          `https://dweb.link/ipfs/${cid}`
        ]
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error subiendo a IPFS',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/ipfs/:cid
 * @desc Recupera contenido desde IPFS por CID
 */
router.get('/ipfs/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        success: false,
        error: 'CID requerido'
      });
    }

    const content = await filecoinStorageService.retrieveFromIPFS(cid);

    res.json({
      success: true,
      data: {
        cid,
        content,
        retrievedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error recuperando de IPFS',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/deals/list
 * @desc Lista todos los deals de almacenamiento activos
 */
router.get('/deals/list', async (req, res) => {
  try {
    // Mock de deals activos - en producción consultar desde smart contract
    const deals = [
      {
        dealId: 'deal_001',
        contentHash: '0x1234...abcd',
        cid: 'bafybeiexample1234567890',
        storageType: 'NEWS_CONTENT',
        size: '2.5 MB',
        duration: '2 years',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        dealId: 'deal_002',
        contentHash: '0x5678...efgh',
        cid: 'bafybeiexample0987654321',
        storageType: 'VALIDATION_EVIDENCE',
        size: '8.1 MB',
        duration: '3 years',
        status: 'active',
        createdAt: '2024-01-14T15:45:00Z'
      },
      {
        dealId: 'deal_003',
        contentHash: '0x9abc...ijkl',
        cid: 'bafybeiexample1357924680',
        storageType: 'PUBLIC_SNAPSHOT',
        size: '125 MB',
        duration: '5 years',
        status: 'active',
        createdAt: '2024-01-13T09:15:00Z'
      }
    ];

    res.json({
      success: true,
      data: {
        totalDeals: deals.length,
        activeDeals: deals.filter(d => d.status === 'active').length,
        deals
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error listando deals',
      details: error.message
    });
  }
});

/**
 * @route GET /api/filecoin/health
 * @desc Health check del servicio Filecoin
 */
router.get('/health', async (req, res) => {
  try {
    const networkStatus = await filecoinStorageService.getFilecoinNetworkStatus();
    const stats = await filecoinStorageService.getStorageStatistics();

    res.json({
      success: true,
      service: 'TruthBoard Filecoin Storage',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      network: networkStatus,
      storage: {
        totalDeals: stats.totalDealsCreated,
        dataStored: stats.totalDataStored,
        reliability: stats.storageReliability
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en health check Filecoin',
      details: error.message
    });
  }
});

module.exports = router;
