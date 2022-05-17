import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle }  from "@fortawesome/free-solid-svg-icons"
import useWindowSize from "../../hooks/useWindowSize"

const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer text-neutral-400";
const faIconStyles = "w-6 h-6 group-hover:text-white";
const liItemTextStyles = " text-[1.05rem] font-metrophobic text-sm leading-6 text-neutral-300";

const darbibas1 = [
  "- Pievienota iespēja atvērt failu vai linku jaunā cilnē noklikšķinot uz ķēdītes ikonas", 
  "- Pievienota iespēja apskatīt qr koda avotu - linku, paturot kursoru virs ķēdītes ikonas. Linku var nokopēt ar vienu klikšķi uz tam paredzētās ikonas", 
  "- Pdf faila augšuplādē iespējams pievienot metadatus (nosaukumu, autoru, qr koda krāsas)", 
  "- Pievienota iespēja atvērt un apskatīt katalogu un linku metadatus noklikšķinot uz tā nosaukuma (baltais teksts boldā)",
]
const darbibas2 = [
  "- Pievienota iespēja dzēst katalogu vai linku, to vispirms atverot noklikšķinot uz tā virsraksta (baltā teksta boldā)",
  `- Ir saņemta informācija, ka qr kodi ir vienādi un atšķiras tikai krāsas. Šis arguments tika testēts un pēc pārbaudes tika konstatēts, ka vienāds ir qr kodu augšējais kreisais stūris, jo visi qr kodi sākas vienādi - "qrkodi.herokuapp.com/api/.../..."`,
  "- salabota būtiska datubāzes funkciju nepilnība, kura atsevišķos gadījumos radīja iespēju lielākiem failiem nepievienoties to metadatiem"
]

export default function Navbar() {

  const [isOpen, setOpen] = useState(null);
  const size = useWindowSize();

  useEffect(()=> {
    console.log(window.innerWidth);
    setOpen(window.innerWidth < 1100 ? false : true);
  }, [])

  useEffect(() => {
    if(size.width < 1024 && isOpen) setOpen(false);
    else if (size.width >= 1024 && !isOpen) toggleKebab();
  }, [size])

  function toggleKebab() { setOpen(!isOpen) };

  function toggleKebab() { setOpen(!isOpen) };
  function closeKebabIfSmallScreen() {if(size.width < 640) setOpen(false)};
  

  return(
    <div 
      className={`fixed transition-width ease-out duration-300 z-10 flex flex-col bg-black
        gap-6 right-0 p-3 lg:p-7 lg:static top-0 bottom-0 
        ${isOpen 
          ? "min-w-[288px] max-w-[288px] min-h-screen" 
          : "min-w-[45px] sm:min-w-[80px] items-center bg-transparent lg:bg-black"}`}>
      <div className="flex items-center lg:block max-w-[288px]"
      >
        <div>
          <div className="flex justify-end">
          <FontAwesomeIcon icon={faInfoCircle} onClick={toggleKebab}
            className={`${faIconStyles} 
            bg-black bg-opacity-30 hover:bg-opacity-100 rounded-full p-3 sm:p-0 text-neutral-300 hover:text-white cursor-pointer`}/>
            </div>      

        {isOpen &&
          <div className="flex flex-col">
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip">V0.0003 10:00 16.05.2022</div>
            {darbibas1.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
            <div className="text-[1.05rem] font-semibold font-metrophobic text-neutral-500 truncate text-clip pt-4">V0.0004 17:00 17.05.2022</div>
            {darbibas2.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
          </div>}
        </div>
      </div>

  
    
    </div>
  )
}