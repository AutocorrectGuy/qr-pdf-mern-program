import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"

export default function Secret() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [cookieData, setCookieData] = useState([]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "/auth/secret",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast(`Sveicināts, ${data.username} 🦄`, {
            theme: "dark",
          });
          setCookieData(data);
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  return (
    <>
    <NavLeft />
    <div className="flex w-full min-h-screen bg-neutral-800 text-white">
      {
        cookieData && <h1 className="text-white">{`Lietotājvārds: ${cookieData.username}`}</h1>
      }
      <button className="bg-green cursor-pointer p-3 rounded-md" onClick={logOut}>Log out</button>
      <ToastContainer />
    </div>
    <NavRight />
    </>
  );
}