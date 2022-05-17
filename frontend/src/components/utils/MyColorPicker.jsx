import { SketchPicker } from "react-color";
import { useState } from "react";

export default  function MyColorPicker({labelName, color, colorInex, outputColorRef}) {
  const [col1, setCol1] = useState(color);
  const [open1, setOpen1] = useState(false);
  
  function onColorChangeComplete(color) {
    setCol1(color.hex);
    outputColorRef.current[colorInex] = color.hex;
  }

  return(
    <div className="flex h-fit" onMouseMove={(e) => {e.preventDefault()}}>
      <div 
        onClick={()=> {setOpen1(!open1)}}
        className={`w-8 h-8 transition-colors duration-300 rounded-md z-0`}
        style={{backgroundColor: col1}} 
      ></div>
      <div className="pl-2 text-neutral-200 stroke-black pr-2">{labelName}</div>
      {open1 && 
        <div>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-90 transition-opacity duration-300 z-40"
            onClick={() => {setOpen1(false)}}
          >
          </div>
            <SketchPicker 
              className="w-full scale-125 fixed border top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 overflow-hidden bg-red-600 z-50"  
              color={col1} 
              onChange={(color) => setCol1(color.hex)}
              onChangeComplete={(color) => onColorChangeComplete(color)}
            />
        </div>
      }
    </div>
  );
}
