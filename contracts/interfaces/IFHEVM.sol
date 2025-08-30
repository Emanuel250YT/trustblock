// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IFHEVM
 * @dev Interfaz para operaciones FHE de Zama
 * Proporciona funciones para encryption, operaciones homomórficas y decryption
 */
interface IFHEVM {
    // Tipos de datos cifrados
    struct EncryptedUint8 {
        bytes data;
    }

    struct EncryptedUint16 {
        bytes data;
    }

    struct EncryptedUint32 {
        bytes data;
    }

    struct EncryptedBool {
        bytes data;
    }

    // Funciones de cifrado
    function encrypt8(
        uint8 value
    ) external pure returns (EncryptedUint8 memory);
    function encrypt16(
        uint16 value
    ) external pure returns (EncryptedUint16 memory);
    function encrypt32(
        uint32 value
    ) external pure returns (EncryptedUint32 memory);
    function encryptBool(
        bool value
    ) external pure returns (EncryptedBool memory);

    // Funciones de descifrado
    function decrypt8(
        EncryptedUint8 memory encrypted
    ) external view returns (uint8);
    function decrypt16(
        EncryptedUint16 memory encrypted
    ) external view returns (uint16);
    function decrypt32(
        EncryptedUint32 memory encrypted
    ) external view returns (uint32);
    function decryptBool(
        EncryptedBool memory encrypted
    ) external view returns (bool);

    // Operaciones aritméticas homomórficas
    function add8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedUint8 memory);
    function add16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedUint16 memory);
    function add32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedUint32 memory);

    function sub8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedUint8 memory);
    function sub16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedUint16 memory);
    function sub32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedUint32 memory);

    function mul8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedUint8 memory);
    function mul16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedUint16 memory);
    function mul32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedUint32 memory);

    // Operaciones de comparación
    function eq8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function eq16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function eq32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    function ne8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function ne16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function ne32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    function lt8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function lt16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function lt32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    function lte8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function lte16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function lte32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    function gt8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function gt16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function gt32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    function gte8(
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedBool memory);
    function gte16(
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedBool memory);
    function gte32(
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedBool memory);

    // Operaciones lógicas
    function and(
        EncryptedBool memory a,
        EncryptedBool memory b
    ) external pure returns (EncryptedBool memory);
    function or(
        EncryptedBool memory a,
        EncryptedBool memory b
    ) external pure returns (EncryptedBool memory);
    function not(
        EncryptedBool memory a
    ) external pure returns (EncryptedBool memory);
    function xor(
        EncryptedBool memory a,
        EncryptedBool memory b
    ) external pure returns (EncryptedBool memory);

    // Operaciones de selección condicional
    function select8(
        EncryptedBool memory condition,
        EncryptedUint8 memory a,
        EncryptedUint8 memory b
    ) external pure returns (EncryptedUint8 memory);
    function select16(
        EncryptedBool memory condition,
        EncryptedUint16 memory a,
        EncryptedUint16 memory b
    ) external pure returns (EncryptedUint16 memory);
    function select32(
        EncryptedBool memory condition,
        EncryptedUint32 memory a,
        EncryptedUint32 memory b
    ) external pure returns (EncryptedUint32 memory);
    function selectBool(
        EncryptedBool memory condition,
        EncryptedBool memory a,
        EncryptedBool memory b
    ) external pure returns (EncryptedBool memory);

    // Funciones de utilidad
    function isInitialized8(
        EncryptedUint8 memory encrypted
    ) external pure returns (bool);
    function isInitialized16(
        EncryptedUint16 memory encrypted
    ) external pure returns (bool);
    function isInitialized32(
        EncryptedUint32 memory encrypted
    ) external pure returns (bool);
    function isInitializedBool(
        EncryptedBool memory encrypted
    ) external pure returns (bool);

    // Funciones para manejo de claves
    function generatePublicKey() external view returns (bytes memory);
    function verifySignature(
        bytes memory signature,
        bytes memory message,
        bytes memory publicKey
    ) external pure returns (bool);
}
