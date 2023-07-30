const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");
const sequelize = require("sequelize");
const moment = require("moment");
const Op = sequelize.Op;

const reportOfEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const dateFrom = req.query.fromDate;
    const dateTo = req.query.toDate;
    const start = moment(dateFrom).startOf("day").format();
    const end = moment(dateTo).endOf("day").format();

    const employee = await Employee.findOne({ where: { id: id } });
    if (employee !== null) {
      const attendances = await Attendance.findAll({
        where: {
          attendanceTime: {
            [Op.between]: [start, end],
          },
          employeeId: employee.dataValues.id

        },
      });

      employee.dataValues.attendances = attendances;

      if (employee.dataValues.attendances.length != 0) {
        return res.status(200).send({
          data: employee,
          success: false,
        });
      } else {
        return res.status(404).send({
          data: "No record found!",
          success: false,
        });
      }
    } else {
      return res.status(404).send({
        data: "No record found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const reportOfAllEmployee = async (req, res, next) => {
  try {
    console.log('here')
    const fromDate = req.query.from;
    const toDate = req.query.to;
    const start = moment(fromDate).startOf("day").format();
    const end = moment(toDate).endOf("day").format();
    const attendances = await Attendance.findAll({
      where: {
        attendanceTime: {
          [Op.between]: [start, end],
        },
      },
    });

    if (attendances.length != 0) {
      return res.status(200).send({
        data: attendances,
        success: false,
      });
    } else {
      return res.status(404).send({
        data: "No record found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reportOfAllEmployee,
  reportOfEmployee,
};
