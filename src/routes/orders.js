const express = require("express");
const router = express.Router();
const Joi = require("joi");
const cart = require("../models/Carts");
const Product = require("../models/Products");
const Customer = require("../models/Customer");
const Carts = require("../models/Carts");
const Orders = require("../models/Orders");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const {getDB}       = require("../configs/connection");
const sequelize     = getDB();

const JWT_KEY = 'Projek_SOA'

//GET ID DELIVERY
router.get("/:delivery_id", async (req,res) => {
    var [cek2] = await sequelize.query(`select * from orders where customer = '${req.body.username}' and id = '${req.params.delivery_id}'`);
   const schema = 
        Joi.object({
            username: req.body.username
        });
    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        return res.status(400).send(error.toString());
    }
    
    if (!req.header("x-auth-token")) {
        return res.status(400).send({ "message": "unathorized" });
    }
    else{
        userlogin = jwt.verify(req.header("x-auth-token"), JWT_KEY);
        console.log(userlogin.username);
        if(cek2.length > 0){
            res.status(200).send({
                "Id_Pengiriman": cek2[0].id,
                "Nama Barang": cek2[0].product_name,
                "Qty": cek2[0].qty,
                "Customer": cek2[0].customer,
                "Price": cek2[0].price,
            });
        }
        else{
            return res.status(400).send({
                'message': "Tidak Ada Pesanan dengan nama "+ req.body.username +' dan ID '+req.params.delivery_id
            })
        }
         

        }
    
});


//GET SELURUH ID
router.get("/", async (req, res) => {
    let listProducts = await Orders.findAll();

    let arrHasil = [];
    listProducts.forEach(p => {
        let temp = {
            "Id_Pengiriman": p.id,
            "Nama Barang": p.product_name,
            "Qty": p.qty,
            "Customer": p.customer,
            "Price": p.price,
        };
        arrHasil.push(temp);
    });

    return res.status(201).send(arrHasil);
 });

 //DELETE ID
 router.delete("/:id", async (req,res) => {
    var [cek2] = await sequelize.query(`select * from orders where customer = '${req.body.username}' and id = '${req.params.delivery_id}'`);
    let { id } = req.params;

    if(!id || id == ""){
        return res.status(400).send({error:"parameters doesn't match criteria"});
    }
    if(req.body.username==""){
        return res.status(400).send({error:"Tidak Boleh Kosong"});
    }
    else{
        if(cek2){
            try {
                const delProduct = await Orders.destroy(
                    {
                        where: {
                            id: id
                        }
                    }
                )
            } catch (error) {
                return res.status(400).send({
                    message: "Delete Failed",
                    error,
                  });
            }
    
            return res.status(201).send(
                {
                    message: `product with the id ${id} has succesfully been removed`
                }
            )
        }
        else{
            return res.status(400).send({error:"Data Tidak Ada"});
        }
    }
});

module.exports = router;