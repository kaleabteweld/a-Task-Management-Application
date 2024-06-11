import express from "express";
import { publicUserRouter, privateUserRouter } from "./User";
import { publicAuthenticationRouter, privateAuthenticationRouter } from "./Authentication";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([publicUserRouter, publicAuthenticationRouter]);
privateRouter.use([privateUserRouter, privateAuthenticationRouter]);


export { publicRouter, privateRouter }