const fs = require('fs');
const CloudantSDK = require('@cloudant/cloudant');
const CLOUDANT_CREDS = require('../localdev-config.json');
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_CLOUDANT_DB = cloudant.db.use('users');

class UsersController{
    async createUser(user){
        await USERS_CLOUDANT_DB.insert(user);
    }

    async getUsers(){
        let users = new Array();
        let entries = await USERS_CLOUDANT_DB.list({include_docs:true});
        for(let entry of entries.rows){
            users.push(entry.doc);
        }
        return users;
    }

    async getUserByEmail(email){
        const q = {
            selector:{
                email:{"$eq":email}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let user = {
                name: docs.docs[0].name,
                lastname: docs.docs[0].lastname,
                email:docs.docs[0].email,
                password:docs.docs[0].password,
                birthDay:docs.docs[0].birthDay,
                sexo:docs.docs[0].sexo,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev,
                image:docs.docs[0].image,
                token:docs.docs[0].token
            }
            return user;
        }else{
            return undefined;
        }
    }

    async getUserByCredentials(email, password){
        const q = {
            selector:{
                "email":{"$eq":email},
                "password":{"$eq":password}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let user = {
                name: docs.docs[0].name,
                lastname: docs.docs[0].lastname,
                email:docs.docs[0].email,
                password:docs.docs[0].password,
                birthDay:docs.docs[0].birthDay,
                sexo:docs.docs[0].sexo,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev,
                image:docs.docs[0].image
            }
            return user;
        }else{
            return undefined;
        }
    }

    async getUserById(id){
        const q = {
            selector:{
                "_id":{"$eq":id._id}
            }
        }
        let docs = await USERS_CLOUDANT_DB.find(q);
        if(docs.docs.length>0){
            let user = {
                name: docs.docs[0].name,
                lastname: docs.docs[0].lastname,
                email:docs.docs[0].email,
                password:docs.docs[0].password,
                birthDay:docs.docs[0].birthDay,
                sexo:docs.docs[0].sexo,
                image:docs.docs[0].image,
                _id:docs.docs[0]._id,
                _rev:docs.docs[0]._rev
            }
            return user;
        }else{
            return undefined;
        }
    }

    async updateUser(user){
        await USERS_CLOUDANT_DB.insert(user);
    }

    deleteUser(user){
        USERS_CLOUDANT_DB.destroy(user._id,user._rev);
    }
}

module.exports = UsersController;