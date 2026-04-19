import API from "./api";

export const getRoadmap = (data) => API.post("/roadmap", data);

export const downloadCalendar = (data) =>
  API.post("/roadmap/calendar", data, { responseType: "blob" });