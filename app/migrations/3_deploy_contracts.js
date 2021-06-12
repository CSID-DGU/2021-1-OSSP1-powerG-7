var token2 = artifacts.require("./Token2.sol");

module.exports = function(deployer) {
  deployer.deploy(token2, "2powerG", "PG2", 0, 50);
};