App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Token.json", function(data) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Token = TruffleContract(data);
      // Connect provider to interact with contract
      App.contracts.Token.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    $(document).on("click", ".btn-token", App.handleToken);
  },

  handleToken: function(event) {
    
    //기본 이벤트 블럭함
    event.preventDefault();

    var address_to = $('#_address_to').val(); // 크라우드펀딩 컨트랙트 주소
    console.log(address_to);
    var how_many = $('#_how_many').val(); // 보낼 토큰 개수
    console.log(how_many);
    //parseInt

    var tokennInstance;
    
    //지갑상에 주소를 가져온다. 
    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      //처음 주소를 가져온다. 
      var account = accounts[0]; /// 내계좌주소..
     
      
      App.contracts.Token.deployed() /// 계약주소인거같음 아마도...
        .then(function(instance) {
          tokenInstance = instance;
          
          // 펀딩주소, 토큰 개수, account를 넣어서 adopt 함수를 실행한다. 
          return tokenInstance.transfer(address_to, how_many, { from: App.account });
        })
       
        .catch(function(err) {
          console.log(err.message);
        });
    });
  }//handleToken끝
 
}; //App닫는거

$(function() {
  $(window).load(function() {
    App.init();
  });
});