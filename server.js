'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt=require("jsonwebtoken");
const JwT="Foc@andaForTheWin";

app.use(express.static(__dirname +'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

const itemsRouter = require('./routes/itemsRoutes');
const tradesRouter = require('./routes/tradesRoutes');
const usersRouter = require('./routes/usersRoutes');
const ItemsController = require('./controllers/itemsControllers');
const TradesController = require('./controllers/tradeCotrollers');
const UsersController = require('./controllers/usersController');
const PORT = process.env.PORT || 3000;

let TOKEN=undefined;

function authentication(req,res,next){
    if(req.method==="POST"&&req.baseUrl.includes("users")){
        console.log("skipped")
        next();
    }
    jwt.verify(TOKEN,JwT,(err,decoded)=>{
        if(err){
            res.status(401).send("Not authorized");
        }else{
            req.body.token=TOKEN;
            next();
        }
    });
    /*let deco=jwt.verify(TOKEN,JwT);
    console.log(deco);
    console.log(req);
    if(req.body._id===deco._id)
        next();
    else
        res.status(401).send("Not authorized");
    /*if(TOKEN){
        let deco=jwt.verify(TOKEN,JwT);
        req.body.eide=deco;
    }*/
}

//app.use('/api/users',authentication,usersRouter);
app.use('/api/users',authentication,usersRouter);
app.use('/api/items',authentication,itemsRouter);

app.post('/api/login', async(req,res)=>{
    if(req.body.email && req.body.password){
        let uctrl = new UsersController();
        let user = await uctrl.getUserByCredentials(req.body.email,req.body.password);
        if(user){
            TOKEN=jwt.sign({_id:user._id},JwT);
            user.token = TOKEN;
            uctrl.updateUser(user);
            res.status(200).send({"token":TOKEN});
        }else{
            res.status(404).send('User not found');
        }
    }else{
        res.status(400).send('Missing user/pass');
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})