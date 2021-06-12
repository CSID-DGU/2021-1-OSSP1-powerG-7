var fund = artifacts.require("./newCrowdFund2.sol");

module.exports = function(deployer) {
  deployer.deploy(fund,
    "0x0494293f2aaC3aD499D69e6AE37E8881354Dea74", 30, 10, 1,
    "0x1AF3774C314a10845aE9c854F8A77c5c6ba92385");
}; // 판매자계정, 목표금액(이더), 기간(분), 교환비율, 방금만든 토큰 주소
