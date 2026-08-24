import api from "./api";
const attendanceService={getMyAttendance:async()=>{const {data}=await api.get("/attendance/student");return data?.data||data?.attendance||data||[];}};export default attendanceService;
