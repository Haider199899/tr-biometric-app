const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const { sequelize } = require("../config/db_connect_config");
const employeeRouter = require("./routes/employee.routes");
const attendanceRouter = require("./routes/attendance.routes");
const { ErrorHandler } = require("./middlewares/errorHandler");
const cors = require("cors");
const pg = require("pg");
const app = express();
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(cors());
const PORT = process.env.PORT || 3001;

dotenv.config({ path: ".env" });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Database configuration

const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connect();

app.use(employeeRouter);
app.use(attendanceRouter);
app.use(ErrorHandler);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Biometric Attendance application." });
});

//  listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
