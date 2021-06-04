var fund = artifacts.require("./newCrowdFund.sol");

module.exports = function(deployer) {
  deployer.deploy(fund, 
    "0x956A51C72AcB629dc958453783de68FD6A07A522", 30, 100, 1, 
    "0x0de2E85d243e3c45F3cFA8b7D757b43C05E7A70E");
}; // 판매자계정, 목표금액(이더), 기간(분), 교환비율, 방금만든 토큰 주소