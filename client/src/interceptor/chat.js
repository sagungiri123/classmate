import api from "../api/axios";

export const sendMessage  = (data)  => api.post("/chat", data);
export const getAllChats   = ()      => api.get("/chat");
export const getChatById  = (id)    => api.get(`/chat/${id}`);
export const deleteChat   = (id)    => api.delete(`/chat/${id}`);