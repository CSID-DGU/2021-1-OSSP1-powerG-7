pragma solidity ^0.5.2;
import "./HyundaiToken_2.sol";
contract CrowdFunding {
    // Fund Investors
    struct Funder {
        address addr;
        uint amount;
    }
    
    // Fund Campaign
    struct Campaign {
        address beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }
    
    uint numCampaigns;
    mapping (uint => Campaign) public campaigns; // Campaign ID to Campaign

    // Initiate new campaign
    function newCampaign(address _beneficiary, uint _goal) public returns (uint campaignId_) {
        campaignId_ = numCampaigns++;
        campaigns[campaignId_] = Campaign(_beneficiary, _goal, 0,0);
    }
    
    function viewFunder(uint campaignID, uint funderID) public returns (address addr, uint amount) {
        addr   = campaigns[campaignID].funders[funderID].addr;
        amount = campaigns[campaignID].funders[funderID].amount;
    }
    
    function contribute(uint _campaignId) payable public {
        Campaign memory c = campaigns[_campaignId++];
        
        viewFunder(_campaignId, c.numFunders);
       /*if (c.beneficiary == 0) {
            throw;
        }*/
        
        /*c.funders[c.numFunders++] = Funder({
            addr: msg.sender 
            ,amount: msg.value 
        });*/
        c.amount += msg.value;
    }
    
   /* function checkGoalReached(uint _campaignId) public returns (bool reached_, uint goal_, uint amount_) {
        Campaign memory c = campaigns[_campaignId];
        goal_ = c.fundingGoal;
        amount_ = c.amount;
        if (c.amount < c.fundingGoal) {
            reached_ = false;
            return (reached_, goal_, amount_);
        }
        if (!c.beneficiary.send(c.amount)) { // send vs transfer
            c.beneficiary.transfer(c.amount);
        }
        reached_ = true;
        c.amount = 0;
    }*/
    
    function checkGoalReached(uint campaignID) public returns (bool reached) {
    Campaign memory c = campaigns[campaignID];
    if (c.amount < c.fundingGoal)
        return false;
    uint amount = c.amount;
    c.amount = 0;
    //c.beneficiary.transfer(amount);
    return true;
}
    
   /*function () {
        throw;
    }*/
}
