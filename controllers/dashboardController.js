const conn = require('../connection/connectdb');
const queryExecuter = require('../queryExecute/queryExecuter')
const express = require('express')
const app = express();
const asyncHandler = require("express-async-handler");

const getDashboard = asyncHandler(async (req, res) => {
    //i need to show the get request for register page
    let flag = false
    res.render('dashboard',{flag})
});
const tweetit = asyncHandler(async (req, res) => {
    //i need to show the get request for tweet page
    let flag = false
    res.render('tweet',{flag})
});



module.exports = { getDashboard,tweetit }