import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle }  from "@fortawesome/free-solid-svg-icons"
import useWindowSize from "../../hooks/useWindowSize"

const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer text-neutral-400";
const faIconStyles = "w-6 h-6 group-hover:text-white";
const liItemTextStyles = " text-[1.05rem] font-metrophobic text-sm leading-6 text-neutral-300";

const darbibas1 = [
  "- Pievienota iespēja dzēst katalogu vai linku",
  "- salabota būtiska datubāzes funkciju nepilnība, kura atsevišķos gadījumos radīja iespēju lielākiem failiem nepievienoties to metadatiem"
]
const darbibas2 = [
  "- Pievienota iespēja rediģēt ierakstu datus",
]

export default function Navbar() {

  const [isOpen, setOpen] = useState(true);
  const size = useWindowSize();

  useEffect(()=> {
    setOpen(window.innerWidth < 1100 ? false : true);
  }, [])

  useEffect(() => {
    if(size.width < 1280 && isOpen) setOpen(false);
    else if (size.width >= 1280 && !isOpen) setOpen(!isOpen);
  }, [size])

  return(
    <div 
      className={`fixed transition-width ease-out duration-200 z-10
        flex flex-col bg-black gap-6 right-0 p-7 xl:static top-0 bottom-0 overflow-hidden
        ${isOpen 
          ? "min-w-[288px] max-w-[288px] min-h-screen" 
          : "min-w-[45px] sm:min-w-[80px] items-center bg-transparent xl:bg-black"}`}>
      <div className="fixed right-7 flex items-center sm:block">
        <FontAwesomeIcon icon={faInfoCircle} onClick={() => {setOpen(!isOpen)}}
          className={`${faIconStyles} 
          bg-black bg-opacity-30 hover:bg-opacity-100 rounded-full p-3 text-neutral-300 hover:text-white cursor-pointer`}/>
        </div>  
      <div className="fixed right-0 top-20 pl-6 pr-2 flex items-center xl:block max-w-[288px]">    
        {isOpen &&
          <div className="flex flex-col">
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip">V0.0004 17:00 17.05.2022</div>
            {darbibas1.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip pt-4">V0.0005 03:00 18.05.2022</div>
            {darbibas2.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
          </div>}
      </div>
    </div>
  )
}