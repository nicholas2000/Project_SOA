const express = require("express");
const router = express.Router();
const {getDB} = require("../configs/connection");
const { Op } = require("sequelize");
const DB = getDB();
const joi = require("joi");
const cart = require("../models/Carts");
const Product = require("../models/Products");
const Customer = require("../models/Customer");

// add product ke dalam cart (bila input produk yg sama akan ditambahkan)
router.post("/", async (req,res) => {
    const schema = joi.object({
        product_name: joi.string().required(),
        customer: joi.string().required(),
        qty: joi.number().min(1).required(),
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    const { product_name, customer, qty } = req.body;

    let listCarts = await cart.findAll();
    
    let id = "CART_" + String((listCarts.length)+1).padStart(4, "0");


    let check = await cart.findAll({ where: { customer: customer , product_name: product_name} });
    let temp = await Product.findOne({ where: { product_name: product_name}})
    if(check.length < 1){
        
        const insert = await cart.create(
            {
                id: id,
                product_name: product_name,
                qty: qty,
                customer: customer,
                price: temp.price
            }
        )
        return res.status(201).send({
            message: "product has been succesfully added to cart",
            product_name: product_name,
            qty: qty,
            customer: customer,
            price: temp.price
        })
    }else{
        let count = Number.parseInt(check[0].qty) + Number.parseInt(qty);
        let update = await cart.update(
            {
                qty: count,
            },
            {
                where: {
                    id: check[0].id
                }
            }
        )
        return res.status(201).send({
            message: "product has been succesfully added to cart",
            product_name: product_name,
            qty: count,
            customer: customer,
            price: temp.price
        })
    }
});

//tampilkan isi cart(berdasarkan username customer)
router.get("/id", async (req,res) => {
    const schema = joi.object({
        customer: joi.string().required(),
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    const customer = req.body.customer;

    let check = await cart.findAll({where: {customer: customer}});

    if(check === null){
        return res.status(400).send({
            'message': `Tidak ada cart dengan username ${customer}`
        })
    }else{
        return res.status(200).send({
            body: check
        })
    }
});

//Update cart
router.put("/product/id", async (req,res) => {
    const schema = joi.object({
        product_name: joi.string().required(),
        customer: joi.string().required(),
        qty: joi.number().min(1).required(),
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    const { product_name, customer, qty } = req.body;

    let check = await cart.findAll({ where: { customer: customer , product_name: product_name} });

    if(check.length < 1){
        return res.status(400).send({
            'message': "Tidak ada cart dengan username dan product yang diinputkan"
        })
    }else{
        
        let update = await cart.update(
            {
                qty: qty,
            },
            {
                where: {
                    id: check[0].id
                }
            }
        )
        return res.status(200).send({
            message: "product has succesfully been updated",
            product_name: product_name,
            qty: qty,
            customer: customer,
            price: check[0].price
        })
    }
});

//delete cart(kalau cuma field customer yg diisi, akan menghapus semua item cart milik customer tersebut)
router.delete("/product/id", async (req,res) => {
    const schema = joi.object({
        product_name: joi.string().allow(""),
        customer: joi.string().required(),
        
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    const { product_name, customer } = req.body;

    if(product_name == ""){
        try {
            const del = await cart.destroy(
            {
                where: {
                    customer: customer
                }
            }
            );
        } catch (error) {
            return res.status(400).send({
                message: "Delete Failed",
                error,
              });
        }
        return res.status(200).send(
            {
                message: `cart belonging to customer ${customer} has been succesfully removed`
            }
        )
    }

    let check = await cart.findAll({ where: { customer: customer , product_name: product_name} });
    

    if(check.length < 1){
        return res.status(400).send({
            'message': "Tidak ada cart dengan username dan product yang diinputkan"
        })
    }else{
        try {
            const del = await cart.destroy(
            {
                where: {
                    id: check[0].id
                }
            }
            );
        } catch (error) {
            return res.status(400).send({
                message: "Delete Failed",
                error,
              });
        }
        return res.status(200).send(
            {
                message: `cart with the id ${check[0].id} has been succesfully removed`
            }
        )
        
    }
});

module.exports = router;