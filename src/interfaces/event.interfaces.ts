import dayjs from "dayjs";

export interface EventInterface {
    id?: number;
    title: string;
    description: string;
    dueDate: Date | dayjs.Dayjs;
    priority: "IMPORTANT" | "NORMAL" | "CRITICAL";
}

export interface EventFilterInterface {
    title?: string;
    priority?: ("IMPORTANT" | "NORMAL" | "CRITICAL")[];
    dueDate?: dayjs.Dayjs | null;
}