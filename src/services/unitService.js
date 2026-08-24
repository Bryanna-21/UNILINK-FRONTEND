import api from "./api";
const unitService={getMyUnits:async()=>{const {data}=await api.get("/units/my-units");return data?.data||data?.units||data||[];},getUnitById:async id=>{const {data}=await api.get(`/units/${id}`);return data?.data||data;}};export default unitService;
