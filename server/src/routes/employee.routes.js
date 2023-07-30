const express = require("express");
const router = express.Router();
const { Joi, celebrate, Segments } = require("celebrate");
const { Login } = require("../controllers/employee.controller");
const repController = require("../controllers/report.controller");
const {
  reportOfEmployee,
} = require("../controllers/report.controller");
const attController = require("../controllers/attendance.controller");
const empController = require("../controllers/employee.controller");
const auth = require("../middlewares/auth");
const logger = require("../middlewares/logging");

/////////////////////////////////=============================SignUp / LogIn Routes=============================================//////////////////////////////////
try {
  router.post(
    "/api/v1/trpk/employees/login",
    logger,
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    }),
    Login
  );

  router.post(
    "/api/v1/trpk/employees/mail",
    logger,
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
      }),
    }),
    empController.sendRequest
  );
  router.post(
    "/api/v1/trpk/resetpassword",
    logger,
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    empController.setPassword
  );

  ///////////////////////////////==============================Employee Routes=================================================////////////////////////////////////

  router.post(
    "/api/v1/trpk/employees",
    auth,
    logger,

    celebrate({
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        designation: Joi.string().required(),
        deviceId: Joi.number().required(),
        role: Joi.number().required(),
      }),
    }),
    empController.addEmployee
  );
  router.get("/employees", auth, logger, empController.getAllEmployee);

  router.get(
    "/api/v1/trpk/employees/:id",
    auth,
    logger,
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required().uuid(),
      }),
    }),
    empController.getEmployee
  );

  router.put(
    "/api/v1/trpk/employees/:id",
    auth,
    logger,
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required().uuid(),
      }),
      [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        designation: Joi.string().required(),
        role: Joi.number().required(),
      }),
    }),
    empController.updateEmployee
  );
  router.delete(
    "/api/v1/trpk/employees/:id",
    auth,
    logger,
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required().uuid(),
      }),
    }),
    empController.deleteEmployee
  );

  ////////////////////////////========================================= Attendances Routes ============================================////////////////////////////
  router.get(
    "/api/v1/trpk/employees/:id/attendances",
    auth,
    logger,
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
      }),
      [Segments.QUERY]: Joi.object().keys({
        date: Joi.date().required(),
      }),
    }),
    attController.getAttendanceOfUserByDate
  );
  ///////////////////////////======================================= Report Routes ====================================================/////////////////////////////
  router.get(
    "/api/v1/trpk/report",
    auth,
    logger,
    celebrate({
      [Segments.QUERY]: Joi.object().keys({
        from: Joi.date().required(),
        to: Joi.date().required(),
      }),
    }),
    repController.reportOfAllEmployee
  );
  router.get(
    "/api/v1/trpk/employees/:id/report",
    auth,
    logger,

    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
      }),
      [Segments.QUERY]: Joi.object().keys({
        fromDate: Joi.date().required(),
        toDate: Joi.date().required(),
      }),
    }),
    reportOfEmployee
  );
} catch (error) {
  console.log(error);
}
module.exports = router;
