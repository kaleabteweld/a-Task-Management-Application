import mongoose from 'mongoose';
import { ISearchBuilderJson, StatusEnum } from './task.types';
import TaskModel from './task.schema';

export default class TaskSearchBuilder {
    private query: any;

    constructor() {
        this.query = {};
    }

    static fromJSON(json: ISearchBuilderJson) {
        const builder = new TaskSearchBuilder();
        if (json.title) {
            builder.byTitle(json.title);
        }
        if (json.description) {
            builder.byDescription(json.description);
        }
        if (json.categories) {
            builder.byCategories(json.categories);
        }
        if (json.status) {
            builder.byStatus(json.status);
        }
        if (json.sortBy) {
            if (json.sortBy === 'priority') {
                builder.sortByPriority();
            } else if (json.sortBy === 'deadline') {
                builder.sortByDeadline();
            }
        }
        return builder;
    }

    byTitle(title: string) {
        if (title) {
            this.query.title = { $regex: new RegExp(title, 'i') };
        }
        return this;
    }

    byUser(userId: string) {
        if (userId) {
            this.query.user = new mongoose.Types.ObjectId(userId);
        }
        return this;
    }

    byDescription(description: string) {
        if (description) {
            this.query.description = { $regex: new RegExp(description, 'i') };
        }
        return this;
    }

    byCategories(categories: string[]) {
        if (categories && categories.length > 0) {
            this.query.categories = { $in: categories.map(id => new mongoose.Types.ObjectId(id)) };
        }
        return this;
    }

    byStatus(status: StatusEnum) {
        if (status) {
            this.query.status = status;
        }
        return this;
    }

    sortByPriority() {
        this.query.sort = { priority: 1 };
        return this;
    }

    sortByDeadline() {
        this.query.sort = { deadline: 1 };
        return this;
    }

    withPage(page: number) {
        this.query.skip = (page - 1) * 10;
        this.query.limit = 10;
        return this;
    }

    async exec() {
        const sortQuery = this.query.sort;
        delete this.query.sort;

        return await TaskModel.find(this.query).sort(sortQuery);
    }
}
