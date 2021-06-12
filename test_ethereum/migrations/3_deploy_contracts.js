var token = artifacts.require("./Token2.sol");

module.exports = function(deployer) {
  deployer.deploy(token, "powerG2", "PG2", 0, 30);
};
