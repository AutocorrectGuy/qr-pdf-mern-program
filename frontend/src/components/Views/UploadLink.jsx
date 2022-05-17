import { useRef, useState } from "react"
import axios from "axios";
import { ChromePicker } from 'react-color';
import MyColorPicker from "../utils/MyColorPicker";


export default function UploadLink() {

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
      color2: outputColors.current[1],
      author: "Developer"
    });
    
    axios.post("/api/links/upload", {
      name: inputName.current, 
      link: inputLink.current,
      color1: outputColors.current[0],
      color2: outputColors.current[1],
      username: "Developer"
    })
      .then(res => { window.location = '/' })
      .catch(err => console.log(`Error ${err}`));
  }


  return(
      <div className="relative flex justify-center w-full min-h-screen px-6">
        <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-teal-900 brightness-50 to-neutral-800 h-[300px]"></div>
        <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
        <div className="flex max-w-md w-full items-center">

          <form onSubmit={(e) => onSubmit(e)}

            className="flex w-full my-auto flex-col text-lg bg-neutral-800 bg-opacity-40 rounded-md p-8 h-fit">
            <label className="text-neutral-200 pb-1">
              Kataloga nosaukums
            </label>
            <input 
              type="text" name="name" autoComplete="off"
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="..."
              onChange={(e)=>onChangeCallback(e, inputName)}
            />

            <label className="text-neutral-200 pt-6 pb-1">
              Kataloga adrese/links
            </label>
            <input autoComplete="off"
              type="text" name="link" 
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="https://..."
              onChange={(e)=>onChangeCallback(e, inputLink)}
            />

            <div className="flex flex-col gap-2 mt-8">
              <MyColorPicker labelName="raksta krāsa" color={"#000000"} colorInex={0} outputColorRef={outputColors}/>
              <MyColorPicker labelName="fona krāsa" color={ "#FFFFFF"} colorInex={1} outputColorRef={outputColors}/>
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