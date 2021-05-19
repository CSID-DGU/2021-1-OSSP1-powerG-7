pragma solidity ^0.4.11;

contract CrowdFunding {
	// 투자자 구조체
	struct Investor {
		address addr;	// 투자자 주소
		uint amount;	// 투자 금액
	}
	
	address public owner;		// 계약 소유자
	uint public numInvestors;	// 투자자 수
	uint public deadline;		// 마감일(UnixTime)
	string public status;		// 모금 활동 상태
	bool public ended;			// 모금 종료 여부
	uint public goalAmount;		// 목표 금액
	uint public totalAmount;	// 총 투자액
	
	uint public exchangeRate;   // 이더 토큰 교환 비율
	
	mapping (uint => Investor) public investors;	// 투자자 관리 위한 매핑
	
	modifier onlyOwner () {
		require(msg.sender == owner);
		_;
	}
	
	/// 생성자
	function CrowdFunding(uint _duration, uint _goalAmount) {
		owner = msg.sender;

		// 마감일 설정(UnixTime)
		deadline = now + _duration;

		goalAmount = _goalAmount;
		status = "Funding";
		ended = false;

		numInvestors = 0;
		totalAmount = 0;
	}
	
	/// 투자 시 호출되는 함수
	function fund() payable {
		// 모금 끝나면 중단
		require(!ended);
		
		Investor inv = investors[numInvestors++];
		inv.addr = msg.sender;
		inv.amount = msg.value;
		totalAmount += inv.amount;
	}
	
	/// 목표액 달성 여부 확인
	function checkGoalReached () public onlyOwner {
		// 모금이 끝났다면 처리 중단
		require(!ended);
		
		if(totalAmount >= goalAmount) {	// 모금 성공인 경우
			status = "Contract Succeeded";
			ended = true;
			// 컨트랙트 소유자에게 컨트랙트에 있는 모든 이더를 송금
			if(!owner.send(this.balance)) {
				throw;
			}
		} else {	// 모금 실패인 경우
			uint i = 0;
			status = "Contract Failed";
			ended = true;
			
			// 각 투자자에게 투자금을 돌려줌
			while(i <= numInvestors) {
				if(!investors[i].addr.send(investors[i].amount)) {
					throw;
				}
				i++;
			}
		}
	}

	 event Transfer(
        address indexed _from, // 토큰이 인출되는 지갑 주소
        address indexed _to,   // 토큰이 입금되는 지갑 주소
        uint256 _value
    );
    
	// 토큰
	string public symbol;
    string public name;
    uint8 public decimals;
    uint public totalSupply;
    
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

	function Token() public {
        symbol = 'TK';
        name = 'Token';
        decimals = 18;
        totalSupply = 1000 * 10**uint(decimals);
        balances[msg.sender] = totalSupply;
        Transfer(address(0), msg.sender, totalSupply);
    } 
	// 모금성공일때 투자자에게 토큰 나누어줌..(구현X)
	
	/// 컨트랙트를 소멸시키기 위한 함수
	function kill() public onlyOwner {
		selfdestruct(owner);
	}
	/// 목표액 확인
	 function returnGoalAmount() public view returns (uint){
        return goalAmount;
    }
	/// 총 투자액 확인
    function returnTotalAmount() public view returns (uint){
        return totalAmount;
    }
	/// 마감일 확인
    function returnDeadline() public view returns (uint){
        return deadline;
    }

}
