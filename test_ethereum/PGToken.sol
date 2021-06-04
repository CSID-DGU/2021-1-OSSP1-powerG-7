pragma solidity ^0.4.16;

contract PGToken {
   string public name="PGToken";
   string public symbol="PGT";
   uint8 public decimals=0;
   uint256 public totalSupply;

   mapping (address => uint256) public balanceOf;

   event Transfer(address _from, address _to, uint _value);

   function PGToken (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        if (balanceOf[msg.sender] < _value) revert();
        if (balanceOf[_to] + _value < balanceOf[_to]) revert();

        balanceOf[msg.sender] -= _value;                    // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient

        Transfer(msg.sender,_to,_value);
        
        return true;
    }
}
