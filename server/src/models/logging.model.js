const { DataTypes } = require('sequelize');
const {sequelize}=require('../../config/db_connect_config')

const Log = sequelize.define('Logs', {

  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
     primaryKey:true
  },
  timestamp:{
    type:DataTypes.DATE,
  },
  processingtime:{
    type:DataTypes.INTEGER
  },
  url:{
    type:DataTypes.STRING
  },
  statuscode:{
    type:DataTypes.INTEGER
  },
  statusmessage : {
   type:DataTypes.STRING
  },
  method:{
    type:DataTypes.STRING
  }
});
module.exports={Log}