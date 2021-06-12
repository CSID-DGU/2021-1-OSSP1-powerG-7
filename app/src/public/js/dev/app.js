//var hw = document.getElementById('hw');
//hw.addEventListener('click', function(){
//    alert('Hello world');
//})

var nowAmount;
var now = new Date();
var goal;
var nowprogress;

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
    $.getJSON("/contracts/Token.json", function(data) {
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
    $(document).ready(App.startcontract);
    //$(document).on("click", ".btn-start", App.startcontract);

  },

  startcontract: function(){
    return App.initContract2();
  },

    initContract2: function() {
      $.getJSON("/contracts/newCrowdFund.json", function(data) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.newCrowdFund = TruffleContract(data);
        // Connect provider to interact with contract
        App.contracts.newCrowdFund.setProvider(App.web3Provider);

        return App.render2();
      });
    },

    render2: function() {

      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });


      //컨트랙트 정보 받아오기
      App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
        .then(function(instance) {
          fundingInstance = instance;
          return fundingInstance.amountRaised();

        }).then(function(amountRaised){ //현채 참여수?
          nowAmount = amountRaised;
          $('#fd_nowAmount').html("" + amountRaised / 10**18);
          console.log("amountRaised: "  + amountRaised);

          return fundingInstance.beneficiary();

        }).then(function(beneficiary){  //펀딩 컨트랙트 주소
        //$('#fd_beneficiary').html(" " + beneficiary);
        console.log("beneiciary: "  + beneficiary);

          return fundingInstance.deadline();

        }).then(function(deadline){   //마감기한
          
          function change_date(t) {
            var date2 = new Date(t*1000);
            var year = date2.getFullYear();
            var month = "0" + (date2.getMonth()+1);
            var day="0"+date2.getDate();
            var hour="0"+date2.getHours();
            var minute="0"+date2.getMinutes();
            var second = "0"+date2.getSeconds();
            return year+"년 "+month.substr(-2)+"월 "+day.substr(-2)+"일 "
            +hour.substr(-2)+"시 "+minute.substr(-2)+"분 "+second.substr(-2)+"초";
            }

            deadline = change_date(deadline);
          
          $('#fd_dline').html("" + deadline);
          console.log("deadline: "  + deadline);

          return fundingInstance.fundingGoal();

        }).then(function(fundingGoal){   //목표금액
          goal = fundingGoal;
          nowprogress = parseInt(nowAmount/goal*100); //펀딩 진행률 (소수점은 날림)
          console.log("nowprogress: "  + nowprogress);
          $('#pgbar_1').attr("style", "width:"+nowprogress+"%"); //게이지바 진행률 변경
          $('#pgnum_1').html("" + nowprogress);
          $('#fd_goal').html("" + fundingGoal / 10**18);
          console.log("fundingGoal: "  + fundingGoal);

          return fundingInstance.fundingGoalReached();

        }).then(function(fundingGoalReached){   //목표달성여부
          //var test = amountRaised;
          if(fundingGoalReached) $('#fd_goalReached').html("펀딩 달성!");
		  else $('#fd_goalReached').html("펀딩 진행중...");
          console.log("fundingGoalReached: "  + fundingGoalReached);

          return fundingInstance.price();

        }).then(function(price){  //펀딩금액
          //var test = amountRaised;
          $('#fd_price').html("" + price / 10**18 + " ether");
          console.log("price: "  + price);
        })
        .catch(function(err) {
          console.log(err.message);
        });//컨트랙트정보받아오기

    $(document).on("click", ".btn-token", App.handleToken);
    $(document).on("click", ".btn-checkGoal", App.checkGoal);
      $(document).on("click", ".btn-sendEther", App.sendEther);

    $(document).on("click", ".btn-amountCheck", App.amountCheck);
    $(document).on("click", ".btn-beneficiary", App.beneficiaryCheck);
    $(document).on("click", ".btn-crowdsaleClosed", App.colsedCheck);

    $(document).on("click", ".btn-deadline", App.deadlineCheck);
    $(document).on("click", ".btn-fundingGoal", App.fundingGoalCheck);
    $(document).on("click", ".btn-fundingGoalReached", App.fundingGoalReachedCheck);
    $(document).on("click", ".btn-price", App.priceCheck);

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

            return fundingInstance.amountRaised();

          }).then(function(amountRaised){ //현채 참여수
            //var test = amountRaised;
            amountRaised = amountRaised + 1;
            console.log("amountRaised: "  + amountRaised);

            // 펀딩주소, 토큰 개수, account를 넣어서 adopt 함수를 실행한다.
            return tokenInstance.transfer(address_to, how_many, { from: App.account });


        })
          .catch(function(err) {
            console.log(err.message);
          });
      });
    },//handleToken끝

    checkGoal: function(event) {
      //기본 이벤트 블럭함
      event.preventDefault();
      var fundingInstance;
      //지갑상에 주소를 가져온다.
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        //처음 주소를 가져온다.
        var account = accounts[0]; /// 내계좌주소..

        App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
          .then(function(instance) {
            fundingInstance = instance;

            return fundingInstance.checkGoalReached({ from: App.account });
          })
          .catch(function(err) {
            console.log(err.message);
          });
      });
    }, //checkGoal끝

    sendEther: function(event) {
    event.preventDefault();
      var fundingInstance;
      //지갑상에 주소를 가져온다.
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        //처음 주소를 가져온다.
        var account = accounts[0]; /// 내계좌주소..

        App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
          .then(function(instance) {
            fundingInstance = instance;

            console.log(fundingInstance.amountRaised)

            return fundingInstance.safeWithdrawal({ from: App.account });

          })
          .catch(function(err) {
            console.log(err.message);
          });
      });

    }, // sendEther끝

    amountCheck: function(event) {
      event.preventDefault();
        var fundingInstance;
        //지갑상에 주소를 가져온다.
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
          //처음 주소를 가져온다.
          var account = accounts[0]; /// 내계좌주소..

          App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
            .then(function(instance) {
              fundingInstance = instance;
              return fundingInstance.amountRaised();

            }).then(function(amountRaised){
              //var test = amountRaised;
              document.getElementById("amountRaised").value=amountRaised;
              console.log("amount: "  + amountRaised);
            })
            .catch(function(err) {
              console.log(err.message);
            });
        });

      },//amountCheck끝


      beneficiaryCheck: function(event) {
        event.preventDefault();
          var fundingInstance;
          //지갑상에 주소를 가져온다.
          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
            //처음 주소를 가져온다.
            var account = accounts[0]; /// 내계좌주소..

            App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
              .then(function(instance) {
                fundingInstance = instance;
                return fundingInstance.beneficiary();

              }).then(function(beneficiary){
                //var test = amountRaised;
                document.getElementById("beneficiary").value=beneficiary;
                console.log("beneficiary: "  + beneficiary);
              })
              .catch(function(err) {
                console.log(err.message);
              });
          });

      },//beneficiaryCheck 끝

        colsedCheck: function(event) {
          event.preventDefault();
            var fundingInstance;
            //지갑상에 주소를 가져온다.
            web3.eth.getAccounts(function(error, accounts) {
              if (error) {
                console.log(error);
              }
              //처음 주소를 가져온다.
              var account = accounts[0]; /// 내계좌주소..

              App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
                .then(function(instance) {
                  fundingInstance = instance;
                  return fundingInstance.crowdsaleClosed();

                }).then(function(crowdsaleClosed){
                  //var test = amountRaised;
                  document.getElementById("crowdsaleClosed").value=crowdsaleClosed;
                  console.log("crowdsaleClosed: "  + crowdsaleClosed);
                })
                .catch(function(err) {
                  console.log(err.message);
                });
            });

          },//colsedCheck 끝

          deadlineCheck: function(event) {
            event.preventDefault();
              var fundingInstance;
              //지갑상에 주소를 가져온다.
              web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                  console.log(error);
                }
                //처음 주소를 가져온다.
                var account = accounts[0]; /// 내계좌주소..

                App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
                  .then(function(instance) {
                    fundingInstance = instance;
                    return fundingInstance.deadline();

                  }).then(function(deadline){
                    //var test = amountRaised;
                    document.getElementById("deadline").value=deadline;
                    console.log("deadline: "  + deadline);
                  })
                  .catch(function(err) {
                    console.log(err.message);
                  });
              });

            }, //deadline 끝

            fundingGoalCheck: function(event) {
              event.preventDefault();
                var fundingInstance;
                //지갑상에 주소를 가져온다.
                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                  //처음 주소를 가져온다.
                  var account = accounts[0]; /// 내계좌주소..

                  App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
                    .then(function(instance) {
                      fundingInstance = instance;
                      return fundingInstance.fundingGoal();

                    }).then(function(fundingGoal){
                      //var test = amountRaised;
                      document.getElementById("fundingGoal").value=fundingGoal;
                      console.log("fundingGoal: "  + fundingGoal);
                    })
                    .catch(function(err) {
                      console.log(err.message);
                    });
                });

              }, //fundingGoalCheck 끝

              fundingGoalReachedCheck: function(event) {
                event.preventDefault();
                  var fundingInstance;
                  //지갑상에 주소를 가져온다.
                  web3.eth.getAccounts(function(error, accounts) {
                    if (error) {
                      console.log(error);
                    }
                    //처음 주소를 가져온다.
                    var account = accounts[0]; /// 내계좌주소..

                    App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
                      .then(function(instance) {
                        fundingInstance = instance;
                        return fundingInstance.fundingGoalReached();

                      }).then(function(fundingGoalReached){
                        //var test = amountRaised;
                        document.getElementById("fundingGoalReached").value=fundingGoalReached;
                        console.log("fundingGoalReached: "  + fundingGoalReached);
                      })
                      .catch(function(err) {
                        console.log(err.message);
                      });
                  });

                }, //fundingGoalReachedCheck 끝

                priceCheck: function(event) {
                  event.preventDefault();
                    var fundingInstance;
                    //지갑상에 주소를 가져온다.
                    web3.eth.getAccounts(function(error, accounts) {
                      if (error) {
                        console.log(error);
                      }
                      //처음 주소를 가져온다.
                      var account = accounts[0]; /// 내계좌주소..

                      App.contracts.newCrowdFund.deployed() /// 계약주소인거같음 아마도...
                        .then(function(instance) {
                          fundingInstance = instance;
                          return fundingInstance.price();

                        }).then(function(price){
                          //var test = amountRaised;
                          document.getElementById("price").value=price;
                          console.log("price: "  + price);
                        })
                        .catch(function(err) {
                          console.log(err.message);
                        });
                    });

                  } //price 끝

  }; //App닫는거
