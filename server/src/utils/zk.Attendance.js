const zklib = require("zklib");
const dotenv = require("dotenv");
const { Employee } = require("../models/employee.model");
const { Attendance } = require("../models/attendanceModel");
dotenv.config({ path: ".env" });
const State = {
  CHECK_IN: "check-in",
  CHECK_OUT: "check-out",
};

checkInDevice = new zklib({
  ip: '192.168.18.202',
  port: 4370,
  inport: 5200,
});

checkOutDevice = new zklib({
  ip: '192.168.18.201',
  port: 4370,
  inport: 5300,
});

const checkInAttendanceData = () =>
  new Promise((resolve, reject) => {
    checkInDevice.connect((err) => {
      if (err) reject(err);
      else {
        checkInDevice.enableDevice((err) => {
          if (err) throw err;
          checkInDevice.getAttendance((err, data) => {
            if (err) reject(err);
            else {
              resolve(data);
              checkInDevice.disconnect();
            }
          });
        });
      }
    });
  });

const checkOutAttendanceData = () =>
  new Promise((resolve, reject) => {
    checkOutDevice.connect((err) => {
      if (err) {
        reject(err);
      } else {
        checkOutDevice.enableDevice((err) => {
          if (err) throw err;
          checkOutDevice.getAttendance((err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
              checkOutDevice.disconnect();
            }
          });
        });
      }
    });
  });
const cronSyncDb = async () => {
  try {
    console.log("Attendance data inserting...");
    const checkInData = await checkInAttendanceData();
    const checkOutData = await checkOutAttendanceData();
    let count = 0;
    for (let i = 0; i < checkInData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkInData[i].id },
      });

      if (employee !== null) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkInData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist !== null) {
          continue;
        } else {
          const attendance = new Attendance();
          attendance.attendanceTime = checkInData[i].timestamp;
          attendance.state = State.CHECK_IN;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    for (let i = 0; i < checkOutData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkOutData[i].id },
      });

      if (employee) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkOutData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist) {
          continue;
        } else {
          const attendance = new Attendance();
          attendance.attendanceTime = checkOutData[i].timestamp;
          attendance.state = State.CHECK_OUT;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    if (count === 0) {
      console.log('No new record found!')
    } else {
      console.log("Attendance data inserted!");
    }
  } catch (error) {
    console.log('Data insertion to database unsuccessful due to : '+error)
    
  }
}
const syncWithDatabase = async (req, res) => {
  try {
    console.log("Attendance data inserting...");
    const checkInData = await checkInAttendanceData();
    const checkOutData = await checkOutAttendanceData();
    let count = 0;
    for (let i = 0; i < checkInData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkInData[i].id },
      });

      if (employee !== null) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkInData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist !== null) {
          continue;
        } else {
          const attendance = new Attendance();
          attendance.attendanceTime = checkInData[i].timestamp;
          attendance.state = State.CHECK_IN;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    for (let i = 0; i < checkOutData.length; i++) {
      //check does employee exist in database
      const employee = await Employee.findOne({
        where: { deviceId: checkOutData[i].id },
      });

      if (employee) {
        //To check that attendance exist in database
        const attendanceExist = await Attendance.findOne({
          where: {
            attendanceTime: checkOutData[i].timestamp,
            employeeId: employee.id,
          },
        });
        //If both condition satisfies
        if (attendanceExist) {
          continue;
        } else {
          const attendance = new Attendance();
          attendance.attendanceTime = checkOutData[i].timestamp;
          attendance.state = State.CHECK_OUT;
          attendance.employeeId = employee.id;
          attendance.save();
          count++;
        }
      } else {
        continue;
      }
    }
    if (count === 0) {
      console.log('No record inserted!')
      return res.status(200).send({
        message: "No new record found!",
        success: false,
      });
    } else {
      console.log("Attendance data inserted!");
      return res.status(200).send({
        message: count + "record inserted!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Data insertion to database unsuccessful due to : '+error,
      success: false,
    });
  }
};
module.exports = {
  syncWithDatabase,
  cronSyncDb
};
