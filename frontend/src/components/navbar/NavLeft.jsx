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
const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer select-none text-neutral-400";
const faIconStyles = "min-w-[24px] min-h-[24px] focus:text-white";
const liItemTextStyles = "focus:text-white text-[1.05rem] font-semibold font-metrophobic whitespace-nowrap truncate text-clip";

export default function Navbar() {
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
  const logOut = () => {
    axios.get("/auth/logout")
      .then(res => { navigate("/login") })
  }

  function ButtonsTopMenu() {
    return (
      <div className="flex flex-col">
        <div className={`${!isOpen && "hidden sm:block"}`}>
          <div className="pb-4">
            <Link to="/" onClick={closeKebabIfSmallScreen}>
              <div className={`${liItemConStyles} ${hoverText}`}>
                <FontAwesomeIcon icon={faHomeAlt} className={faIconStyles} />
                {isOpen && <div className={`${liItemTextStyles} -translate-x-[3px]`}>Sākums</div>}
              </div>
            </Link>
            {/* <div>
              <div className={`${liItemConStyles} cursor-not-allowed`}>
                <FontAwesomeIcon icon={faSearch} className={faIconStyles} />
                {isOpen && <div className={liItemTextStyles}>Meklēt</div>}
              </div>
            </div> */}
            {
              (userContextData?.status === "employee" || userContextData?.status === "admin") &&
              <>
                <Link to="/upload-link" onClick={closeKebabIfSmallScreen}>
                  <div className={`${liItemConStyles} ${hoverText}`}>
                    <FontAwesomeIcon icon={faFileMedical} className={faIconStyles} />
                    {isOpen && <div className={liItemTextStyles}>Pievienot linku</div>}
                  </div>
                </Link>
                <Link to="/upload-pdf" onClick={closeKebabIfSmallScreen}>
                  <div className={`${liItemConStyles} ${hoverText}`}>
                    <FontAwesomeIcon icon={faFileUpload} className={faIconStyles} />
                    {isOpen && <div className={liItemTextStyles}>Augšuplādēt katalogu</div>}
                  </div>
                </Link>
              </>
            }
          </div>
          <div className={`${isOpen && "border-b border-b-neutral-600 pb-4 mb-4"}`}>
            {
              (userContextData?.status === "employee" || userContextData?.status === "admin") &&
              <>
                <div>
                  <div className={`${liItemConStyles} cursor-not-allowed`}>
                    <FontAwesomeIcon icon={faFile} className={faIconStyles} />
                    {isOpen && <div className={liItemTextStyles}>Tavi katalogi</div>}
                  </div>
                </div>
                <div>
                  <div className={`${liItemConStyles} cursor-not-allowed`}>
                    <FontAwesomeIcon icon={faFilePdf} className={faIconStyles} />
                    {isOpen && <div className={liItemTextStyles}>Noklusējuma katalogi</div>}
                  </div>
                </div>
              </>
            }

            <Link to="/models" onClick={closeKebabIfSmallScreen}>
              <div className={`${liItemConStyles} ${hoverText}`}>
                <FontAwesomeIcon icon={faTractor} className={faIconStyles} />
                {isOpen && <div className={`${liItemTextStyles} -translate-x-[3px]`}>Models</div>}
              </div>
            </Link>
          </div>
          {
            userContextData.hasOwnProperty("status") &&
            <div onClick={logOut}>
              <div className={`${liItemConStyles} ${hoverText}`}>
                <FontAwesomeIcon icon={faDoorOpen} className={faIconStyles} />
                {isOpen && <div className={liItemTextStyles}>Iziet</div>}
              </div>
            </div>
          }
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