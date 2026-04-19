import API from "./api";

export const getSummary = () => API.get("/summary");
export const getAnalytics = () => API.get("/analytics");
