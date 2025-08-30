const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const validationService = require('../services/validationService');
const blockchainService = require('../services/blockchainService');

/**
 * @route POST /api/validation/submit
 * @desc Envía una noticia para validación
 */
router.post('/submit', async (req, res) => {
  try {
    const { url, content, title } = req.body;

    if (!url && !content) {
      return res.status(400).json({
        error: 'URL o contenido requerido',
        message: 'Debes proporcionar al menos una URL o contenido de texto'
      });
    }

    // Procesar y generar hash del contenido
    const processedContent = await validationService.processContent({ url, content, title });

    // Subir a IPFS y obtener hash
    const contentHash = await validationService.uploadToIPFS(processedContent);

    // Enviar al smart contract
    const txHash = await blockchainService.submitNews(contentHash);

    res.status(201).json({
      success: true,
      message: 'Noticia enviada para validación',
      data: {
        contentHash,
        transactionHash: txHash,
        processedContent: {
          title: processedContent.title,
          summary: processedContent.summary,
          timestamp: processedContent.timestamp
        }
      }
    });

  } catch (error) {
    console.error('Error al enviar noticia:', error);
    res.status(500).json({
      error: 'Error al procesar solicitud',
      message: error.message
    });
  }
});

/**
 * @route GET /api/validation/:contentHash
 * @desc Obtiene el estado de validación de una noticia
 */
router.get('/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;

    if (!contentHash) {
      return res.status(400).json({
        error: 'Hash de contenido requerido'
      });
    }

    // Obtener validación del smart contract
    const validation = await blockchainService.getValidation(contentHash);

    // Obtener contenido de IPFS
    const content = await validationService.getFromIPFS(contentHash);

    res.json({
      success: true,
      data: {
        contentHash,
        validation: {
          finalScore: validation.finalScore,
          isFinalized: validation.isFinalized,
          oracleVotes: validation.oracleVotes.length,
          communityVotes: validation.validatorVotes.length,
          evidenceHash: validation.evidenceHash
        },
        content: {
          title: content.title,
          summary: content.summary,
          timestamp: content.timestamp,
          source: content.source
        },
        verdict: _getVerdict(validation.finalScore, validation.isFinalized)
      }
    });

  } catch (error) {
    console.error('Error al obtener validación:', error);
    res.status(500).json({
      error: 'Error al obtener información',
      message: error.message
    });
  }
});

/**
 * @route POST /api/validation/:contentHash/vote
 * @desc Permite votar sobre una validación (para validadores comunitarios)
 */
router.post('/:contentHash/vote', async (req, res) => {
  try {
    const { contentHash } = req.params;
    const { vote, walletAddress, signature } = req.body;

    // Validaciones básicas
    if (!contentHash || vote === undefined || !walletAddress || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos: contentHash, vote, walletAddress, signature'
      });
    }

    if (![0, 1, 2].includes(parseInt(vote))) {
      return res.status(400).json({
        error: 'Voto inválido',
        message: 'El voto debe ser 0 (fake), 1 (real), o 2 (incierto)'
      });
    }

    // Verificar firma del validador
    const isValidSignature = await validationService.verifyValidatorSignature(
      walletAddress,
      signature,
      contentHash
    );

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida',
        message: 'No se pudo verificar la identidad del validador'
      });
    }

    // Enviar voto al smart contract
    const txHash = await blockchainService.communityValidate(
      contentHash,
      parseInt(vote),
      walletAddress
    );

    res.json({
      success: true,
      message: 'Voto registrado exitosamente',
      data: {
        contentHash,
        vote: parseInt(vote),
        transactionHash: txHash,
        voter: walletAddress
      }
    });

  } catch (error) {
    console.error('Error al registrar voto:', error);
    res.status(500).json({
      error: 'Error al registrar voto',
      message: error.message
    });
  }
});

/**
 * @route GET /api/validation/recent/:limit?
 * @desc Obtiene las validaciones más recientes
 */
router.get('/recent/:limit?', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;

    if (limit > 50) {
      return res.status(400).json({
        error: 'Límite máximo de 50 resultados'
      });
    }

    const recentValidations = await validationService.getRecentValidations(limit);

    res.json({
      success: true,
      data: recentValidations,
      meta: {
        count: recentValidations.length,
        limit
      }
    });

  } catch (error) {
    console.error('Error al obtener validaciones recientes:', error);
    res.status(500).json({
      error: 'Error al obtener datos',
      message: error.message
    });
  }
});

/**
 * @route GET /api/validation/stats
 * @desc Obtiene estadísticas generales de validación
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await validationService.getValidationStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

/**
 * Función helper para determinar el veredicto
 */
function _getVerdict(finalScore, isFinalized) {
  if (!isFinalized) {
    return {
      status: 'pending',
      message: 'Validación en proceso',
      confidence: 0
    };
  }

  if (finalScore >= 80) {
    return {
      status: 'verified',
      message: 'Contenido verificado como real',
      confidence: finalScore
    };
  } else if (finalScore <= 20) {
    return {
      status: 'fake',
      message: 'Contenido identificado como falso',
      confidence: 100 - finalScore
    };
  } else {
    return {
      status: 'uncertain',
      message: 'Resultado incierto, requiere más validación',
      confidence: Math.abs(50 - finalScore)
    };
  }
}

module.exports = router;
