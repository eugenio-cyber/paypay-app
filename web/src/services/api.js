import axios from "axios";

export default axios.create({
  baseURL: "https://paypay-app-server.vercel.app",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
