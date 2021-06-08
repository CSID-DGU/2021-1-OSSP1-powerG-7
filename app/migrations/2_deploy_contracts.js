var fund = artifacts.require("./newCrowdFund.sol");

module.exports = function(deployer) {
  deployer.deploy(fund, 
    "0x8A1dC462784B0481A1CeC2F89bF99B77512594bf", 30, 10, 1, 
    "0x13eD2CD82F7DCDeC7A1CC796f14f261f0C977a7d");
}; // 판매자계정, 목표금액(이더), 기간(분), 교환비율, 방금만든 토큰 주소