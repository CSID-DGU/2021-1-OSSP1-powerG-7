"use strict";

const User = require("../../models/User");

const output = {
    home: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/",{
                is_logined : true
            });
        }else{
            res.render("home/",{
                is_logined : false
            });
        }
    },
    login: (req, res) => {
        res.render("home/login");
    },
    register: (req, res) => {
        res.render("home/register");
    },
    FAQ: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/FAQ",{
                is_logined : true
            });
        }else{
            res.render("home/FAQ",{
                is_logined : false
            });
        }
    },
    logout: (req, res) => {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    },
    overview: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/overview",{
                is_logined : true
            });
        }else{
            res.render("home/overview",{
                is_logined : false
            });
        }
    },
	dev: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/dev",{
                is_logined : true
            });
        }else{
            res.render("home/dev",{
                is_logined : false
            });
        }
    },
    shop1: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/shop/1",{
                is_logined : true
            });
        }else{
            res.render("home/shop/1",{
                is_logined : false
            });
        }
    },
    shop2: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/shop/2",{
                is_logined : true
            });
        }else{
            res.render("home/shop/2",{
                is_logined : false
            });
        }
    },
    shop3: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/shop/3",{
                is_logined : true
            });
        }else{
            res.render("home/shop/3",{
                is_logined : false
            });
        }
    },
    shop4: (req, res) => {
        if(req.session.is_logined == true){
            res.render("home/shop/4",{
                is_logined : true
            });
        }else{
            res.render("home/shop/4",{
                is_logined : false
            });
        }
    }
};

const process = {
    login: async (req, res) => {
      const user = new User(req.body);
      const response = await user.login();

      if (response.success == true) req.session.is_logined = true;
      else req.session.is_logined = false;

      return res.json(response);
    },
    register: async (req, res) => {
      const user = new User(req.body);
      const response = await user.register();
      return res.json(response);
    }
};

module.exports = {
    output,
    process,
};