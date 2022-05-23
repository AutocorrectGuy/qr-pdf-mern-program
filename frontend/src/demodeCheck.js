import axios from "axios";

// sets up development environment: proxy and selects fake cookie
/**
 * 
 * @param {useRef} devMode useRef from "react"
 * @param {useCookies} cookies useCookies from "react-cookie"
 * @param {useNavigate} navigate useNavigate from "react-router-dom"
 */
export function devModeCheck(devMode, cookies, navigate) {
  let isDevMode = process.env.REACT_APP_TEST !== undefined;
  // console.log(isDevMode ? "devmode" : "no devmode");
  if(isDevMode) {
    if (cookies.jwtdev === undefined) navigate("/login");
    axios.defaults.baseURL = "http://localhost:3001"
  }
  devMode.current = isDevMode;
}