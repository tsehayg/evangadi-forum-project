import axios from "axios";

const instance = axios.create({
  baseURL: "https://evangadi-forum-project-deploy.onrender.com/api",
});

// to include token in every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
