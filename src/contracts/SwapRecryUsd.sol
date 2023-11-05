// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ReCryptoToken.sol";
import "./ReUSDToken.sol";

contract SwapRecryUsd {
    address public owner;
    ReCryptoToken public recry;
    ReUSDToken public reusd;

    uint public maxSupply    = 0; //number of token available 500000
    uint public protocolGain = 0; //protocol gain

    constructor(ReCryptoToken _recry, ReUSDToken _reusd) {
        recry = _recry;
        reusd = _reusd;
        owner = msg.sender;
    }
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function addRecrySupply(uint _amount) public payable isOwner {
        require(recry.balanceOf(msg.sender) >= _amount , "no enough recry to add");
        require(recry.transferFrom(msg.sender,address(this), _amount));
        maxSupply = maxSupply + _amount;
    }

    function changeRecrySupply(uint _amount) public isOwner {
        maxSupply = _amount;
    }

    function addProtocolGain(uint _amount) public isOwner {
        protocolGain = protocolGain + _amount;
    }

    function changeProtocolGain(uint _amount) public isOwner {
         protocolGain = _amount;
    }
    
    function withdrawReUSD(uint _amount) public payable isOwner{
        require(reusd.balanceOf(address(this)) > _amount, "no enough reusd to withdraw");
        require(reusd.transfer(owner, _amount));
    }

    function withdrawRecry(uint _amount) public payable isOwner{
        require(recry.balanceOf(address(this)) > _amount, "no enough recry to withdraw");
        require(recry.transfer(owner, _amount));
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

    function getReUSDMaxAvailable() public view returns(uint _value)
    {
            return reusd.balanceOf(address(this));
    }

    function getProtocolGain() public view returns(uint _value)
    {
            return protocolGain;
    }

    function isOwnerX() public view returns(bool _value)
    {
            if (msg.sender == owner)
            {
                return true;
            }
            else
            {
                return false;
            }
    }
    function getSender() public view returns(address _value)
    {
            return msg.sender;
    }
    function getOwner() public view returns(address _value)
    {
            return owner;
    }

    function buyRecryWithReUSD(uint _amount) public payable{
        // Require amount greater than 0
        uint qtyToBuy = _amount / getRecryValue();
        require(_amount > 0, "amount cannot be 0");
        require(recry.balanceOf(address(this)) >= qtyToBuy , "no enough recry to buy");
        uint maxRecharge = protocolGain - getReUSDMaxAvailable();
        if (maxRecharge > 0)
        {
               // Trasnfer some reusd to refill the protocol  not in the protocol
               if (_amount > maxRecharge)
               {
                     require(reusd.transferFrom(msg.sender, address(this), maxRecharge)); 
                     require(reusd.transferFrom(msg.sender, owner, _amount-maxRecharge)); 
               }
               else
               {
                    require(reusd.transferFrom(msg.sender, address(this), _amount)); 
               }
        }
        else
        {
             // Transfer reusd to the owner not in the protocol
               require(reusd.transferFrom(msg.sender, owner, _amount)); 
        }
        
        // Trasnfer recry to the buyer
        recry.transfer(msg.sender, _amount);        
    }

    function sellRecryForReUSD(uint _amount) public payable{
        // Require amount greater than 0
        uint qtyToSell = _amount * getRecryValue();
        require(_amount > 0, "amount cannot be 0");
        require(recry.balanceOf(msg.sender) >= _amount , "no enough recry to sell");
        require(getReUSDMaxAvailable() >= qtyToSell , "no enough reusd to swap");

        // Trasnfer reusd to the owner not in the protocol
        require(recry.transferFrom(msg.sender, address(this), _amount));
        // Trasnfer recry to the buyer
        reusd.transfer(msg.sender, qtyToSell);        

    }


}
