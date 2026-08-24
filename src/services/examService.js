import api from "./api";
const examService={getStudentExams:async()=>{const {data}=await api.get("/exams/student");return data?.data||data?.exams||data||[];},getExamById:async id=>{const {data}=await api.get(`/exams/${id}`);return data?.data||data;},submitExam:async(id,payload)=>{const {data}=await api.post(`/exams/${id}/submit`,payload);return data;}};export default examService;
