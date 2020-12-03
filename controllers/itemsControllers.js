const fs = require('fs');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const ITEMS_CLOUDANT_DB = cloudant.db.use('items');

class ItemsController{
    createItem(item){
        ITEMS_CLOUDANT_DB.insert(item);
    }

    async getList(){
        let entries = await ITEMS_CLOUDANT_DB.list({include_docs:true});
        return entries.rows;
    }

    async getItemByName(name){
        const q = {
            selector:{
                ItemName:{"$eq":name}
            }
        }
        let docs = await ITEMS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let item = {
                Durabilidad: docs.docs[0].Durabilidad,
                Descripcion: docs.docs[0].Descripcion,
                ItemName: docs.docs[0].ItemName,
                ItemImage: docs.docs[0].ItemImage,
                Receta: docs.docs[0].Receta,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev
            }
            return item;
        }else{
            return undefined;
        }
    }

    async getItemById(id){
        const q = {
            selector:{
                "_id":{"$eq":id._id?id._id:id}
            }
        }
        let docs = await ITEMS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let item = {
                Durabilidad: docs.docs[0].Durabilidad,
                Descripcion: docs.docs[0].Descripcion,
                ItemName: docs.docs[0].ItemName,
                ItemImage: docs.docs[0].ItemImage,
                Receta: docs.docs[0].Receta,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev
            }
            return item;
        }else{
            return undefined;
        }
    }

    deleteItem(item){
        console.log("dedede");
        ITEMS_CLOUDANT_DB.destroy(item._id,item._rev);
    }
}

module.exports = ItemsController;