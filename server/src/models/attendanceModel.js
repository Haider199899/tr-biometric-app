const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db_connect_config");
const { Employee } = require("./employee.model");

const Attendance = sequelize.define("Attendances", {
  id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
     primaryKey:true
  },
  attendanceTime: {
    type: DataTypes.DATE,
  },
  state: {
    type: DataTypes.STRING,
  },
});

Attendance.belongsTo(Employee, { foreignKey: "employeeId" });

module.exports = { Attendance };
