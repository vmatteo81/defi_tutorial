// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ReCryptoToken.sol";
import "./UsdcToken.sol";

contract RecryUsdcSwap {
    address public owner;
    ReCryptoToken public recry;
    UsdcToken public usdc;

    uint public maxSupply    = 500000000000000000000000; //number of toklen available 500000
    uint public protocolGain = 0; //protocol gain

    address[] public buyers;
    mapping(address => uint) public buyBalance;
    mapping(address => bool) public hasPurchased;
    mapping(address => bool) public isPurchased;

    constructor(ReCryptoToken _recry, UsdcToken _usdc) {
        recry = _recry;
        usdc = _usdc;
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

    function getRecryValue() public view returns(uint _value)
    {
           return  _value = ((maxSupply+protocolGain)/maxSupply);
    }

    function getMaxSupply() public view returns(uint _value)
    {
            return maxSupply;
    }
    function getProtocolGain() public view returns(uint _value)
    {
            return protocolGain;
    }

    function buyRecryWithUsdc(uint _amount) public {
        // Require amount greater than 0
        uint qtyToBuy = _amount / getRecryValue();
        require(_amount > 0, "amount cannot be 0");
        require(maxSupply < qtyToBuy, "no enough recry to buy");

        // Trasnfer usdc to the owner not in the protocol
        usdc.transferFrom(msg.sender, owner, _amount);
        // Trasnfer recry to the buyer
        recry.transferFrom(address(this), msg.sender, _amount);

        // Update buy balance
        buyBalance[msg.sender] = buyBalance[msg.sender] + qtyToBuy;

        // Add user to buyers array *only* if they haven't buyed already
        if(!hasPurchased[msg.sender]) {
            buyers.push(msg.sender);
        }

        // Update buying status
        isPurchased[msg.sender] = true;
        hasPurchased[msg.sender] = true;
    }

}
