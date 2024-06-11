import express from "express";
import appRouter from "../Routes";
import { errorMiddleWare } from "./middlewares";
import helmet from "helmet";
import cors from 'cors';


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


    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "https://a-task-management-application.vercel.app");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.header("Access-Control-Allow-Credentials", "true");

        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
            // Check if request includes credentials
            if (req.headers['access-control-request-headers']?.includes('authorization')) {
                res.header("Access-Control-Allow-Credentials", "true");
            }
            return res.status(200).json({});
        }

        // If not an OPTIONS request, allow credentials if present in request headers
        if (req.headers['authorization']) { // Adapt based on your authorization header name
            res.header("Access-Control-Allow-Credentials", "true");
        }

        next();
    });



    app.use(appRouter);
    app.use(errorMiddleWare);

    return app;
}