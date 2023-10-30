import axios from "axios";
import Cookies from "js-cookie";
import { ENDPOINT, TOKEN } from '../constants'

const request = axios.create({
    baseURL: `${ENDPOINT}api/v1`,
    timeout: 10000,
    headers: {
        Authorization: `Bearer ${Cookies.get(TOKEN)}`
    }
})
export default request