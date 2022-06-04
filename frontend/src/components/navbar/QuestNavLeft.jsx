import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGripHorizontal, faHomeAlt, faFileMedical, faSearch,
  faFile, faFilePdf, faFileUpload, faDoorOpen, faTractor
} from "@fortawesome/free-solid-svg-icons"
import useWindowSize from "../../hooks/useWindowSize";
import { useCookies } from "react-cookie";
import UserContext from "../../context/UserContext";

const hoverText = "hover:text-white transition-width ease-out focus:text-white duration-300 delay-100";
const liItemConStyles = "flex gap-4 h-10 items-center select-none text-neutral-400";
const faIconStyles = "min-w-[24px] min-h-[24px] focus:text-white";
const liItemTextStyles = "focus:text-white text-[1.05rem] font-semibold font-metrophobic whitespace-nowrap truncate text-clip";

export default function QuestNavLeft() {
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [isOpen, setOpen] = useState(true);
  const size = useWindowSize();

  const { userContextData, setUserContextData } = useContext(UserContext);

  useEffect(() => { setOpen(window.innerWidth < 1100 ? false : true); }, [])
  useEffect(() => {
    if (firstUpdate.current) { firstUpdate.current = false; return }
    if (size.width < 1024 && isOpen) setOpen(false);
    else if (size.width >= 1024 && !isOpen) toggleKebab();
  }, [size])

  function toggleKebab() { setOpen(!isOpen) };
  function closeKebabIfSmallScreen() { if (size.width < 640) setOpen(false) };


  function ButtonsTopMenu() {
    return (
      <div className="flex flex-col">
        <div className={`${!isOpen && "hidden sm:block"}`}>
          <div className="pb-4">
            <div>
              <div className={`${liItemConStyles}`}>
                {isOpen &&
                  <div className="fixed bg-black top-24 w-56">
                    <div className={`${liItemTextStyles}`}>LEAVE QUESTION ABOUT</div>
                    <div className={`${liItemTextStyles}`}>CHIPPER PARTS HERE!</div>
                      <textarea
                        type={"text"}
                        placeholder="Enter your question here"
                        name="textarea"
                        rows={10}
                        className="flex w-full px-2 py-2 mt-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                      // onChange={(e) =>
                      //   setValues({ ...values, [e.target.name]: e.target.value })
                      // }
                      />
                    <div className={`${liItemTextStyles} mt-8`}>Your</div>
                    <input
                        type={"text"}
                        placeholder="Email"
                        name="textarea"
                        rows={10}
                        className="flex w-full px-2 py-2 mt-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                      // onChange={(e) =>
                      //   setValues({ ...values, [e.target.name]: e.target.value })
                      // }
                      />
                    <div className={`${liItemTextStyles} mt-2`}>or</div>
                    <input
                        type={"text"}
                        placeholder="Phone number"
                        name="textarea"
                        rows={10}
                        className="flex w-full px-2 py-2 mt-2 text-white placeholder:text-neutral-300 bg-neutral-600 transition duration-300 rounded focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
                      // onChange={(e) =>
                      //   setValues({ ...values, [e.target.name]: e.target.value })
                      // }
                      />
                    
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>);
  }

  return (
    <div
      className={`fixed transition-width ease-out duration-200 z-10 flex flex-col bg-black gap-6 p-7 sm:static 
      ${isOpen
          ? "min-w-[288px] max-w-[288px] min-h-screen"
          : "min-w-[45px] sm:min-w-[80px] items-center bg-transparent sm:bg-black"}`}>
      <div onClick={toggleKebab} className="fixed left-4 rounded-full flex items-center sm:block">
        <FontAwesomeIcon icon={faGripHorizontal}
          className={`${faIconStyles} 
          bg-black bg-opacity-30 hover:bg-opacity-100 rounded-full p-3 text-neutral-300 hover:text-white cursor-pointer`} />
      </div>
      <div className={`${isOpen && "w-56"} fixed left-7 top-20 flex flex-col justify-between h-full`}>
        <ButtonsTopMenu />
      </div>
    </div>
  )
}