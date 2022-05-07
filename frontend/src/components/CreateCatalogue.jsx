import { useEffect, useState } from "react"
import axios from "axios";

export default function CreateCatalogue() {

  let [data, setData] = useState();

  /**
   * on key change save input value to react state variable
   */
  function onChangeCallback(e) {
    console.log(e.target.value);
    setData({
      catalogue: e.target.value
    });
  }

  /**
   * !U#Y!@#&!---- SUMBIT POST DATA TO THE DATABASE ----!#&##Y!&@#!
   */
  function onSubmit(e) {
    e.preventDefault();
    console.log("Before posting to db: ", data);
    
    axios.post("http://localhost:3001/catalogues/add", data)
      .then(res => console.log(res.data))
      .catch(err => console.log(`Error ${err}`));
  }

  return(
    <div className="pt-12 flex items-center justify-center min-h-screen bg-teal-900">
      <form onSubmit={(e) => onSubmit(e)}
      className="flex flex-col gap-1 max-w-sm w-full bg-cyan-900 rounded-md p-3 shadow-sm shadow-neutral-800">
        <label 
          className="text-neutral-200" 
        >
          Input catalogue name
        </label>
        <input 
          
          type="text" name="catalogue" 
          className="px-3 bg-neutral-800 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-500"
          placeholder="catalogue-name"
          onChange={(e)=>onChangeCallback(e)}
        />
        <button 
          type="sumbit"
          onSubmit={(e) => onSubmit(e)}
          className="text-white bg-rose-700 hover:bg-rose-600 rounded-md px-4 py-1 mx-auto mt-2 shadow-sm shadow-neutral-800 active:translate-y-px"
        >
          Submit
        </button>
      </form>
    </div>
  )
}