import React,{createContext,useContext,useEffect,useState} from "react";
export const ThemeContext=createContext(null);
export const useTheme=()=>useContext(ThemeContext);
export const ThemeProvider=({children})=>{ const [theme,setTheme]=useState(()=>localStorage.getItem("theme")||"light"); useEffect(()=>{document.documentElement.setAttribute("data-theme",theme);document.body.setAttribute("data-theme",theme);localStorage.setItem("theme",theme);},[theme]); const toggleTheme=()=>setTheme(t=>t==='light'?'dark':'light'); return <ThemeContext.Provider value={{theme,setTheme,toggleTheme}}>{children}</ThemeContext.Provider>;};
