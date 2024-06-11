import express from "express";
import appRouter from "../Routes";
import { errorMiddleWare } from "./middlewares";
import helmet from "helmet";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import googleStrategy from "../Routes/Authentication/passport-config";


export function makeServer() {
    const app = express();

    app.use(helmet())
    app.disable('x-powered-by')
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static("public"));

    app.use((req, _, next) => {
        console.log("[->] ", req.method, req.url);
        next();
    })

    passport.use(googleStrategy);

    app.use(passport.initialize());


    app.use(appRouter);
    app.use(errorMiddleWare);

    return app;
}