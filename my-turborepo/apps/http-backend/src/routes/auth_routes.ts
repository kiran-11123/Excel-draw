import express from "express"
import { Router } from "express";
import { SigninController  , SignupController } from "../controller/auth_controller";

const Auth_Router :Router  = express.Router();

Auth_Router.post("/signin" , SigninController)
Auth_Router.post("/signup" , SignupController)






export default Auth_Router;
