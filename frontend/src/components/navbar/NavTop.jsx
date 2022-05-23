import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserCircle }  from "@fortawesome/free-solid-svg-icons"

export default function NavTop() {
  const navigate = useNavigate();
  const { userContextData, setUserContextData } = useContext(UserContext);

  return(
  <div className="absolute top-0 p-2 bg-transparent flex items-center justify-end gap-3 w-full">
    <div className="flex gap-2 justify-center items-center text-white rounded-full border border-neutral-700
    bg-neutral-900 cursor-pointer shadow-sm shadow-black active:translate-y-px"
    onClick={() => {navigate("/")}}>
      <FontAwesomeIcon icon={faUserCircle} className={`text-neutral-300 w-7 h-7 rounded-full ml-2 select-none`}  />
      <p className="py-2 pr-4 select-none">{`${userContextData.username}`}</p>
    </div>
  </div>
  );
}