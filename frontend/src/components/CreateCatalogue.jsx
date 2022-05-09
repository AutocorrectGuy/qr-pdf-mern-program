import { useRef, useState } from "react"
import axios from "axios";

export default function CreateCatalogue() {

  let [data, setData] = useState();
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
      link: inputLink.current
    });
    
    axios.post("/catalogues/add", {
      name: inputName.current, 
      link: inputLink.current
    })
      .then(res => {
        console.log(res.data)
        window.location = '/';
      }
      )
      .catch(err => console.log(`Error ${err}`));
  }

  return(
      <div className="relative flex justify-center w-full min-h-screen">
        <div className="absolute -z-10 flex justify-center w-screen bg-gradient-to-b from-teal-900 brightness-50 to-neutral-800 h-[300px]"></div>
        <div className="absolute -z-20 flex justify-center w-screen bg-neutral-800 brightness-50 max-h-max h-full"></div>
        <form onSubmit={(e) => onSubmit(e)}
        className="flex flex-col text-xl gap-1 max-w-lg w-full mt-52 bg-neutral-800 bg-opacity-40 rounded-md p-10 shadow-sm shadow-neutral-800 h-fit">
          <label className="text-neutral-200 pb-1">
            Kataloga nosaukums
          </label>
          <input 
            type="text" name="name" 
            className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
            placeholder="kataloga-nosaukums"
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
          <button 
            type="sumbit"
            onSubmit={(e) => onSubmit(e)}
            className="text-white bg-rose-700 hover:bg-rose-600 rounded-md px-8 py-4 mx-auto mt-8 shadow-sm shadow-neutral-800 active:translate-y-px"
          >
            Pievienot
          </button>
        </form>
      </div>
  )
}