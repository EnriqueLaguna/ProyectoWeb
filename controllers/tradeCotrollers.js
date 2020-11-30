const fs = require('fs');
const PATH = require('path');
const USERS_DB = require('../data/trades.json');
let CURRENT_ID = 0;

let uids = USERS_DB.map((obj)=>{return obj.uid});
CURRENT_ID = Math.max(...uids)+1;
console.log(`Current id: ${CURRENT_ID}`);

class TradesController{

}

module.exports = TradesController;