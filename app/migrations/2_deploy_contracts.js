var fund = artifacts.require("./newCrowdFund.sol");

module.exports = function(deployer) {
  deployer.deploy(fund, 
    "0x326159D82bab9e6510FC7197b854e1a1D7AD4a63", 30, 10, 1, 
    "0x81330bf95792eA2d247C40DA793c69c470C36730");
}; // 판매자계정, 목표금액(이더), 기간(분), 교환비율, 방금만든 토큰 주소