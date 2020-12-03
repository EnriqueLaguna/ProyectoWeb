'use strict';
const { log } = require('console');
const express = require('express');
const UsersController = require('../controllers/usersController');
const usersCtrl = new UsersController();
const router = express();
const jwt=require("jsonwebtoken");
const JwT="Foc@andaForTheWin";

router.post('/', async (req, res) => {
    let b = req.body;
    let user=await usersCtrl.getUserByEmail(b.email);
    if(user){
        res.status(400).send("User already exists");
    }else{
        console.log("post");
        console.log(b);
        usersCtrl.createUser(b);
        res.status(200).send();
    }
});

router.get('/', async(req, res) => {
    let deco=jwt.verify(req.body.token,JwT);
    let user=await usersCtrl.getUserById(deco);
    if(user)
        res.status(200).send(user);
    else
        res.status(404).send("Not found");
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