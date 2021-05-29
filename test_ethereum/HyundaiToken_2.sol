pragma solidity ^0.5.2;

contract tokenReceipient {
 function  receiveApproval (address _from, uint256 _value, address _token, bytes memory _extraData) public{
     
 }
}

contract HyundaiToken {
	// Token 의 Public 변수 들
	string public standard = "Hyundai Token";
	string public name;
	string public symbol;
	uint8 public decimals;
	uint256 public totalSupply;

	mapping (address => uint256) public balanceOf;
	mapping (address => mapping (address => uint256)) public allowance;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approved(address spender, uint value);

	function HyundaiToken2 (
		uint256 initialSupply,
		string memory tokenName,
		uint8 decimalUnits,
		string memory tokenSymbol) public {
		balanceOf[msg.sender] = initialSupply;
		totalSupply = initialSupply;
		name = tokenName;
		symbol = tokenSymbol;
		decimals = decimalUnits;
	}

	/* Token 이체 */
	function transfer(address _to, uint256 _value) public {
	//	if (balanceOf[msg.sender] < _value) throw;
	//	if (balanceOf[_to] + _value < balanceOf[_to]) throw;

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
	    emit Transfer(msg.sender, _to, _value);
	}

	/* 특정 Contract 가 내 대신 Token 을 쓸 수 있도록 함 */
	function approve(address _spender, uint256 _value) public returns (bool success_) {
		allowance[msg.sender][_spender] = _value;
		return true;
	}

	/* Approve 받은 Contract 에게 알림 */
	function approveAndCall(address _spender, uint256 _value, bytes memory _extraData) public returns (bool success_) {
		tokenReceipient spender = tokenReceipient(_spender);
		if (approve(_spender, _value)) {
			spender.receiveApproval(msg.sender, _value, _spender, _extraData);
			emit Approved(_spender, _value);
			return true;
		}
	}

	/* Contract 가 Token 을 가져가려 함 */
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success_) {
	//	if (balanceOf[_from] < _value) throw;
	//	if (balanceOf[_to] + _value < balanceOf[_to]) throw;
	//	if (_value > allowance[_from][msg.sender]) throw;

		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;

	    emit Transfer(_from, _to, _value);

		return true;
	}
}
