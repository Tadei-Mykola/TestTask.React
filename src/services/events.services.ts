import dayjs from "dayjs";
import { EventFilterInterface, EventInterface } from "../interfaces/event.interfaces";
import axiosInstance from "../interseptor";
const defaultUrl = "http://localhost:3000/"

export class EventsService {
    autoSetStatus = (loading:boolean = false, message: string | null = null, severity: string | null = null) => {
        return { loading, message, severity };
    }

    async createNewEvent(event: EventInterface) {
        const response = await axiosInstance.post(`${defaultUrl}events/`, event);
        return response.data;
    }

    async getEvents(page: number, limit: number, filter: EventFilterInterface ) {
        const response = await axiosInstance.get(`${defaultUrl}events/getAll/`, {params: {page, limit, ...filter}}, );
        return response.data;
    }

    async updateEvent(id: number, data: EventInterface) {
        const response = await axiosInstance.patch(`${defaultUrl}events/${id}`, {...data, id})
        return response.data;
    }

    async getEventById(id: number): Promise<EventInterface> {
        const response = await axiosInstance.get(`${defaultUrl}events/${id}`)
        return response.data;
    } 

    async getDays(date: dayjs.Dayjs) {
        const response = await axiosInstance.get(`${defaultUrl}events/getDays/${date.toISOString()}`)
        return response.data.map((day: string) => dayjs(day).date());
    }
    deleteEventById(id: number) {
        return axiosInstance.delete(`${defaultUrl}events/${id}`)
    }
}