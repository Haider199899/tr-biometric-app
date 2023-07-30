const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const { Employee } = require("../models/employee.model");
const { all } = require("../routes/attendance.routes");
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Employee.findOne({ where: { email: email } });
    if (user !== null) {
      const match = await bcrypt.compare(password, user.password);
      if (match === true) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        const profile = {
          id: user.id,
          role: user.role,
        };
        return res.status(200).send({
          message: "Login successfull",
          profile: profile,
          success: true,
          accessToken: token,
        });
      } else {
        return res.status(403).send({
          message: "Email or password is incorrect",
          success: false,
        });
      }
    } else {
      return res.status(403).send({
        message: "Email or password is incorrect",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
//================================================================= Forgot Password And Password set invitation ===============================================================================//
//Generates token and Sends password reset email
const sendRequest = async (req, res, next) => {
  try {
    const email = req.query.email;
    const hash = await bcrypt.hash(email,10);
    const user = await Employee.findOne({ where: { email: email } });
    console.log(process.env.SUPER_ADMIN_EMAIL)
    if (user !== null) {
      user.passwordToken = hash;
      user.save()
     
      let link =
        "http://" +
        process.env.HOST +
        ":" +
        "5173" +
        `/resetpassword?email=${email}&code=${hash}`;

      /*
      const myMsg = new Email(
        { 
          to: email,
          from: process.env.SUPER_ADMIN_EMAIL,
          subject: "Password change request",
       
          text: `Hi \n 
        Please click on the following link ${link} to set your password for Biometric Attendance System. \n\n`,
        })
        myMsg.send((err) =>{
          console.log(err)
        });
        */

      const mailOptions = {
        to: email,
        from: process.env.EMAIL_SENDER,
        subject: "Password change request",
        template:'./reset-password',
        text: `Hi \n 
        Please click on the following link ${link} to set your password for Biometric Attendance System. \n\n`,
      };
      sgMail.send(mailOptions, (error, result) => {
        if (error) {
          console.log(error)
          next(error);
        }
        return res.status(200).json({
          message: "A reset email has been sent to " + email + ".",
        });
      });
    } else {
      return res.status(404).json({
        message: "Employee not found!",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const setPassword = async (req, res, next) => {
  try {
   
    const token = req.body.token;
    console.log(token)
    const email = req.body.email;
    const password = req.body.password

    const userExist = await Employee.findOne({
      where: { email: email },
    });
    if (userExist !== null) {
      if (userExist.passwordToken === token) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userExist.password = hashedPassword;
        userExist.save();
        return res.status(200).send({
          message: "Password is set successfully",
          success: true,
        });
      } else {
        return res.status(401).send({
          message: "You are unauthorized to perform that action!",
          success: false,
        });
      }
    } else {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

//================================================================== Employee CRUD Operations ==================================================================================//

const addEmployee = async (req, res, next) => {
  try {
    const { name, designation, email, deviceId, role } = req.body;
   console.log('......................add')
    const token = req.headers["authorization"]
    const bearer = token.split(' ');
    const decodedToken = jwt.decode(bearer[1]);
  

    const updatedBy = decodedToken.email;

    const user  = await Employee.findOne({where:{email:email}});
    if(user === null){
    const _employee = new Employee({
      name,
      designation,
      email,
      role,
      deviceId,
      updatedBy,
    });
 
    await _employee.save();
    console.log('ok')
    return res.status(200).send({
      data: _employee,
      success: true,
    });
  }else{
    return res.status(403).send({
      message:'Invalid email!',
      success: true,
    });
  }
  } catch (error) {
    console.log(error)
    next(error);
  }
};
const getEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findOne({ where: { id: id } });
    if (employee === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    } else {
      return res.status(200).send({
        data: employee,
        messgae: "Employee found!",
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAllEmployee = async (req, res, next) => {
  try {
    const allEmployees = await Employee.findAll();
    const employees = allEmployees.filter((item) => {
      delete item.dataValues.password;
      delete item.dataValues.passwordToken;
      return item
    })
    if (employees.length != 0) {
      return res.status(200).send({
        data: employees,
        success: true,
      });
    } else {
      return res.status(404).send({
        message: "No employees found!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};
const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id)
    const { name, designation, email, role } = req.body;
    console.log(role)
    const token = req.headers["authorization"]
    const bearer = token.split(' ');
    const decodedToken = jwt.decode(bearer[1]);
    const updatedBy = decodedToken.email;
    const user = await Employee.findOne({ where: { id: id } });
    if (user === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    } else {
      user.name = name;
      user.designation = designation;
      user.email = email;
      user.role = role;
      user.updatedBy = updatedBy;
      await user.save();
      return res.status(200).send({
        data: user,
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};
const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"] ||  req.headers["authorization"]
    
    
    const bearer = token.split(' ');
    const decodedToken = jwt.decode(bearer[1]);
    const updatedBy = decodedToken.email;
    const user = await Employee.findOne({ where: { id: id } });
    if (user === null) {
      return res.status(404).send({
        message: "Employee not found!",
        success: false,
      });
    } else {
      await Employee.destroy({
        where: {
          id: id,
        },
      });
      user.updatedBy = updatedBy;
      return res.status(200).send({
        message: "Employee deleted Successfully!",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Login,
  sendRequest,
  addEmployee,
  getEmployee,
  getAllEmployee,
  updateEmployee,
  deleteEmployee,
  setPassword,
};
