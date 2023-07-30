const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const verifyToken = (req, res, next) => {
  const token =
    req.headers["authorization"] ;
  
  if (!token) {
    return res.status(403).send("Unauthenticated!");
  }
  try {
    const bearer = token.split(' ');
    const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
  return next();
};

module.exports = verifyToken;
