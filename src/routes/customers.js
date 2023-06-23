const { response } = require("express");
const express = require("express");
const { Op } = require("sequelize");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const router = express.Router();
const Sequelize = require('sequelize');
const {getDB}       = require("../configs/connection");
const sequelize     = getDB();

const JWT_KEY = 'Projek_SOA'

const checkUsernameUnique = async (username) => {
    let customers = Customer.findAll();
    if(customers.count != 0){
        let ada = 0;
        customers.forEach(c => {
            if(c.username == username){
                ada = 1
            }
        });

        if(ada == 1){
            throw new error("username must be unique");
        }
    }
};

//customer login & generate token
router.post("/login", async (req,res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    const {username, password} = req.body;

    var [cek] = await sequelize.query(`select * from customers where username = '${username}' and password = '${password}' AND status = "Berhasil Verifikasi"`); 
    
    if(cek.length < 1){
        return res.status(400).send({
            message: "Username Belom Verifikasi / Username Password Salah",
        });
    }else{
        let token = jwt.sign({
            username: username,
            saldo: cek[0].saldo
        }, JWT_KEY, {expiresIn: '3600s'})
        return res.status(200).send({
            'message': 'Successfully logged in',
            username: username,
            token: token
        })
    }
});

//customer Register
router.post("/", async (req,res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        nama: Joi.string().required(),
        email: Joi.string().email().required()
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    var [cek] = await sequelize.query(`select * from customers where username = '${req.body.username}'`);
    if(cek.length != 0){
        return res.status(400).send({
            message: "Username Sudah ada",
        });
    }
    else{
        Customer.create({
            username: req.body.username,
            nama: req.body.nama,
            password: req.body.password,
            email: req.body.email,
            saldo: 0,
            status: "Belom Terverifikasi"
        }).then((data) => {
            res.json({
                username: req.body.username,
                nama: req.body.nama,
                password: req.body.password,
                email: req.body.email,
                saldo: "Rp. 0",
                status: "Belom Terverifikasi"
            });
        })
    }

});

//Get Customer
router.get("/:username", async (req, res) => {
    if(req.params.username==":username"){
     await Customer.findAll(
     ).then((sementara) => {
         res.json(sementara);
     })
    }
    else{
     await Customer.findAll({
         where: {
             username: {
                 [Sequelize.Op.eq]: req.params.username
             }
         }
     }).then((sementara) => {
         if(sementara.length == 0) {
             return res.status(400).send({
                 message: "Username Tidak Ada",
             });
         }
         else {
             res.json(sementara[0]);
         }
     })
    }
 });
//Delete Customer
router.delete("/", async (req, res) => {
    var [cek] = await sequelize.query(`select * from customers where username = '${req.body.username}'`);
    const schema = Joi.object({
        username: Joi.string().required(),
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    console.log(cek);
    if(cek.length == 0) {
        return res.status(400).send({
            message: "User Tidak Ada",
        });
    }
    else {
        await sequelize.query(`delete from customers where username = '${req.body.username}'`);
        return res.status(200).send({
            message: "User berhasil dihapus",
        });
    }
});
//Update Customer
router.put("/", async (req,res) => {
    var [cek2] = await sequelize.query(`select * from customers where username = '${req.body.username}'`);
    var [cek1] = await sequelize.query(`select * from customers where username = '${req.body.username}'AND password ='${req.body.password}'`);
    let status = "Berhasil Verifikasi";
    console.log(cek1);
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    if(cek1.length == 0) {
        return res.status(400).send({
            message: "Customer Tidak Ada",
        }); 
    }
    if(cek1.length != 0) {
        await sequelize.query('update customers set status = "Berhasil Verifikasi" where username = $username',
        {
            bind: req.body,
            type: sequelize.QueryTypes.UPDATE
            
        });
        return  res.status(200).send({
            'Username': cek2[0].username, 
            'Nama': cek2[0].nama, 
            'Password': cek2[0].password, 
            'Saldo': cek2[0].saldo, 
            'Email':"Rp "+cek2[0].email, 
            'status':status,
            
        });
    }
  
 })
 //TopUp Saldo
 router.put("/saldo/Tambah", async (req,res) => {
    var [cek1] = await sequelize.query(`select * from customers where username = '${req.body.username}'AND password ='${req.body.password}'`);
    var [cek2] = await sequelize.query(`select * from customers where username = '${req.body.username}'AND password ='${req.body.password}'AND status ='Berhasil Verifikasi'`);
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        nominal: Joi.number().min(10000).required()
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    if(cek1.length==0 ) {
        return res.status(400).send({
            message: "User Tidak ada",
        });    
     }
    else if(parseInt(req.body.nominal) < 10000){
        return res.status(400).send({
            message: "Nominal Minimal Rp.10.000",
        });    
    }
    else if(cek2.length==0){
        return res.status(400).send({
            message: "User Belom Verifikasi",
        });   
    }
    else {
        await Customer.findAll({
            where: {
                username: {
                    [Sequelize.Op.eq]: req.body.username
                }
            }
        }).then((sementara) => {
            if(sementara.length == 0) {
                return res.status(400).send({
                    message: "User tidak ditemukan",
                });
            }
            else {
                Customer.update({saldo: sementara[0].saldo + parseInt(req.body.nominal)}, {
                    where: {
                        username: req.body.username
                    }
                }).then(() => {                    
                    return res.status(201).send({
                        message: "Berhasil Menambah Saldo " + sementara[0].nama + " Sebanyak Rp. " + req.body.nominal.toString(),
                    });                
                });    
            }
        })
        
    }

});
//Cek Saldo
router.get("/saldo/Cek", async (req, res) => {
    var [cek1] = await sequelize.query(`select * from customers where username = '${req.body.username}'AND password ='${req.body.password}'`);
    var [cek2] = await sequelize.query(`select * from customers where username = '${req.body.username}'AND password ='${req.body.password}'AND status ='Berhasil Verifikasi'`);
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }
    if(cek1.length==0 ) {
        return res.status(400).send({
            message: "User Tidak ada",
        });    
     }
     else if(cek2.length==0){
        return res.status(400).send({
            message: "User Belom Verifikasi",
        });   
    }
    else{
        await Customer.findAll({
            where: {
                username: {
                    [Sequelize.Op.eq]: req.body.username
                }
            }
        }).then((sementara) => {
            if(sementara.length == 0) {
                return res.status(400).send({
                    message: "User tidak ditemukan",
                });
            }
            else {
                return res.status(201).send({
                    message: "Saldo Akun " + sementara[0].nama + " Sebanyak Rp. " + sementara[0].saldo,
                });        
            }
        })
    }
 });

module.exports = router;