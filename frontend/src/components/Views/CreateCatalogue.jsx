import { useRef, useState } from "react"
import axios from "axios";
import { ChromePicker } from 'react-color';


export default function CreateCatalogue() {

  let [data, setData] = useState();
  let outputColors = useRef(["#000000", "#FFFFFF"]);
  let inputName = useRef(null);
  let inputLink = useRef(null);

  /**
   * on key change save input value to react state variable
   */
  function onChangeCallback(e, inputTarget) {
    console.log(e.target.value);
    inputTarget.current = e.target.value;
  }

  /**
   * !U#Y!@#&!---- SUMBIT POST DATA TO THE DATABASE ----!#&##Y!&@#!
   */
  function onSubmit(e) {
    e.preventDefault();
    console.log("Before posting to db: ", {
      name: inputName.current, 
      link: inputLink.current,
      color1: outputColors.current[0],
      color2: outputColors.current[1]
    });
    
    axios.post("/catalogues/add", {
      name: inputName.current, 
      link: inputLink.current,
      color1: outputColors.current[0],
      color2: outputColors.current[1]
    })
      .then(res => {
        console.log(res.data)
        window.location = '/';
      })
      .catch(err => console.log(`Error ${err}`));
  }

  function ColorPalette({labelName, color, colorInex}) {
    const [col1, setCol1] = useState(color);
    const [open1, setOpen1] = useState(false);
    
    function onColorChangeComplete(color) {
      setCol1(color.hex);
      outputColors.current[colorInex] = color.hex;
    }

    return(
      <div className="relative flex h-fit" onMouseMove={(e) => {e.preventDefault()}}>
        <div 
          onClick={()=> {setOpen1(!open1)}}
          className={`w-8 h-8 transition-colors duration-300 rounded-md z-0`}
          style={{backgroundColor: col1}} 
        ></div>
        <div className="pl-2 text-neutral-200 stroke-black pr-2">{labelName}</div>
        {open1 && 
          <div className="bg-green-400">
            <div className="fixed top-0 left-0 w-full h-full bg-black opacity-90 transition-opacity duration-300 z-40"
              onClick={() => {setOpen1(false)}}
            ></div>
            <div className="absolute ml-3 -top-[280px] left-0 w-56 h-56 z-50 text-white uppercase font-bold text-center">{labelName}</div>
            <div className="absolute ml-3 -top-60 left-0 w-56 h-56 rounded-md z-50" style={{backgroundColor: col1}}></div>
            <ChromePicker 
              className="absolute ml-3 top-0 left-0 overflow-hidden h-48 bg-red-600 z-50" 
              color={col1} 
              onChange={(color) => setCol1(color.hex)}
              onChangeComplete={(color) => onColorChangeComplete(color)}
            />
          </div>
        }
      </div>
    );
  }

  return(
      <div className="relative flex justify-center w-full min-h-screen px-6">
        <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-teal-900 brightness-50 to-neutral-800 h-[300px]"></div>
        <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
        <div className="flex max-w-md w-full items-center">

          <form onSubmit={(e) => onSubmit(e)}

            className="flex w-full my-auto flex-col text-xl bg-neutral-800 bg-opacity-40 rounded-md p-8 h-fit">
            <label className="text-neutral-200 pb-1">
              Kataloga nosaukums
            </label>
            <input 
              type="text" name="name" 
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="..."
              onChange={(e)=>onChangeCallback(e, inputName)}
            />

            <label className="text-neutral-200 pt-6 pb-1">
              Kataloga adrese/links
            </label>
            <input 
              type="text" name="link" 
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="https://..."
              onChange={(e)=>onChangeCallback(e, inputLink)}
            />

            <div className="flex flex-col gap-4 mt-8">
              <ColorPalette labelName="raksta krāsa" color={"#000000"} colorInex={0}/>
              <ColorPalette labelName="fona krāsa" color={ "#FFFFFF"} colorInex={1}/>
            </div>

            <button 
              type="sumbit"
              onSubmit={(e) => onSubmit(e)}
              className="text-white bg-rose-700 hover:bg-rose-600 rounded-md px-8 py-4 mx-auto mt-8 shadow-sm shadow-neutral-800 active:translate-y-px"
            >
              Pievienot
            </button>
          </form>


        </div>
      </div>
  )
}