import api from "./api";
const noteService={getNotes:async()=>{const {data}=await api.get("/notes");return data?.data||data?.notes||data||[];},getNoteById:async id=>{const {data}=await api.get(`/notes/${id}`);return data?.data||data;},downloadNote:async id=>api.get(`/notes/${id}/download`,{responseType:"blob"})};export default noteService;
