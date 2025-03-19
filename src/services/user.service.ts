import axios from "axios";
import axiosInstance from "../interseptor";
import { UserInterface } from "../interfaces/user.interface";
const defaultUrl = "http://localhost:3000/"

export class UserService {

    login(login: string, password: string) {
        return axios.post(`${defaultUrl}user/authorization/`, {login: login, password: password})
    }

    registration(data: UserInterface) {
        return axios.post(`${defaultUrl}user/`, data)
    }

    async getUserData() {
        const response = await axiosInstance.get(`${defaultUrl}user/getUser`)
        return response.data
    }
}