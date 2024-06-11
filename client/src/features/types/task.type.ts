export enum PriorityEnum {
    low = 'low',
    medium = 'medium',
    high = 'high',
}

export enum StatusEnum {
    pending = 'pending',
    completed = 'completed',
}

export interface INewTask {
    title: string;
    description: string;
    deadline: Date;
    priority: PriorityEnum;
    status: StatusEnum;
    categories: string[]
}

export interface ICategories extends Document {
    name: string
}

export interface ITask extends Document {
    _id: string;
    title: string;
    description: string;
    deadline: Date;
    priority: string;
    status: string;
    user: string;
    categories: ICategories[];
}