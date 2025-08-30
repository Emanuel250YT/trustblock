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
 * @route GET /api/validation/status/:contentHash
 * @desc Obtiene el estado de validación de una noticia
 */
router.get('/status/:contentHash', async (req, res) => {
  try {
    const { contentHash } = req.params;

    if (!contentHash) {
      return res.status(400).json({
        error: 'Hash de contenido requerido'
      });
    }

    // Obtener validación del smart contract
    const validation = await blockchainService.getValidation(contentHash);

    if (!validation) {
      return res.status(404).json({
        error: 'Validación no encontrada',
        message: 'No se encontró validación para el hash proporcionado'
      });
    }

    // Determinar estado
    let status = 'pending';
    if (validation.isFinalized) {
      if (validation.finalScore >= 75) status = 'validated';
      else if (validation.finalScore <= 25) status = 'rejected';
      else status = 'uncertain';
    } else if (validation.oracleVotes.length > 0 || validation.validatorVotes.length > 0) {
      status = 'validating';
    }

    res.json({
      success: true,
      data: {
        contentHash,
        status,
        score: validation.finalScore || 0,
        validations: {
          ai_oracles: validation.oracleVotes?.length || 0,
          community_validators: validation.validatorVotes?.length || 0,
          total_votes: (validation.oracleVotes?.length || 0) + (validation.validatorVotes?.length || 0)
        },
        breakdown: {
          fake_news_score: validation.breakdown?.fake_news_score || 0,
          deepfake_score: validation.breakdown?.deepfake_score || 0,
          bias_score: validation.breakdown?.bias_score || 0,
          credibility_score: validation.breakdown?.credibility_score || 0
        },
        timestamp: validation.createdAt || new Date().toISOString()
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
 * @route POST /api/validation/vote
 * @desc Registra un voto de validación de un usuario
 */
router.post('/vote', async (req, res) => {
  try {
    const {
      contentHash,
      walletAddress,
      vote,
      confidence,
      evidence,
      signature
    } = req.body;

    // Validar parámetros requeridos
    if (!contentHash || !walletAddress || vote === undefined || !signature) {
      return res.status(400).json({
        error: 'Parámetros requeridos faltantes',
        message: 'contentHash, walletAddress, vote y signature son requeridos'
      });
    }

    // Validar confianza
    if (confidence && (confidence < 1 || confidence > 100)) {
      return res.status(400).json({
        error: 'Confidence inválido',
        message: 'Confidence debe estar entre 1 y 100'
      });
    }

    // Verificar firma
    const isValidSignature = await validationService.verifySignature({
      contentHash,
      walletAddress,
      vote,
      confidence,
      signature
    });

    if (!isValidSignature) {
      return res.status(401).json({
        error: 'Firma inválida',
        message: 'La firma criptográfica no es válida'
      });
    }

    // Verificar si el usuario ya votó
    const existingVote = await validationService.getUserVote(contentHash, walletAddress);
    if (existingVote) {
      return res.status(409).json({
        error: 'Voto ya registrado',
        message: 'Ya has votado en esta validación'
      });
    }

    // Registrar voto
    const voteResult = await validationService.submitVote({
      contentHash,
      walletAddress,
      vote,
      confidence: confidence || 75,
      evidence
    });

    // Calcular recompensa
    const reward = await stakingService.calculateVoteReward(walletAddress, confidence || 75);

    // Actualizar reputación
    const newReputation = await stakingService.updateReputation(walletAddress, 'vote_submitted');

    res.json({
      success: true,
      message: 'Voto registrado exitosamente',
      data: {
        voteId: voteResult.voteId,
        transactionHash: voteResult.txHash,
        reward: `${reward.amount} ${reward.token}`,
        newReputation: newReputation
      }
    });

  } catch (error) {
    console.error('Error al registrar voto:', error);
    res.status(500).json({
      error: 'Error al procesar voto',
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
