const express = require("express");
const cron = require("node-cron");
const attendanceRouter = express.Router();
const utils = require("../utils/zk.Attendance");
const controller = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth");
const logger = require("../middlewares/logging");
attendanceRouter.get(
  "/api/v1/trpk/attendances/employees",
  auth,
  logger,
  controller.getAllAttendanceByDate
);
cron.schedule("0 9 * * *", () => {
  utils.cronSyncDb();
});

attendanceRouter.post("/api/v1/trpk/attendances/sync", logger, utils.syncWithDatabase);
module.exports = attendanceRouter;
