pragma solidity ^0.4.16;

contract PGToken {
   string public name="powerG";
   string public symbol="PG";
   uint8 public decimals=0;

   mapping (address => uint256) public balanceOf;

   event Transfer(address _from, address _to, uint _value);
    
    function getBalanceOf(address _to) public view returns (uint256) {
        return balanceOf[_to];
    }
    function setBalanceOf(address _to, uint256 _value) public {
        balanceOf[_to]=_value;
    }

    function transfer(address _to, uint256 _value) {
        setBalanceOf(msg.sender, 1000);
        setBalanceOf(_to, 1000);

        if (balanceOf[msg.sender] < _value) revert();
        if (balanceOf[_to] + _value < balanceOf[_to]) revert();

        setBalanceOf(msg.sender, balanceOf[msg.sender]-_value); // Subtract from the sender
                        
        setBalanceOf(_to, balanceOf[_to]+_value); // Add the same to the recipient

        Transfer(msg.sender,_to,_value);
    }
}
