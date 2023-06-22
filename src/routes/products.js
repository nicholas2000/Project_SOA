const express = require("express");
const router = express.Router();
const {getDB} = require("../configs/connection");
const { Op } = require("sequelize");
const DB = getDB();
const joi = require("joi");
const multer = require("multer");
const Product = require("../models/Products");

const multerDiskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const originalName = file.originalname;
        const nameArr = originalName.split('.');
        var extension = '';
        if (nameArr.length > 1) {
            extension = nameArr[nameArr.length - 1];
        }

        // picture-5858737388484.jpg
        cb(null, file.fieldname +'-'+ Date.now() +'.'+extension);
    }
});

const multerUpload = multer({storage: multerDiskStorage});
//add product
router.post("/", multerUpload.single('picture'), async (req,res) => {
    const schema = joi.object({
        product_name: joi.string().required(),
        supplier: joi.string().required(),
        qty: joi.number().min(1).required(),
        price: joi.number().min(100).required()
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    
    const picture = req.file;

    if (!picture) {
        res.status(400).json({'message': 'picture cannot be empty'});
        return
    }

    const { product_name, supplier, qty, price } = req.body;

    let listProducts = await Product.findAll();

    let id = "ITEM_" + String((listProducts.length)+1).padStart(4, "0");

    const insert = await Product.create(
        {
            id: id,
            product_name: product_name,
            qty: qty,
            supplier: supplier,
            price: price,
            gambar: String(picture.originalname)
        }
    )

    return res.status(201).send({
        message: "product has succesfully been inserted",
        id: id,
        product_name: product_name,
        supplier: supplier,
        price: "RP."+price,
        qty: qty,
        gambar: picture.originalname
    })
});

//delete product
router.delete("/:id", async (req,res) => {
    let { id } = req.params;

    if(!id || id == ""){
        return res.status(400).send({error:"parameters doesn't match criteria"});
    }
    else{
        try {
            const delProduct = await Product.destroy(
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
});

//update product
router.put("/:id", async (req,res) => {
    let { id } = req.params;

    if(!id || id == ""){
        return res.status(400).send({error:"id not specified"})
    }
    
    let cek = await Product.findByPk(id, {paranoid: false});

    if(!cek){
        return res.status(400).send({error:"id not found"});
    }

    let schema = joi.object({
        product_name: joi.string().required(),
        supplier: joi.string().required(),
        qty: joi.number().min(1).required(),
        price: joi.number().min(100).required()
    })

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    let { product_name, supplier, qty, price } = req.body;

    if(cek.deletedAt != null){
        let restore = await Product.restore(
            {
                where: {
                    id: id
                }
            }
        )
    }

    let update = await Product.update(
        {
            product_name: product_name,
            qty: qty,
            supplier: supplier,
            price: price
        },
        {
            where: {
                id: id
            }
        }
    )

    return res.status(201).send({
        message: "product has succesfully been updated",
        id: id,
        product_name: product_name,
        supplier: supplier,
        price: "RP."+price,
        qty: qty
    })
});

//tampilkan barang
router.get("/", multerUpload.single('picture'), async (req,res) => {
    let listProducts = await Product.findAll();

    let arrHasil = [];
    listProducts.forEach(p => {
        let temp = {
            id: p.id,
            product_name: p.product_name,
            supplier: p.supplier,
            price: "Rp. "+p.price,
            qty: p.qty,
            gambar: p.gambar
        };
        arrHasil.push(temp);
    });

    return res.status(201).send(arrHasil);
});

router.get("/:id", async (req,res) => {
    let {id} = req.params;

    if(id == "" || !id){
        return res.status(400).send({message:"parameters doesn't match criteria"});
    }

    //paranoid false supaya kalau cari barang yang sudah di hapus masih bisa di lihat tp statusnya tetap terhapus
    let p = await Product.findByPk(id, {paranoid: false});

    if(p.deletedAt != null){
        return res.status(201).send({
            id: p.id,
            product_name: p.product_name,
            supplier: p.supplier,
            price: "Rp. "+p.price,
            qty: p.qty,
            deletedAt: p.deletedAt
        });
    }
    else{
        return res.status(201).send({
            id: p.id,
            product_name: p.product_name,
            supplier: p.supplier,
            price: "Rp. "+p.price,
            qty: p.qty,
            gambar: p.gambar
        });
    }
});

module.exports = router;