const { DataTypes } = require('sequelize');
const {sequelize}=require('../../config/db_connect_config');
const roles = require('../../config/user.roles');
const Employee = sequelize.define('Employees', {

  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
     primaryKey:true
  },
  name: {
    type: DataTypes.STRING
  },
  designation:{
    type:DataTypes.STRING
  
 },
  email:{
     type:DataTypes.STRING,
     unique:true
  },
  password:{
    type:DataTypes.STRING,
    allowNull:true
  },
  passwordToken:{
    type:DataTypes.STRING,
    allowNull:true
  },
  role:{
    type:DataTypes.ENUM(roles.ADMIN,roles.STANDARD_USER,roles.SUPER_ADMIN),
    defaultValue:null
  },
  deviceId:{
    type:DataTypes.INTEGER,
    unique:true
  },
  updatedby:{
   type:DataTypes.STRING,
   allowNull:true
    },
}, {
  paranoid: true
});
module.exports={Employee}

