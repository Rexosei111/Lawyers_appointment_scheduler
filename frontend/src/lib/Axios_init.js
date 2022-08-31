import axios from "axios";

export const API = axios.create({
  baseURL:
    process.env.REACT_APP_NODE_ENV === "production"
      ? "https://kyei.pythonanywhere.com/api/"
      : "http://localhost:8000/api/",
});

export const axiosConfig = (setProgress) => ({
  onUploadProgress: function (progressEvent) {
    var percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setProgress(percentCompleted);
  },
});

export const uploadAPI = axios.create({
  baseURL: "https://liel2c.deta.dev/",
});
