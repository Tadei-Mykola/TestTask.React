import dayjs from "dayjs";

export interface EventInterface {
    id?: number;
    title: string;
    description: string;
    dueDate: Date | dayjs.Dayjs;
}