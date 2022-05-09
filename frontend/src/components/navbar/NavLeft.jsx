import { Link } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripHorizontal, faHomeAlt, faFileMedical, faSearch, faFile, faFilePdf }  from "@fortawesome/free-solid-svg-icons"

const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer select-none text-neutral-400 hover:text-white transition ease-out duration-500 delay-100";
const faIconStyles = "w-6 h-6";
const liItemTextStyles = " text-[1.05rem] font-semibold font-metrophobic";

export default function Navbar() {

  const [isOpen, setOpen] = useState(true);

  function onHamburgerClick() {
    
  }
  return(
    <div className="flex flex-col min-w-[288px] bg-black p-7 gap-6 min-h-screen">
      <FontAwesomeIcon icon={faGripHorizontal} className={`${faIconStyles} text-neutral-300 hover:text-white cursor-pointer`}/>

      <div>
        <div className={liItemConStyles}>
          <FontAwesomeIcon icon={faHomeAlt} className={faIconStyles}/>
          <div className={liItemTextStyles}>
            <Link to="/">Sākums</Link>
          </div>
        </div>
        <div className={liItemConStyles}>
          <FontAwesomeIcon icon={faSearch} className={faIconStyles}/>
          <div className={`${liItemTextStyles} cursor-not-allowed`}>Meklēt</div>
        </div>
        <div className={liItemConStyles}>
          <FontAwesomeIcon icon={faFileMedical} className={faIconStyles}/>
          <div className={liItemTextStyles}>
            <Link to="/catalogues/add">Izveidot katalogu</Link>
          </div>
        </div>
      </div>

      <div className="border-b border-b-neutral-600 pb-4">
        <div className={liItemConStyles}>
          <FontAwesomeIcon icon={faFile} className={faIconStyles}/>
          <div className={`${liItemTextStyles} cursor-not-allowed`}>Tavi katalogi</div>
        </div>
        <div className={liItemConStyles}>
          <FontAwesomeIcon icon={faFilePdf} className={faIconStyles}/>
          <div className={`${liItemTextStyles} cursor-not-allowed`}>Noklusējuma katalogi</div>
        </div>
      </div>
    </div>
  )
}