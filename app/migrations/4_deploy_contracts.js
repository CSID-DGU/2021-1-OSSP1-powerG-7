var fund2 = artifacts.require("./newCrowdFund2.sol");

module.exports = function(deployer) {
  deployer.deploy(fund2, 
    "0x4c8161427af6dCaA826Ac2AeF4cCe5D91FE28dc5", 50, 25, 2, 
    "0xF566b72D5225d0B19Be378D0BFB1cfDCfcf3c0F3");
}; // 판매자계정, 목표금액(이더), 기간(분), 교환비율, 방금만든 토큰 주소