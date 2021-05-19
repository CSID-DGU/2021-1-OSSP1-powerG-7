const TestToken = artifacts.require("./Test");

module.exports = function(deployer) {
  deployer.deploy(TestToken);
};
