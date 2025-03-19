import { EventInterface } from "../interfaces/event.interfaces";
import axiosInstance from "../interseptor";
const defaultUrl = "http://localhost:3000/"

export class EventsService {
    autoSetStatus = (loading:boolean = false, message: string | null = null, severity: string | null = null) => {
        return { loading, message, severity };
    }

    async createNewEvent(event: EventInterface) {
        const response = await axiosInstance.post(`${defaultUrl}events/createEvent`, event);
        return response.data;
    }

    async getEvents(page: number, limit: number) {
        const response = await axiosInstance.get(`${defaultUrl}events/`, {params: {page, limit}});
        return response.data;
    }

    async updateEvent(id: number, data: EventInterface) {
        const response = await axiosInstance.patch(`${defaultUrl}events/updateTodo/${id}`, data)
        return response.data;
    }

    deleteEventById(id: number) {
        return axiosInstance.delete(`${defaultUrl}todo/deleteTodo/${id}`)
    }
}