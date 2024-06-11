import express, { Request, Response } from "express";
import { MakeErrorHandler, userOnly } from "../../Util/middlewares";
import taskController from "./task.controller";
import { ITask } from "../../Schema/Tasks/task.types";
import { IUser } from "../../Schema/User/user.type";
import CategoriesController from "./categories.controller";


const publicTaskRouter = express.Router();
const privateTaskRouter = express.Router();

privateTaskRouter.post("/search/:page", userOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IUser = req['user'];
        const page = Number(req.params.page);
        res.json(await taskController.search(req.body, page, _user));
    }
));

privateTaskRouter.post("/create", userOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IUser = req['user'];
        res.json(await taskController.create(req.body, _user));
    }
));

privateTaskRouter.patch("/update/:taskId", userOnly, MakeErrorHandler(
    async (req: any, res: Response) => {
        const _user: IUser = req['user'];
        const { taskId } = req.params;
        res.json(await taskController.update(req.body, taskId, _user));
    }
));

publicTaskRouter.get("/category/list/:skip/:limit", MakeErrorHandler(
    async (req: any, res: Response) => {
        const { skip, limit } = req.params;
        res.json(await CategoriesController.getAll({ skip: Number(skip), limit: Number(limit) }));
    }
))

publicTaskRouter.use("/task", publicTaskRouter);
privateTaskRouter.use("/task", privateTaskRouter);


export { publicTaskRouter, privateTaskRouter } 