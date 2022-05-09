import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle }  from "@fortawesome/free-solid-svg-icons"
import useWindowSize from "../../hooks/useWindowSize"

const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer text-neutral-400";
const faIconStyles = "w-6 h-6 group-hover:text-white";
const liItemTextStyles = " text-[1.05rem] font-semibold font-metrophobic font-light text-neutral-300";

const darbibas1 = [
  "- Datu bāze un šis heroku projekts ir palaisti", 
  `- Iespējams pievienot katalogu "adreses"`,
]
const darbibas2 = [
  "- Lapu iespējams izmantot arī no ierīcēm ar mazākiem ekrāniem",
  "- Uzlabots responsiveness noformējums kataloga kartiņām un navigacijai"
]

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

  function toggleKebab() {
    setOpen(!isOpen);
  }
  

  return(
    <div 
      className={`transition-width ease-out duration-300 z-10 
        flex flex-col bg-black gap-6 h-fit fixed right-0 p-3 sm:p-7 sm:static sm:min-h-screen 
        ${isOpen 
          ? "min-w-[288px] max-w-[288px] min-h-screen" 
          : "min-w-[45px] sm:min-w-[80px] items-center bg-transparent sm:bg-black"}`}>
      <div className="flex items-center sm:block max-w-[288px]"
        onClick={toggleKebab}
      >
        <div>
          <div className="flex justify-end">
          <FontAwesomeIcon icon={faInfoCircle} 
            className={`${faIconStyles} 
            bg-black bg-opacity-30 hover:bg-opacity-100 rounded-full p-3 sm:p-0 text-neutral-300 hover:text-white cursor-pointer`}/>
            </div>      

        {isOpen &&
          <div className="flex flex-col">
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip">V0.0001 10:00 05.09.2022</div>
            {darbibas1.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip pt-4">V0.0002 15:00 05.09.2022</div>
            {darbibas1.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
          </div>}
        </div>
      </div>

  
    
    </div>
  )
}