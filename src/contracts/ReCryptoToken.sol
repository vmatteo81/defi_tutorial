// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Authority.sol";

contract ReCryptoToken {
    string  public name = "ReCrypto Token";
    string  public symbol = "RECRY";
    uint256 public totalSupply = 1000000000000000000000000000000000; // 1 trillion tokens
    uint8   public decimals = 18;
    Authority auth;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(Authority _auth) {
        balanceOf[msg.sender] = totalSupply;
        auth = _auth;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require (auth.isAuthorized(_to, msg.sender) == true , "not authorized");
        require(balanceOf[msg.sender] >= _value,"not balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require (auth.isAuthorized(_from, _to) == true , "not authorized");
        require(_value <= balanceOf[_from],"not balance");
        require(_value <= allowance[_from][msg.sender],"not allowance");
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
