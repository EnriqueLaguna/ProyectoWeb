'use strict';
const { log } = require('console');
const express = require('express');
const ItemsController = require('../controllers/itemsControllers');
const itemsCtrl = new ItemsController();
const router = express();

router.post('/', async (req, res) => {
    let b = req.body;
    let item=await itemsCtrl.getItemByName(b.ItemName);
    if(item){
        res.status(400).send("Item already exists");
    }else{
        itemsCtrl.createItem(b);
        res.status(200).send();
    }
});

router.delete('/',async(req,res)=>{
    if(req.query.id){
        let item=await itemsCtrl.getItemById(req.query.id);
        console.log(item);
        if(item){
            itemsCtrl.deleteItem(item);
            res.status(200).send(item);
        }else
            res.status(404).send();
    }else
        res.status(400).send();
});

router.get('/', async(req, res) => {
    if(req.query.page&&req.query.limit){
        let its=await itemsCtrl.getList();
        if(its){
            if(req.query.name)its=its.filter((e,b,c)=>e.doc.ItemName.toUpperCase().includes(req.query.name.toUpperCase()));
            res.status(200).send(its.slice(req.query.page*req.query.limit,req.query.page*req.query.limit+req.query.limit));
        }else
            res.status(400).send();
    }else{
        let its=await itemsCtrl.getList();
        if(its)
            res.status(200).send(its);
        else
            res.status(400).send();
    }
});

module.exports = router;