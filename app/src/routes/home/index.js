"use strict";

const express = require("express");
const app = require("../../../app");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/FAQ", ctrl.output.FAQ);
router.get("/logout", ctrl.output.logout);
router.get("/overview", ctrl.output.overview);
router.get("/dev", ctrl.output.dev);
router.get("/mypage", ctrl.output.mypage);
router.get("/shop/1", ctrl.output.shop1);
router.get("/shop/2", ctrl.output.shop2);
router.get("/shop/3", ctrl.output.shop3);
router.get("/shop/4", ctrl.output.shop4);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);

module.exports = router;