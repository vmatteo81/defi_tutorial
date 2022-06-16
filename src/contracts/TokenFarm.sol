// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ReCryptoToken.sol";
import "./UsdcToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    ReCryptoToken public ReCryptoToken;
    UsdcToken public UsdcToken;

    uint public maxSupply = 500000000000000000000000; //numero dei token disponibili sul mercato

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(ReCryptoToken _ReCryptoToken, UsdcToken _UsdcToken) {
        ReCryptoToken = _ReCryptoToken;
        UsdcToken = _UsdcToken;
        owner = msg.sender;
    }
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function addSupply(uint _amount) public isOwner {
        maxSupply = maxSupply + _amount;
    }

    function changeSupply(uint _amount) public isOwner {
        maxSupply = _amount;
    }

    function stakeTokens(uint _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Trasnfer Mock Dai tokens to this contract for staking
        UsdcToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstaking Tokens (Withdraw)
    function unstakeTokens() public {
        // Fetch staking balance
        uint balance = stakingBalance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Transfer Mock Dai tokens to this contract for staking
        UsdcToken.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                ReCryptoToken.transfer(recipient, balance);
            }
        }
    }
}
