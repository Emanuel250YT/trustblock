const express = require('express');
const router = express.Router();
const zkTruthBoardService = require('../services/zkTruthBoardService');

/**
 * @route POST /api/truthboard/publish
 * @desc Publica una noticia de forma anónima
 */
router.post('/publish', async (req, res) => {
  try {
    const { content, title, region, publisherIdentity } = req.body;

    if (!content || !title || !region || !publisherIdentity) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: content, title, region, publisherIdentity'
      });
    }

    const result = await zkTruthBoardService.publishAnonymousNews({
      content,
      title,
      region,
      publisherIdentity
    });

    res.json({
      success: true,
      message: 'Noticia publicada anónimamente',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/truthboard/validator/register
 * @desc Registra un validador de forma anónima
 */
router.post('/validator/register', async (req, res) => {
  try {
    const { identity, region, stake } = req.body;

    if (!identity || !region || !stake) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: identity, region, stake'
      });
    }

    const result = await zkTruthBoardService.registerAnonymousValidator({
      identity,
      region,
      stake
    });

    res.json({
      success: true,
      message: 'Validador registrado anónimamente',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/truthboard/validate
 * @desc Valida una noticia de forma anónima
 */
router.post('/validate', async (req, res) => {
  try {
    const { newsHash, vote, validatorCommitment } = req.body;

    if (!newsHash || vote === undefined || !validatorCommitment) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: newsHash, vote, validatorCommitment'
      });
    }

    if (vote < 0 || vote > 100) {
      return res.status(400).json({
        success: false,
        error: 'El vote debe estar entre 0 y 100'
      });
    }

    const result = await zkTruthBoardService.validateNewsAnonymously({
      newsHash,
      vote,
      validatorCommitment
    });

    res.json({
      success: true,
      message: 'Validación anónima registrada',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/truthboard/donate
 * @desc Procesa una donación anónima
 */
router.post('/donate', async (req, res) => {
  try {
    const { newsHash, amount, donorIdentity } = req.body;

    if (!newsHash || !amount || !donorIdentity) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: newsHash, amount, donorIdentity'
      });
    }

    const result = await zkTruthBoardService.processAnonymousDonation({
      newsHash,
      amount,
      donorIdentity
    });

    res.json({
      success: true,
      message: 'Donación anónima procesada',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/truthboard/news/:hash
 * @desc Obtiene información de una noticia por hash
 */
router.get('/news/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({
        success: false,
        error: 'Hash de noticia requerido'
      });
    }

    // Verificar anclaje en Bitcoin
    const bitcoinStatus = await zkTruthBoardService.checkBitcoinAnchorage(hash);

    // Obtener contenido encriptado de IPFS (mock)
    const ipfsContent = await zkTruthBoardService.getFromIPFS(hash);

    res.json({
      success: true,
      data: {
        newsHash: hash,
        bitcoinAnchorage: bitcoinStatus,
        ipfsContent: ipfsContent,
        isEncrypted: true,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/truthboard/stats
 * @desc Obtiene estadísticas de la plataforma
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await zkTruthBoardService.getPlatformStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/truthboard/citrea/status
 * @desc Obtiene el estado de la conexión con Citrea
 */
router.get('/citrea/status', async (req, res) => {
  try {
    const status = await zkTruthBoardService.getCitreaStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/truthboard/zk/prove
 * @desc Genera una prueba ZK para un tipo específico
 */
router.post('/zk/prove', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: type, data'
      });
    }

    const validTypes = ['publisher_identity', 'validator_eligibility', 'anonymous_donation', 'anonymous_validation'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: `Tipo de prueba inválido. Tipos válidos: ${validTypes.join(', ')}`
      });
    }

    const zkProof = zkTruthBoardService.generateZKProof(type, data);

    res.json({
      success: true,
      data: {
        type,
        proof: '0x' + zkProof,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/truthboard/commitment/generate
 * @desc Genera un commitment hash para identidad anónima
 */
router.post('/commitment/generate', async (req, res) => {
  try {
    const { identity, salt } = req.body;

    if (!identity || !salt) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: identity, salt'
      });
    }

    const commitment = zkTruthBoardService.generateAnonymousCommitment(identity, salt);

    res.json({
      success: true,
      data: {
        commitment,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/truthboard/health
 * @desc Health check específico para TruthBoard
 */
router.get('/health', async (req, res) => {
  try {
    const citreaStatus = await zkTruthBoardService.getCitreaStatus();
    const stats = await zkTruthBoardService.getPlatformStats();

    res.json({
      success: true,
      service: 'TruthBoard ZK Anonymous News Platform',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      citrea: citreaStatus,
      platform: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en health check',
      details: error.message
    });
  }
});

module.exports = router;
