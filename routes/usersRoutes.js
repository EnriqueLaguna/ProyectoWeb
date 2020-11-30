'use strict';
const { log } = require('console');
const express = require('express');
const UsersController = require('../controllers/usersController');
const usersCtrl = new UsersController();
const router = express();
const jwt=require("jsonwebtoken");
const JwT="Foc@andaForTheWin";

router.post('/', (req, res) => {
    let b = req.body;
    if (b.nombre && b.apellidos && b.email && b.sexo && b.fecha) {
        usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email,(ok)=>{
            console.log(ok);
            if (ok) {
                res.status(400).send('user already exists');
            } else {
                usersCtrl.insertUser(b,(nu)=>{
                    res.status(201).send(nu);
                },(err)=>{
    
                });
            }
        });
    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/', async(req, res) => {
    let deco=jwt.verify(req.body.token,JwT);
    res.send(await usersCtrl.getUserById(deco));
});

router.put('/:email',(req,res)=>{
    if (req.params.email) {
        if(req.body.email){
            usersCtrl.updateUser(req.body);
            res.status(200).send();
            return;
        }
    } else {
        res.status(400).send('missing arguments');
    }
    res.status(401).send('error');
});

router.delete('/:email',async(req,res)=>{
    if (req.params.email) {
        let user=await usersCtrl.getUserById(jwt.verify(req.body.token,JwT));
        if(user) {
            usersCtrl.deleteUser(user);
            res.status(200).send({deleted:user});
        }else res.status(404).send("No");
    } else {
        res.status(400).send('missing arguments');
    }
});

module.exports = router;