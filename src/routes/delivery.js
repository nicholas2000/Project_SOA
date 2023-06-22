const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Delivery = require("../models/Delivery");
const router = express.Router();
const Sequelize = require('sequelize');
const {getDB}       = require("../configs/connection");
const sequelize     = getDB();

const JWT_KEY = 'Projek_SOA'

router.post("/api/delivery/ongkir", async (req,res) => {
    let {origin, destination, weight, courier} = req.body;
    var request = require("request");

    var options = {
    method: 'POST',
    url: 'https://api.rajaongkir.com/starter/cost',
    headers: {key: 'x-api-key', 'content-type': 'application/x-www-form-urlencoded'},
    form: {origin: `${origin}`, destination: `${destination}`, weight: `${weight}`, courier: `${courier}`}
    };

    request(options, function (error, response, body) {
    if (error) throw new Error(error);

    
    console.log(body);
    });
});


router.post("api/delivery/pay", async (req,res) =>{

    
});


module.exports = router;