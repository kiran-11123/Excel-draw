import express, { Router } from 'express'
import { CreateRoomContoller } from '../controller/create_room_controller';
import Authentication_token from '../middleware';

const Create_Room_Router:Router = express.Router();


Create_Room_Router.post("/create" , Authentication_token , CreateRoomContoller);



export default Create_Room_Router; 