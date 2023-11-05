// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract EurUsd {
    address public owner;
    uint256 public exchangeRate;
    uint256 public lastUpdated;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,string(abi.encodePacked("Only the owner (", msg.sender, ") can update the exchange rate.")));
        _;
    }

    function updateExchangeRate(uint256 newRate) external onlyOwner {
        exchangeRate = newRate;
        lastUpdated = block.timestamp;
    }

    function getExchangeRate() external view returns (uint256) {
        return exchangeRate;
    }
}
