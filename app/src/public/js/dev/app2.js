//var hw = document.getElementById('hw');
//hw.addEventListener('click', function(){
//    alert('Hello world');
//})

var nowAmount2;
var now = new Date();
var goal2;
var nowprogress2;

App2 = {
    web3Provider: null,
    contracts: {},

    init: function() {
      return App2.initWeb3();
    },

    initWeb3: function() {
      // TODO: refactor conditional
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App2.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
      } else {
        // Specify default instance if no web3 instance provided
        App2.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(App2.web3Provider);
      }
      return App2.initContract();

    },

  initContract: function() {
    $.getJSON("/contracts/Token2.json", function(data) {
      // Instantiate a new truffle contract from the artifact
      App2.contracts.Token = TruffleContract(data);
      // Connect provider to interact with contract
      App2.contracts.Token.setProvider(App2.web3Provider);

      return App2.render();
    });
  },

  render: function() {

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App2.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    $(document).ready(App2.startcontract);
    //$(document).on("click", ".btn-start", App2.startcontract);

  },

  startcontract: function(){
    return App2.initContract2();
  },

    initContract2: function() {
      $.getJSON("/contracts/newCrowdFund2.json", function(data) {
        // Instantiate a new truffle contract from the artifact
        App2.contracts.newCrowdFund = TruffleContract(data);
        // Connect provider to interact with contract
        App2.contracts.newCrowdFund.setProvider(App2.web3Provider);

        return App2.render2();
      });
    },

    render2: function() {

      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App2.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });


      //???????????? ?????? ????????????
      App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
        .then(function(instance) {
          fundingInstance = instance;
          return fundingInstance.amountRaised();

        }).then(function(amountRaised){ //?????? ??????????
          nowAmount2 = amountRaised;
          $('#fd_nowAmount2').html("" + amountRaised / 10**18);
          console.log("amountRaised2: "  + amountRaised);

          return fundingInstance.beneficiary();

        }).then(function(beneficiary){  //?????? ???????????? ??????
        //$('#fd_beneficiary').html(" " + beneficiary);
        console.log("beneiciary: "  + beneficiary);

          return fundingInstance.deadline();

        }).then(function(deadline){   //????????????

          function change_date(t) {
            var date2 = new Date(t*1000);
            var year = date2.getFullYear();
            var month = "0" + (date2.getMonth()+1);
            var day="0"+date2.getDate();
            var hour="0"+date2.getHours();
            var minute="0"+date2.getMinutes();
            var second = "0"+date2.getSeconds();
            return year+"??? "+month.substr(-2)+"??? "+day.substr(-2)+"??? "
            +hour.substr(-2)+"??? "+minute.substr(-2)+"??? "+second.substr(-2)+"???";
            }

            deadline = change_date(deadline);

          $('#fd_dline2').html("" + deadline);
          console.log("deadline: "  + deadline);

          return fundingInstance.fundingGoal();

        }).then(function(fundingGoal){   //????????????
          goal2 = fundingGoal;
          nowprogress2 = parseInt(nowAmount2/goal2*100); //?????? ????????? (???????????? ??????)
          console.log("nowprogress: "  + nowprogress2);
          $('#pgbar_2').attr("style", "width:"+nowprogress2+"%"); //???????????? ????????? ??????
          $('#pgnum_2').html("" + nowprogress2);
          $('#fd_goal2').html("" + fundingGoal / 10**18);
          console.log("fundingGoal: "  + fundingGoal);

          return fundingInstance.fundingGoalReached();

        }).then(function(fundingGoalReached){   //??????????????????
          //var test = amountRaised;
          //$('#fd_goalReached').html("" + fundingGoalReached);
          console.log("fundingGoalReached: "  + fundingGoalReached);

          return fundingInstance.price();

        }).then(function(price){  //????????????
          $('#fd_price2').html("" + price / 10**18 + " ether");
          console.log("price: "  + price);
        })
        .catch(function(err) {
          console.log(err.message);
        });//??????????????????????????????

    $(document).on("click", ".btn-token", App2.handleToken);
    $(document).on("click", ".btn-checkGoal", App2.checkGoal);
      $(document).on("click", ".btn-sendEther", App2.sendEther);

    $(document).on("click", ".btn-amountCheck", App2.amountCheck);
    $(document).on("click", ".btn-beneficiary", App2.beneficiaryCheck);
    $(document).on("click", ".btn-crowdsaleClosed", App2.colsedCheck);

    $(document).on("click", ".btn-deadline", App2.deadlineCheck);
    $(document).on("click", ".btn-fundingGoal", App2.fundingGoalCheck);
    $(document).on("click", ".btn-fundingGoalReached", App2.fundingGoalReachedCheck);
    $(document).on("click", ".btn-price", App2.priceCheck);

    },

    handleToken: function(event) {

      //?????? ????????? ?????????
      event.preventDefault();

      var address_to = $('#_address_to2').val(); // ?????????????????? ???????????? ??????
      console.log(address_to);
      var how_many = $('#_how_many2').val(); // ?????? ?????? ??????
      console.log(how_many);
      //parseInt

      var tokennInstance;

      //???????????? ????????? ????????????.

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        //?????? ????????? ????????????.
        var account = accounts[0]; /// ???????????????..


        App2.contracts.Token.deployed() /// ???????????????????????? ?????????...
          .then(function(instance) {
            tokenInstance = instance;

            return fundingInstance.amountRaised();

          }).then(function(amountRaised){ //?????? ?????????
            //var test = amountRaised;
            amountRaised = amountRaised + 1;
            console.log("amountRaised: "  + amountRaised);

            // ????????????, ?????? ??????, account??? ????????? adopt ????????? ????????????.
            return tokenInstance.transfer(address_to, how_many, { from: App2.account });


        })
          .catch(function(err) {
            console.log(err.message);
          });
      });
    },//handleToken???

    checkGoal: function(event) {
      //?????? ????????? ?????????
      event.preventDefault();
      var fundingInstance;
      //???????????? ????????? ????????????.
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        //?????? ????????? ????????????.
        var account = accounts[0]; /// ???????????????..

        App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
          .then(function(instance) {
            fundingInstance = instance;

            return fundingInstance.checkGoalReached({ from: App2.account });
          })
          .catch(function(err) {
            console.log(err.message);
          });
      });
    }, //checkGoal???

    sendEther: function(event) {
    event.preventDefault();
      var fundingInstance;
      //???????????? ????????? ????????????.
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        //?????? ????????? ????????????.
        var account = accounts[0]; /// ???????????????..

        App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
          .then(function(instance) {
            fundingInstance = instance;

            console.log(fundingInstance.amountRaised)

            return fundingInstance.safeWithdrawal({ from: App2.account });

          })
          .catch(function(err) {
            console.log(err.message);
          });
      });

    }, // sendEther???

    amountCheck: function(event) {
      event.preventDefault();
        var fundingInstance;
        //???????????? ????????? ????????????.
        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
          //?????? ????????? ????????????.
          var account = accounts[0]; /// ???????????????..

          App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

      },//amountCheck???


      beneficiaryCheck: function(event) {
        event.preventDefault();
          var fundingInstance;
          //???????????? ????????? ????????????.
          web3.eth.getAccounts(function(error, accounts) {
            if (error) {
              console.log(error);
            }
            //?????? ????????? ????????????.
            var account = accounts[0]; /// ???????????????..

            App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

      },//beneficiaryCheck ???

        colsedCheck: function(event) {
          event.preventDefault();
            var fundingInstance;
            //???????????? ????????? ????????????.
            web3.eth.getAccounts(function(error, accounts) {
              if (error) {
                console.log(error);
              }
              //?????? ????????? ????????????.
              var account = accounts[0]; /// ???????????????..

              App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

          },//colsedCheck ???

          deadlineCheck: function(event) {
            event.preventDefault();
              var fundingInstance;
              //???????????? ????????? ????????????.
              web3.eth.getAccounts(function(error, accounts) {
                if (error) {
                  console.log(error);
                }
                //?????? ????????? ????????????.
                var account = accounts[0]; /// ???????????????..

                App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

            }, //deadline ???

            fundingGoalCheck: function(event) {
              event.preventDefault();
                var fundingInstance;
                //???????????? ????????? ????????????.
                web3.eth.getAccounts(function(error, accounts) {
                  if (error) {
                    console.log(error);
                  }
                  //?????? ????????? ????????????.
                  var account = accounts[0]; /// ???????????????..

                  App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

              }, //fundingGoalCheck ???

              fundingGoalReachedCheck: function(event) {
                event.preventDefault();
                  var fundingInstance;
                  //???????????? ????????? ????????????.
                  web3.eth.getAccounts(function(error, accounts) {
                    if (error) {
                      console.log(error);
                    }
                    //?????? ????????? ????????????.
                    var account = accounts[0]; /// ???????????????..

                    App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

                }, //fundingGoalReachedCheck ???

                priceCheck: function(event) {
                  event.preventDefault();
                    var fundingInstance;
                    //???????????? ????????? ????????????.
                    web3.eth.getAccounts(function(error, accounts) {
                      if (error) {
                        console.log(error);
                      }
                      //?????? ????????? ????????????.
                      var account = accounts[0]; /// ???????????????..

                      App2.contracts.newCrowdFund.deployed() /// ???????????????????????? ?????????...
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

                  } //price ???

  }; //App2?????????
