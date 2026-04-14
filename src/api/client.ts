import axios from "axios";

const BASE_URL = "http://192.168.100.40:8080";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default client;
