import api from "./api";
const courseService={getMyCourses:async()=>{const {data}=await api.get("/courses/my-courses");return data?.data||data?.courses||data||[];},getCourseById:async id=>{const {data}=await api.get(`/courses/${id}`);return data?.data||data;}};export default courseService;
