const fs = require('fs');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const TRADES_CLOUDANT_DB = cloudant.db.use('trades');

class TradeControllers{
    createTrade(item){
        delete item.token;
        TRADES_CLOUDANT_DB.insert(item);
    }

    updateTrade(item){
        delete item.token;
        TRADES_CLOUDANT_DB.insert(item);
    }

    async getList(){
        let entries = await TRADES_CLOUDANT_DB.list({include_docs:true});
        return entries.rows.map((d)=>{
            return {
                NombreUsuario: d.doc.NombreUsuario,
                NombreItem: d.doc.NombreItem,
                Precio: d.doc.Precio,
                Fecha: d.doc.Fecha
            }
        });
        //return entries.rows;
    }

    async getTradeByItemName(name){
        const q = {
            selector:{
                NombreItem:{"$eq":name}
            }
        }
        let docs = await TRADES_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let item = {
                NombreUsuario: docs.docs[0].NombreUsuario,
                NombreItem: docs.docs[0].NombreItem,
                Precio: docs.docs[0].Precio,
                Fecha: docs.docs[0].Fecha,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev
            }
            return item;
        }else{
            return undefined;
        }
    }

    async getTradeById(id){
        const q = {
            selector:{
                "_id":{"$eq":id._id?id._id:id}
            }
        }
        let docs = await TRADES_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let item = {
                NombreUsuario: docs.docs[0].NombreUsuario,
                NombreItem: docs.docs[0].NombreItem,
                Precio: docs.docs[0].Precio,
                Fecha: docs.docs[0].Fecha,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev
            }
            return item;
        }else{
            return undefined;
        }
    }

    deleteTrade(item){
        TRADES_CLOUDANT_DB.destroy(item._id,item._rev);
    }
}

module.exports = TradeControllers;