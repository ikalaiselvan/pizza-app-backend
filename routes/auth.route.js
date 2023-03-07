import express from "express";
import { client } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {ObjectId} from "mongodb";

import sendEmail from "./email/sendEmail.js";

const router = express.Router();

// Registering user : 
router.post("/register", async function (request, response) {
    try{
        const data = request.body;
        //Checking user as an existing user:
        const { email } = request.body;
        const existingUser = await client
          .db("b39wd")
          .collection("pizza-auth")
          .findOne({ email: email });

        if(existingUser){
            return response.send({message: "User aldready registered"})
        }

        if (!data.password) {
          return response
            .status(400)
            .send({ message: "Password is required." });
        }
        const hashValue = await bcrypt.hash(data.password, 10);

        data.hashedPassword = hashValue;
        delete data.password;

        const result = await client
          .db("b39wd")
          .collection("pizza-auth")
          .insertOne(data);

        response.send({data: data, result: result});
    }catch(error){
        response.status(500).send({ message: "Internal Server Error", error : error });
    }
});

// User sign-in : 
router.post("/signin", async function (request, response) {
    try{
        const { email, password } = request.body;
        const existingUser = await client
          .db("b39wd")
          .collection("pizza-auth")
          .findOne({ email: email });

        if (existingUser) {
          const isValidUser = await bcrypt.compare(
            password,
            existingUser.hashedPassword
          );

          if (isValidUser) {
            const token = await jwt.sign(
              { _id: existingUser._id },
              process.env.SECRET_KEY
            ); // generating token using userId and secret key.

            response.cookie("accessToken", token, {
              expire: new Date() + 86400000,
            }); //seting token into cookie
            return response
              .status(201)
              .send({ message: "User signed in successfully..." });
          }
        }
        return response.send({ message: "User doesn't exist..." });
    }catch(error){
        res
          .status(500)
          .send({ message: "Internal Server Error", error: error });
    }    
});

// Logout user : 
router.get("/logout", async function (request, response) {
    try {
      await response.clearCookie("accessToken");
      response.status(200).send({ message: "User signed out successfully." });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
});

// forgot password :
router.post("/forgotPassword", async function (request, response) {
  try {
    const { email } = request.body;
    if (!email) {
      return response.status(400).send({ message: "Email is mandatory" });
    }

    const existingUser = await client
      .db("b39wd")
      .collection("pizza-auth")
      .findOne({ email: email });

    if (!existingUser) {
      return response.status(400).send({ message: "User does not exist" });
    }

    let existingToken = await client
      .db("b39wd")
      .collection("pizza-auth-token")
      .findOne({ userId: existingUser._id.toString() });

    if (existingToken) {
      await client
        .db("b39wd")
        .collection("pizza-auth-token")
        .deleteOne({ userId: existingUser._id.toString() });
    }

    let newToken = crypto.randomBytes(32).toString("hex"); // generating random string using crypto lybrary.
    const hashedToken = await bcrypt.hash(newToken, 10);

    const result = await client
      .db("b39wd")
      .collection("pizza-auth-token")
      .insertOne({
        userId: existingUser._id.toString(),
        token: hashedToken,
        createdAt: new Date(),
      });

    const link = `http://localhost:3000/passwordReset?token=${newToken}&id=${existingUser._id.toString()}`;

    console.log(existingUser.email);
    await sendEmail(existingUser.email, "Password Reset Link : ", {
      name: existingUser.name,
      link: link,
    });

    return response
      .status(200)
      .send({ message: "Email has been sent successfully." });

  } catch (error) {
    console.log("Error: ", error);
    response.status(500).send({ message: "Internal Server Error" });
  }
});

// Reset password : 
router.post("/resetPassword", async function (request, response) {
  let { userId, token, password } = request.body;

  // let resetToken = await Tokens.findOne({ userId: userId });
  let resetToken = await client
    .db("b39wd")
    .collection("pizza-auth-token")
    .findOne({ userId: userId });
  // console.log("userId : ",userId,"reset token : ",resetToken);

  if (!resetToken) {
    return response.status(401).send({ message: "Invalid or expired token." });
  }

  const isValid = await bcrypt.compare(token, resetToken.token);

  if (!isValid) {
    return response.status(400).send({ message: "Invalid Token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const result = await client
    .db("b39wd")
    .collection("pizza-auth")
    .updateOne(
      { _id: ObjectId(userId) },
      { $set: { hashedPassword: hashedPassword } }
    );

    await client
      .db("b39wd")
      .collection("pizza-auth-token")
      .deleteOne({ userId: userId });

      return response
        .status(200)
        .send({ message: "Password has been reset successfully." });

});


export default router;