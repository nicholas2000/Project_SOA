const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Delivery = require("../models/Delivery");
const Customer = require("../models/Customer");
const Carts = require("../models/Carts");
const router = express.Router();
const Sequelize = require('sequelize');
const {getDB}       = require("../configs/connection");
const sequelize     = getDB();
const Mailjet = require('node-mailjet')

const JWT_KEY = 'Projek_SOA'


//CEK ONGKIR
router.post("/ongkir", async (req,res) => {
    let {id_carts, origin, destination, weight, courier} = req.body;
    let temp = "";

    let querySearch1 = `https://api.rajaongkir.com/starter/city?key=ace044538d66a9d98d7d23ec1a2aaa65`
    let getdata1 = await axios.get(querySearch1);
    let hasil1 = getdata1.data.rajaongkir.results;
    let {id_origin, id_destination} = ""; 
    hasil1.forEach(e => {
        if(origin == e.city_name){
            id_origin = e.city_id; 
        }
        if(destination == e.city_name){
            id_destination = e.city_id;
        }
    });

    const hasil = await axios.post("https://api.rajaongkir.com/starter/cost",
            {
                origin: id_origin, 
                destination: id_destination, 
                weight: weight,  
                courier: courier, 
            },
            {
                headers: {
                    key: "ace044538d66a9d98d7d23ec1a2aaa65"
                }
            }
        );
    
    let hasil2 = hasil.data.rajaongkir.results
    let ongkir = "";
    hasil2.forEach(e => {
        ongkir = e.costs[0].cost[0].value;
    });
    
    let listDelivery = await Delivery.findAll();

    let id = "DLVR_" + String((listDelivery.length)+1).padStart(4, "0");
    let findCarts = await Carts.findOne({ where: { id: id_carts}})
    temp = findCarts.customer;

    const insert = await Delivery.create(
        {
            id_pengiriman: id,
            id_carts: id_carts,
            customer: temp,
            price: ongkir
        }
    )
    return res.status(201).send({
        
        message: "Delivery has been succesfully processed",
        id_pengiriman: id,
        id_carts: id_carts,
        customer: temp,
        price: ongkir
    })
    //console.log(temp)
});

//PEMBAYARAN
router.post("/pay", async (req,res) =>{
    //return res.status(200).send({"message": "Halo" })
    let{id_pengiriman} = req.body;
    let {temp, temp2, temp3, temp4, saldo} = "";
    let findDelivery = await Delivery.findAll({ where: { id_pengiriman: {[Op.eq]: id_pengiriman}}});
    findDelivery.forEach(e => {
        temp = e.customer;
        temp2 = e.id_carts;
        temp3 = e.price;
    });
    if(findDelivery.length > 0){
        //return res.status(404).send({"message" : "Delivery Success"})
        // const Mailjet = require('node-mailjet')

        let findCustomer = await Customer.findAll({where: { username: {[Op.eq]: temp}}});
        findCustomer.forEach(e => {
            saldo = e.saldo
        });
        let findCarts = await Carts.findAll({where: { id: {[Op.eq]: temp2}}});
        findCarts.forEach(e => {
            temp4 = e.price
        });
        let total = parseInt(temp4)+parseInt(temp3);
        

        if(parseInt(saldo) >= total ){
            const mailjet = Mailjet.apiConnect( 
                "ebd48127bff9308b498db7eb939de91b",
                "4c257df09df710d06bb0681d81b38141",
                {
                    config: {},
                    options: {}
                }
            )
    
            const request = mailjet
                    .post("send", { 'version': 'v3.1' })
                    .request({
                        "Messages": [
                            {
                                "From": {
                                    "Email": "sughapur@gmail.com",
                                    "Name": "Pembayaran"
                                },
                                "To": [
                                    {
                                        "Email": "sughapur@gmail.com",
                                        "Name": "Pembayaran"
                                    }
                                ],
                                "Subject": "Confirmation Purchase",
                                "TextPart": "Click link below to Purchasing",
                                "HTMLPart": "<h3>Thankyou </h3><br />",
                                "CustomID": "AppGettingStartedTest"
                            }
                        ]
                    })
                request
                .then((result) => {
                    console.log(result.body)
                })
                .catch((err) => {
                    console.log(err.statusCode)
                })
            return res.status(201).send({"message" : "Payment Successfully"})
        
        }else{
            return res.status(201).send({"message" : "Money Not Enough"}) 

        }
    }
    else{
        return res.status(404).send({"message" : "Delivery not found"})
    }
});


module.exports = router;