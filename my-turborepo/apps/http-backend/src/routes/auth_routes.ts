import express from "express"
import { Router } from "express";
import { SigninController } from "../controller/auth_controller";

const Auth_Router :Router  = express.Router();

Auth_Router.post("/signin" , SigninController)






export default Auth_Router;
