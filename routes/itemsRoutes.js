'use strict';
const { log } = require('console');
const express = require('express');
const { send } = require('process');
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
        res.status(200).send("Item succesfully created");
    }
});

router.delete('/',async(req,res)=>{
    if(req.query.id){
        let item=await itemsCtrl.getItemById(req.query.id);
        if(item){
            itemsCtrl.deleteItem(item);
            res.status(200).send(item);
        }else
            res.status(404).send("Item not found");
    }else
        res.status(400).send("Missing item id");
});

router.get('/', async(req, res) => {
    if(req.query.page&&req.query.limit){
        let its=await itemsCtrl.getList();
        let tp=parseInt(its.length/req.query.limit)+(its.length%req.query.limit>0?1:0);
        //console.log(its);
        if(its){
            if(req.query.name)its=its.filter((e,b,c)=>e.ItemName.toUpperCase().includes(req.query.name.toUpperCase()));
            console.log(its);
            res.status(200).send({items:its.slice(req.query.page*req.query.limit,req.query.page*req.query.limit+req.query.limit),totalPages:tp});
        }else
            res.status(400).send();
    }
    else if(req.query.name){
        let item=await itemsCtrl.getItemByName(req.query.name);
        if(item){
            //res.redirect(item.ItemImage);
            res.status(200).send(item);
        }else{
            res.status(404).send("no");
        }        
    }else{
        let its=await itemsCtrl.getList();
        if(its)
            res.status(200).send(its);
        else
            res.status(400).send();
    }
});

router.put('/',(req,res)=>{
    if(req.query.id){
        if(req.body){
            itemsCtrl.updateItem(req.body);
            res.status(200).send(req.body);
        }
        res.status(400).send();
    }else
        res.status(400).send();
});

module.exports = router;