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

    constructor(ReCryptoToken _recry, UsdcToken _usdc) {
        recry = _recry;
        usdc = _usdc;
        owner = msg.sender;
    }
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function addRecrySupply(uint _amount) public isOwner {
       
        require(recry.balanceOf(msg.sender) >= _amount , "no enough recry to add");
        require(recry.transferFrom(msg.sender, address(this), _amount));
        maxSupply = maxSupply + _amount;
    }

    function changeRecrySupply(uint _amount) public isOwner {
        maxSupply = _amount;
    }

    function getRecryValue() public view returns(uint _value)
    {
           return  _value = ((maxSupply+protocolGain)/maxSupply);
    }
    function getRecryPrice() public view returns(uint _value)
    {
           return  _value = ((maxSupply+protocolGain)/maxSupply)*1000000000000000000;
    }
    function getRecryTotalValue() public view returns(uint _value)
    {
           return  _value = getRecryValue() * recry.balanceOf(msg.sender);
    }

    function getRecryMaxSupply() public view returns(uint _value)
    {
            return maxSupply;
    }

    function getRecryMaxAvailable() public view returns(uint _value)
    {
            return recry.balanceOf(address(this));
    }
    function getUsdcMaxAvailable() public view returns(uint _value)
    {
            return usdc.balanceOf(address(this));
    }

    function getProtocolGain() public view returns(uint _value)
    {
            return protocolGain;
    }

    function buyRecryWithUsdc(uint _amount) public {
        // Require amount greater than 0
        uint qtyToBuy = _amount / getRecryValue();
        require(_amount > 0, "amount cannot be 0");
        require(recry.balanceOf(address(this)) >= qtyToBuy , "no enough recry to buy");

        // Trasnfer usdc to the owner not in the protocol
        require(usdc.transferFrom(msg.sender, address(this), _amount));
        // Trasnfer recry to the buyer
        recry.transferFrom(address(this), msg.sender, _amount);        
    }

    function sellRecryForUsdc(uint _amount) public {
        // Require amount greater than 0
        uint qtyToSell = _amount * getRecryValue();
        require(_amount > 0, "amount cannot be 0");
        require(recry.balanceOf(msg.sender) >= _amount , "no enough recry to sell");
        require(getUsdcMaxAvailable() >= qtyToSell , "no enough usdc to swap");

        // Trasnfer usdc to the owner not in the protocol
        require(recry.transferFrom(msg.sender, address(this), _amount));
        // Trasnfer recry to the buyer
        usdc.transferFrom(address(this), msg.sender, qtyToSell);        

    }

    function withdrawUsdc(uint _amount) public isOwner{
        require(usdc.balanceOf(address(this)) > _amount, "no enough usdc to withdraw");
        require(usdc.transferFrom(address(this), msg.sender, _amount));
    }

}
