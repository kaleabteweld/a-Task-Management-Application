import { CategoryModel } from "../../Schema/Tasks/task.schema";
import { IPagination } from "../../Types";

const initCategories = [
    {
        name: "Personal",
    },
    {
        name: "Work",
    },
    {
        name: "Home",
    }
]


export default class CategoriesController {

    static async seed() {
        try {
            await CategoryModel.deleteMany({});
            await CategoryModel.insertMany(initCategories);
        } catch (error) {
            console.error('Error seeding categories', error);
            throw error;
        }
    }

    static async getAll({ limit, skip }: IPagination) {
        try {
            const categories = await CategoryModel.find({}).limit(limit ?? 10).skip(skip ?? 0);
            return categories;
        } catch (error) {
            throw error
        }
    }
}
