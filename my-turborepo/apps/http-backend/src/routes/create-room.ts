import express, { Router } from 'express'
import { CreateRoomContoller } from '../controller/create_room_controller';

const Create_Room_Router:Router = express.Router();


Create_Room_Router.post("/create" , CreateRoomContoller);



export default Create_Room_Router; 