// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FtsoV2Interface
 * @dev Interface para FTSO V2 de Flare Network
 */
interface FtsoV2Interface {
    function getFeedValue(
        bytes21 _feedId
    ) external view returns (uint256 _value, int8 _decimals, uint64 _timestamp);

    function getFeedValueAndDecimals(
        bytes21 _feedId
    ) external view returns (uint256 _value, int8 _decimals);
}

/**
 * @title FdcInterface
 * @dev Interface para Flare Data Connector
 */
interface FdcInterface {
    function verifyAttestation(
        bytes32 _attestationHash,
        bytes32[] calldata _merkleProof
    ) external view returns (bool);

    function getAttestationData(
        bytes32 _attestationHash
    ) external view returns (bytes memory _data, uint256 _timestamp);
}

/**
 * @title SecureRandomInterface
 * @dev Interface para Secure Random Numbers de Flare
 */
interface SecureRandomInterface {
    function getRandomNumber() external view returns (uint256);

    function getRandomNumberWithSeed(
        uint256 _seed
    ) external view returns (uint256);
}
