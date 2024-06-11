import express from "express";
import { publicUserRouter, privateUserRouter } from "./User";
import { publicAuthenticationRouter, privateAuthenticationRouter } from "./Authentication";
import { privateTaskRouter, publicTaskRouter } from "./Task/router";

const publicRouter = express.Router();
const privateRouter = express.Router();

publicRouter.use([publicUserRouter, publicAuthenticationRouter, publicTaskRouter]);
privateRouter.use([privateUserRouter, privateAuthenticationRouter, privateTaskRouter]);


export { publicRouter, privateRouter }