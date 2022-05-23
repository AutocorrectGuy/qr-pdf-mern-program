import axios from "axios";
import { useCookies } from "react-cookie";


export default async function verifyUserJWT({cookies, navigate, removeCookie}) {
  if (!cookies.jwt) {
    navigate("/login");
  } else {
    const { data } = await axios.post(
      "/auth/verify",
      {},
      {
        withCredentials: true,
      }
    );
    if (!data.status) {
      removeCookie("jwt");
      navigate("/login");
      return ({status: false, username: ""})
    } else {
      return ({status: data.status, username: data.username})
    }
  }
};