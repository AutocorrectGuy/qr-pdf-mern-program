import { Link } from "react-router-dom"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripHorizontal, faHomeAlt, faInfoCircle }  from "@fortawesome/free-solid-svg-icons"

const liItemConStyles = "flex gap-4 h-10 items-center cursor-pointer text-neutral-400";
const faIconStyles = "w-6 h-6 group-hover:text-white";
const liItemTextStyles = " text-[1.05rem] font-semibold font-metrophobic font-light text-neutral-300";

const darbibas = [
  "- Datu bāze un šis heroku projekts ir palaisti", 
  `- Iespējams pievienot katalogu "adreses"`
]

export default function Navbar() {

  const [isHovering, setIsHovered] = useState([false, false, false, false, false]);
  function onMouseEnter(e, index) { 
    setIsHovered(() => {
      let states = isHovering;
      states[index] = true;
      return [...states];
    })
  }
  function onMouseLeave(e, index) { 
    let states = isHovering;
    states[index] = false;
    setIsHovered(() => {
      return [false, false, false, false, false];
    })
  }

  return(
    <div className="flex flex-col w-full max-w-[300px] min-w-[228px] bg-black p-7 gap-6 min-h-screen">
      <div className={`${liItemConStyles} justify-between`}>
        <div className={liItemTextStyles}>Informcijas panelis</div>
        <FontAwesomeIcon icon={faInfoCircle} className={faIconStyles}/>
      </div>
      <div className={liItemTextStyles}>V0.0001 10:00 05.09.2022</div>
      {darbibas.map((item, i) => <div key={`darbiba-${i}`} className={liItemTextStyles}>{item}</div>)}
    </div>
  )
}