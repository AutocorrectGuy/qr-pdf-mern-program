import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripHorizontal, faHomeAlt, faFileMedical, faSearch, faFile, faFilePdf, faFileUpload }  from "@fortawesome/free-solid-svg-icons"
import useWindowSize from "../../hooks/useWindowSize"

const hoverText = "hover:text-white transition-width ease-out duration-500 delay-100";
const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer select-none text-neutral-400";
const faIconStyles = "min-w-[24px] min-h-[24px]";
const liItemTextStyles = " text-[1.05rem] font-semibold font-metrophobic whitespace-nowrap truncate text-clip";


export default function Navbar() {

  const [isOpen, setOpen] = useState(null);
  const size = useWindowSize();

  useEffect(()=> {
    console.log(window.innerWidth);
    setOpen(window.innerWidth < 1100 ? false : true);
  }, [])

  useEffect(() => {
    if(size.width < 640 && isOpen) toggleKebab();
    else if (size.width >= 640 && !isOpen) toggleKebab();
  }, [size])

  function toggleKebab() { setOpen(!isOpen) };

  return(
    <div 
      className={`transition-width ease-out duration-300 z-10 
        flex flex-col bg-black gap-6 h-fit fixed p-3 sm:p-7 sm:static sm:min-h-screen 
        ${isOpen 
          ? "min-w-[288px] max-w-[288px] min-h-screen" 
          : "min-w-[45px] sm:min-w-[80px] items-center bg-transparent sm:bg-black"}`}>
      <div className="flex items-center sm:block"
        onClick={toggleKebab}
      >
        <FontAwesomeIcon icon={faGripHorizontal} 
          className={`${faIconStyles} 
          bg-black bg-opacity-30 hover:bg-opacity-100 rounded-full p-3 sm:p-0 text-neutral-300 hover:text-white cursor-pointer`}/>
      </div>

      <div className={`${!isOpen && "hidden sm:block"}`}>
        <div className="pb-4">
          <Link to="/">
            <div className={`${liItemConStyles} ${hoverText}`}>
              <FontAwesomeIcon icon={faHomeAlt} className={faIconStyles}/>
              { isOpen && <div className={`${liItemTextStyles} -translate-x-[3px]`}>Sākums</div> }
            </div>
          </Link>

          <div>
            <div className={`${liItemConStyles} cursor-not-allowed`}>
              <FontAwesomeIcon icon={faSearch} className={faIconStyles}/>
              { isOpen && <div className={liItemTextStyles}>Meklēt</div> }
            </div>
          </div>

          <Link to="/catalogues/add">
            <div className={`${liItemConStyles} ${hoverText}`}>
              <FontAwesomeIcon icon={faFileMedical} className={faIconStyles}/>
              { isOpen && <div className={liItemTextStyles}>Pievienot linku</div> }
            </div>
          </Link>

          {/* <Link to="/catalogues/upload"> */}
          <div>
            <div className={`${liItemConStyles} cursor-not-allowed`}>
              <FontAwesomeIcon icon={faFileUpload} className={faIconStyles}/>
              { isOpen && <div className={liItemTextStyles}>Augšuplādēt katalogu</div> }
            </div>
          </div>
          {/* </Link> */}

        </div>

        <div className={`${isOpen && "border-b border-b-neutral-600 pb-4"}`}>
          <div>
            <div className={`${liItemConStyles} cursor-not-allowed`}>
              <FontAwesomeIcon icon={faFile} className={faIconStyles}/>
              { isOpen && <div className={liItemTextStyles}>Tavi katalogi</div> }
            </div>
          </div>

          <div>
            <div className={`${liItemConStyles} cursor-not-allowed`}>
              <FontAwesomeIcon icon={faFilePdf} className={faIconStyles}/>
              { isOpen && <div className={liItemTextStyles}>Noklusējuma katalogi</div> }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}