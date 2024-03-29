// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";

const isAuth = async (request, response, next) => {
    // console.log("auth : ",request.cookies);
    console.log("auth : ", request.cookie);
  const { cookies } = request;

  // console.log("cookies : ",cookies.accessToken)
  if (cookies.accessToken) {

    let data = await jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    request.id = data._id;
    console.log("data :",data);

    if (!request.id) {
      return response.status(401).send({ message: "Not authorized." });
    }

    return next();
  }

  return response.status(401).send({ message: "Not authorized" });
};

export default isAuth;