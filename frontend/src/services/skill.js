import API from "./api";

export const addSkill = (data) => API.post("/skills", data);
