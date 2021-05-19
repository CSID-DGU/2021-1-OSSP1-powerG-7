pragma solidity ^0.5.2;

// 결제 가능한만큼 입금되었는지 확인
contract Pay{
  enum Statuses { notFull , Full } // notFull은 0, Full은 1 펀딩이 최대치만큼 찼는지 확인하기 위함
  Statuses currentStatus;
  address payable public owner; // payable 키워드로 호출자로부터 이더를 받을 수 있다
  event Contract_State(address _user, uint _value); // 현재 계약 상태에 대한 정보를 알려주기 위해 필요 (아직 구현 부족)

  constructor() public{
    owner = msg.sender;
    unit8 public coupon_max = 30; // 최대치 30으로 임의로 설정 변경시 펀딩 최대량 조정가능
    unit8 public coupon_count = 0 // 결제된 쿠폰의 개수
    currentStatus = Statuses.notFull;
  }

  modifier Funding_Not_End {
    // 펀딩이 종료되었는지 확인 종료되었으면 메세지 출력
    require(currentStatus == Statuses.notFull, "해당 펀딩은 종료되었습니다");
    _;
  }
  modifier Enough_Money(uint _amount) {
    // 결제를 위한 돈이 충분한지 확인 부족하면 메세지 출력
    require((msg.value >= _amount), "결제를 위한 금액이 부족합니다");
    _;
  }
  receive() external payable Funding_Not_End Enough_Money(1 ether){  // receive() 함수 사용으로 지갑을 통한 결제 가능
    coupon_count++; // 쿠폰 하나 추가
    if(coupon_count == coupon_max){ // 펀딩이 max만큼 진행되면 현상태를 Full로 설정해서 더 이상 실행되지 않게함
      currentStatus = Statuses.Full;
    }
    owner.trasfer(msg.value); //이더 전송을 위해서 구현
    emit Contract_State(msg.sender, msg.value); // 실행된 로그를 이벤트 데이터에 집어넣 (아직 구현 부족)
  }
}
