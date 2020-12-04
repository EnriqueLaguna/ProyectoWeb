'use strict';
const { log } = require('console');
const express = require('express');
const TradeControllers = require('../controllers/tradeCotrollers');
const tradeCtrl = new TradeControllers();
const router = express();

router.post('/', async (req, res) => {
    let b = req.body;
    let trade=await tradeCtrl.getTradeByItemName(b.NombreItem);
    if(trade){
        res.status(400).send("Item already exists");
    }else{
        tradeCtrl.createTrade(b);
        res.status(200).send(b);
    }
});

router.delete('/',async(req,res)=>{
    if(req.query.id){
        let trade=await tradeCtrl.getTradeById(req.query.id);
        if(trade){
            tradeCtrl.deleteTrade(trade);
            res.status(200).send(trade);
        }else
            res.status(404).send();
    }else
        res.status(400).send();
});

router.get('/', async(req, res) => {
    if(req.query.page&&req.query.limit){
        let its=await tradeCtrl.getList();
        its=its.sort((a,b)=>parseInt(a.Fecha)-parseInt(b.Fecha));
        let tp=parseInt(its.length/req.query.limit)+(its.length%req.query.limit>0?1:0);
        if(its){
            if(req.query.name)its=its.filter((e,b,c)=>e.NombreItem.toUpperCase().includes(req.query.name.toUpperCase()));
            res.status(200).send({trades:its.slice(req.query.page*req.query.limit,req.query.page*req.query.limit+req.query.limit),totalPages:tp});
        }else
            res.status(400).send();
    }else{
        let its=await tradeCtrl.getList();
        if(its)
            res.status(200).send(its);
        else
            res.status(400).send();
    }
});

router.put('/',(req,res)=>{
    if(req.query.id){
        if(req.body){
            tradeCtrl.updateTrade(req.body);
            res.status(200).send(req.body);
        }
        res.status(400).send("Missing arguments");
    }else
        res.status(404).send("Missing id");
})

module.exports = router;