// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Authority {
    address public owner;
    mapping(address => uint) public permissions;

    constructor() {
        owner = msg.sender;
        addAuth(msg.sender);
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    function addAuth(address _value) public isOwner {
       permissions[_value] = 1;
    }
    function addBlock(address _value) public isOwner {
        permissions[_value] = 2;
    }
    function delAuth(address _value) public isOwner {
       permissions[_value] = 0;
    }
    function delBlock(address _value) public isOwner {
        permissions[_value] = 0;
    }

    function isAuthorized(address _add1,address _add2) public view returns (bool) {
        bool retVal = false;
        if (permissions[_add1] == 1 || permissions[_add2] ==1)
        {
           retVal = true;
        }
        if (permissions[_add1] == 2 || permissions[_add2] ==2)
        {
           retVal = false;
        }
        return retVal;
    }

 
}
