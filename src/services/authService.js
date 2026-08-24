import api from "./api";
const TOKEN_KEY="token"; const USER_KEY="user";
const authService={
 async login(credentials){const {data}=await api.post("/auth/login",credentials);if(data.user?.role&&data.user.role!=="student")throw new Error("Student access only.");if(data.token)localStorage.setItem(TOKEN_KEY,data.token);if(data.user)localStorage.setItem(USER_KEY,JSON.stringify(data.user));return data;},
 async register(userData){const {data}=await api.post("/auth/register",{...userData,role:"student"});return data;},
 async logout(){try{await api.post("/auth/logout");}catch{}localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);},
 async forgotPassword(email){const {data}=await api.post("/auth/forgot-password",{email});return data;},
 async resetPassword(data){const {data:result}=await api.post("/auth/reset-password",data);return result;},
 async getCurrentUser(){const {data}=await api.get("/users/me");return data;},
 async updateProfile(data){const {data:result}=await api.put("/users/me",data);if(result.user)localStorage.setItem(USER_KEY,JSON.stringify(result.user));return result;},
 async changePassword(data){const {data:result}=await api.put("/users/change-password",data);return result;},
 getToken(){return localStorage.getItem(TOKEN_KEY)}, setToken(t){localStorage.setItem(TOKEN_KEY,t)}, removeToken(){localStorage.removeItem(TOKEN_KEY)},
 getUser(){const u=localStorage.getItem(USER_KEY);return u?JSON.parse(u):null}, setUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u))}, removeUser(){localStorage.removeItem(USER_KEY)}, isAuthenticated(){return !!localStorage.getItem(TOKEN_KEY)}, isStudent(){return this.getUser()?.role==="student"}
}; export default authService;
