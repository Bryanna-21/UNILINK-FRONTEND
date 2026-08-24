import api from "./api";
const timetableService={getMyTimetable:async()=>{const {data}=await api.get("/timetable/student");return data?.data||data?.timetable||data||[];}};export default timetableService;
