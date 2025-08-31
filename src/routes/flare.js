const express = require('express');
const router = express.Router();
const FlareOracleService = require('../services/flareOracleService');
const { ethers } = require('ethers');

const flareService = new FlareOracleService();

/**
 * @swagger
 * /api/flare/prices:
 *   get:
 *     summary: Obtener precios actuales usando FTSO
 *     tags: [Flare Oracle]
 *     parameters:
 *       - in: query
 *         name: symbols
 *         schema:
 *           type: string
 *         description: Símbolos separados por comas (BTC,ETH,USDC)
 *     responses:
 *       200:
 *         description: Precios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 network:
 *                   type: string
 */
router.get('/prices', async (req, res) => {
  try {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : ['BTC', 'ETH', 'USDC', 'FLR'];

    const result = await flareService.getPriceFeeds(symbols);

    res.json({
      success: result.success,
      data: result.data,
      network: result.network,
      timestamp: result.timestamp,
      message: result.success ? 'Precios obtenidos exitosamente' : 'Error obteniendo precios'
    });
  } catch (error) {
    console.error('Error en /flare/prices:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/flare/economic-context:
 *   get:
 *     summary: Obtener contexto económico completo
 *     tags: [Flare Oracle]
 *     responses:
 *       200:
 *         description: Contexto económico obtenido exitosamente
 */
router.get('/economic-context', async (req, res) => {
  try {
    const result = await flareService.getEconomicContext();

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Contexto económico obtenido' : 'Error obteniendo contexto'
    });
  } catch (error) {
    console.error('Error en /flare/economic-context:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/random:
 *   get:
 *     summary: Obtener número aleatorio seguro
 *     tags: [Flare Oracle]
 *     responses:
 *       200:
 *         description: Número aleatorio generado exitosamente
 */
router.get('/random', async (req, res) => {
  try {
    const result = await flareService.getSecureRandomNumber();

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Número aleatorio generado' : 'Error generando número aleatorio'
    });
  } catch (error) {
    console.error('Error en /flare/random:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/submit-news:
 *   post:
 *     summary: Enviar noticia para validación con contexto de precio
 *     tags: [Flare Oracle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - sourceUrl
 *               - signature
 *               - address
 *             properties:
 *               content:
 *                 type: string
 *               sourceUrl:
 *                 type: string
 *               priceSymbol:
 *                 type: string
 *                 default: "BTC"
 *               signature:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Noticia enviada exitosamente
 */
router.post('/submit-news', async (req, res) => {
  try {
    const { content, sourceUrl, priceSymbol = 'BTC', signature, address } = req.body;

    if (!content || !sourceUrl || !signature || !address) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: content, sourceUrl, signature, address'
      });
    }

    // Verificar firma
    const message = `Submit news for validation: ${content}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Firma inválida'
      });
    }

    // Generar hash de la noticia
    const newsHash = ethers.keccak256(ethers.toUtf8Bytes(content + sourceUrl));

    // Si hay private key configurada, enviar transacción
    if (process.env.FLARE_PRIVATE_KEY) {
      const result = await flareService.submitNewsForValidation(
        newsHash,
        sourceUrl,
        priceSymbol,
        process.env.FLARE_PRIVATE_KEY
      );

      res.json({
        success: result.success,
        data: {
          ...result.data,
          newsHash: newsHash,
          submittedBy: address
        },
        message: result.success ? 'Noticia enviada para validación on-chain' : 'Error enviando noticia'
      });
    } else {
      // Modo simulación sin transacción real
      res.json({
        success: true,
        data: {
          newsHash: newsHash,
          sourceUrl: sourceUrl,
          priceSymbol: priceSymbol,
          submittedBy: address,
          network: flareService.getNetworkInfo().network,
          simulation: true
        },
        message: 'Noticia preparada para validación (modo simulación)'
      });
    }
  } catch (error) {
    console.error('Error en /flare/submit-news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/validate-news:
 *   post:
 *     summary: Validar noticia usando FDC data
 *     tags: [Flare Oracle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newsHash
 *               - signature
 *               - address
 *             properties:
 *               newsHash:
 *                 type: string
 *               attestationData:
 *                 type: string
 *               merkleProof:
 *                 type: array
 *                 items:
 *                   type: string
 *               signature:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Validación completada exitosamente
 */
router.post('/validate-news', async (req, res) => {
  try {
    const {
      newsHash,
      attestationData = ethers.ZeroHash,
      merkleProof = [],
      signature,
      address
    } = req.body;

    if (!newsHash || !signature || !address) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: newsHash, signature, address'
      });
    }

    // Verificar firma
    const message = `Validate news: ${newsHash}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Firma inválida'
      });
    }

    // Si hay private key configurada, enviar transacción
    if (process.env.FLARE_PRIVATE_KEY) {
      const result = await flareService.validateNewsWithFDC(
        newsHash,
        attestationData,
        merkleProof,
        process.env.FLARE_PRIVATE_KEY
      );

      res.json({
        success: result.success,
        data: {
          ...result.data,
          validatedBy: address
        },
        message: result.success ? 'Validación completada on-chain' : 'Error en validación'
      });
    } else {
      // Modo simulación
      res.json({
        success: true,
        data: {
          newsHash: newsHash,
          validatedBy: address,
          network: flareService.getNetworkInfo().network,
          simulation: true,
          timestamp: Date.now()
        },
        message: 'Validación procesada (modo simulación)'
      });
    }
  } catch (error) {
    console.error('Error en /flare/validate-news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/register-validator:
 *   post:
 *     summary: Registrar validador con stake
 *     tags: [Flare Oracle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stakeAmount
 *               - signature
 *               - address
 *             properties:
 *               stakeAmount:
 *                 type: number
 *               signature:
 *                 type: string
 *               address:
 *                 type: string
 */
router.post('/register-validator', async (req, res) => {
  try {
    const { stakeAmount, signature, address } = req.body;

    if (!stakeAmount || !signature || !address) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: stakeAmount, signature, address'
      });
    }

    if (stakeAmount < 0.1) {
      return res.status(400).json({
        success: false,
        error: 'Stake mínimo requerido: 0.1 FLR'
      });
    }

    // Verificar firma
    const message = `Register as validator with stake: ${stakeAmount} FLR`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Firma inválida'
      });
    }

    // Si hay private key configurada, enviar transacción
    if (process.env.FLARE_PRIVATE_KEY) {
      const result = await flareService.registerValidator(
        stakeAmount,
        process.env.FLARE_PRIVATE_KEY
      );

      res.json({
        success: result.success,
        data: result.data,
        message: result.success ? 'Validador registrado exitosamente' : 'Error registrando validador'
      });
    } else {
      // Modo simulación
      res.json({
        success: true,
        data: {
          validator: address,
          stakedAmount: stakeAmount,
          network: flareService.getNetworkInfo().network,
          simulation: true,
          timestamp: Date.now()
        },
        message: 'Validador registrado (modo simulación)'
      });
    }
  } catch (error) {
    console.error('Error en /flare/register-validator:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/media-credibility/{mediaName}:
 *   get:
 *     summary: Obtener credibilidad de un medio
 *     tags: [Flare Oracle]
 *     parameters:
 *       - in: path
 *         name: mediaName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Credibilidad obtenida exitosamente
 */
router.get('/media-credibility/:mediaName', async (req, res) => {
  try {
    const { mediaName } = req.params;

    const result = await flareService.getMediaCredibility(mediaName);

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Credibilidad obtenida' : 'Error obteniendo credibilidad'
    });
  } catch (error) {
    console.error('Error en /flare/media-credibility:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/validation/{newsHash}:
 *   get:
 *     summary: Obtener validación de una noticia
 *     tags: [Flare Oracle]
 *     parameters:
 *       - in: path
 *         name: newsHash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Validación obtenida exitosamente
 */
router.get('/validation/:newsHash', async (req, res) => {
  try {
    const { newsHash } = req.params;

    const result = await flareService.getValidation(newsHash);

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Validación obtenida' : 'Error obteniendo validación'
    });
  } catch (error) {
    console.error('Error en /flare/validation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/validator/{address}:
 *   get:
 *     summary: Obtener perfil de validador
 *     tags: [Flare Oracle]
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 */
router.get('/validator/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!ethers.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Dirección inválida'
      });
    }

    const result = await flareService.getValidatorProfile(address);

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Perfil obtenido' : 'Error obteniendo perfil'
    });
  } catch (error) {
    console.error('Error en /flare/validator:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/flare/status:
 *   get:
 *     summary: Obtener estado del oracle Flare
 *     tags: [Flare Oracle]
 *     responses:
 *       200:
 *         description: Estado obtenido exitosamente
 */
router.get('/status', async (req, res) => {
  try {
    const [isAvailable, stats, networkInfo] = await Promise.all([
      flareService.isAvailable(),
      flareService.getOracleStats(),
      Promise.resolve(flareService.getNetworkInfo())
    ]);

    res.json({
      success: true,
      data: {
        isAvailable: isAvailable,
        stats: stats.data || {},
        network: networkInfo,
        timestamp: Date.now()
      },
      message: 'Estado del oracle obtenido'
    });
  } catch (error) {
    console.error('Error en /flare/status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
