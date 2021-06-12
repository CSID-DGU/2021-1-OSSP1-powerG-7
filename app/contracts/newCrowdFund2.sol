pragma solidity ^0.4.16;

interface token {
    function transfer(address receiver, uint amount);
}

contract newCrowdFund2 {
    address public beneficiary;
    uint public fundingGoal;
    uint public amountRaised;
    uint public deadline;
    uint public price;
    token public tokenReward;
   
    mapping(address => uint256) public balanceOf;
    bool public fundingGoalReached = false;
    bool public crowdsaleClosed = false;

    event GoalReached(address beneficiaryAddress, uint amountRaisedValue);
    event FundTransfer(address backer, uint amount, bool isContribution);


    function newCrowdFund2 (
        address ifSuccessfulSendTo, //펀딩 성공시 모금액이 송금될 계정
        uint fundingGoalInEthers, //펀딩 목표 금액 (이더)
        uint durationInMinutes, //펀딩이 진행될 기간 (분)
        uint etherCostOfEachToken, //이더와 토큰의 교환 비율
        address addressOfTokenUsedAsReward //보상으로 제공될 토큰의 주소값
    ) public {
        beneficiary = ifSuccessfulSendTo; //잔금
        fundingGoal = fundingGoalInEthers * 1 ether; 
        deadline = now + durationInMinutes * 1 minutes;
        price = etherCostOfEachToken * 1 ether;
        tokenReward = token(addressOfTokenUsedAsReward);
    }

    function () payable {
        require(!crowdsaleClosed);
        uint amount = msg.value;
        balanceOf[msg.sender] += amount;
        amountRaised += amount;
        tokenReward.transfer(msg.sender, amount / price);
        FundTransfer(msg.sender, amount, true);
    }

    modifier afterDeadline() { if (now >= deadline) _; }
   
    function checkGoalReached() afterDeadline { //펀딩기간 지나면 목표 달성했는지 확인 
        if (amountRaised >= fundingGoal){
            fundingGoalReached = true;
            GoalReached(beneficiary, amountRaised);
        }
        crowdsaleClosed = true;
    }

    function safeWithdrawal() afterDeadline { //목표 달성 실패시 환불
        if (!fundingGoalReached) {
            uint amount = balanceOf[msg.sender];
            balanceOf[msg.sender] = 0;
            if (amount > 0) {
                if (msg.sender.send(amount)) {
                    FundTransfer(msg.sender, amount, false);
                } else {
                    balanceOf[msg.sender] = amount;
                }
            }
        }
        if (fundingGoalReached && beneficiary == msg.sender) {
            if (beneficiary.send(amountRaised)) {
                FundTransfer(beneficiary, amountRaised, false);
            } else {
                fundingGoalReached = false;
            }
        }
    }
}