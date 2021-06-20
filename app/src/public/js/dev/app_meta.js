App_meta = {
    web3Provider: null,
    contracts: {},

    init_meta: function() {
      if (typeof window.ethereum !== 'undefined') {
        App_meta.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
        console.log('MetaMask is installed!');
      }

     return App_meta.start();
    },

start : function() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
const sendEthButton = document.querySelector('.sendEthButton');

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }
  //처음 주소를 가져온다.
  var account = accounts[0]; /// 내계좌주소..
//$('#_address_to')
    
getAccount_mypage();//마이페이지 지갑 주소 출력
async function getAccount_mypage() {
const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
const account = accounts[0];
$("#meta_account").html("" + account);
}
    
//Sending Ethereum to an address
sendEthButton.addEventListener('click', () => {
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: account,
          to: $('#eth_address_to').val(),
          value: (10**18 * parseInt($('#eth_how_many').val())).toString(16) , // 16진수
         // gasPrice: '0x09184e72a000',
          //gas: '0x2710',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
});

})

const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', () => {
   getAccount();
});

async function getAccount() {
const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
const account = accounts[0];
showAccount.innerHTML = account;
}

}

}; //App닫는거
