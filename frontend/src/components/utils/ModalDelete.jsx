import axios from "axios";
import { useState } from "react";

export default function ModalDelete({setDeleteModalOpen, name, id, type}) {

  const [inputValue, setInputValue] = useState("");
  
  function handleClick() {
    if (inputValue !== name) return;
    axios.delete(`/api/${type}/delete/${id}`)
      .then(() => {
        window.location = '/';
      })
  }

  return(
  <div>
    <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center bg-black bg-opacity-90 z-20"
      onClick={() => setDeleteModalOpen(false)}>
    </div>
    <div className="fixed right-1/2 translate-x-1/2 top-6 flex flex-col p-10 bg-neutral-700 text-white rounded-sm shadow-lg shadow-neutral-900 max-w-[450px] w-full z-20">
      <div className="pb-10 pt-5 text-3xl font-bold border-b border-b-neutral-600">{`${type === "pdfs" ? "Katalog" : "Link"}a dzēšana`}</div>
      <div className="flex flex-col py-10 border-b border-b-neutral-600">
        <div className="mb-3">
          <label className="leading-5 text-sm text-neutral-200 font-normal float-left">{`Ja tiešām vēlaties dzēst ${type === "pdfs" ? "katalog" : "kink"}u`}&nbsp;</label>
          <label className="leading-5 text-sm text-white font-bold float-left cursor-text">{`"${name}", `}&nbsp;</label>
          <label className="leading-5 text-sm text-neutral-200 font-normal float-left">{`veiciet apstiprinājumu, ievadot šī ${type === "pdfs" ? "katalog" : "link"}a nosaukumu`}</label>
        </div>
        <input type="text" placeholder={`Ievadiet ${type === "pdfs" ? "katalog" : "link"}a nosaukumu`}
          className="bg-neutral-600 text-white text-sm placeholder:text-neutral-400 p-2 rounded-sm"
          onChange={(e) => setInputValue(e.target.value)}
          ></input>
      </div>
      <div className="flex items-center justify-end gap-3 mt-10">
        <div className="flex py-2 px-4 rounded-sm select-none text-white cursor-pointer bg-neutral-500 shadow-sm shadow-neutral-800 active:translate-y-px"
          onClick={() => setDeleteModalOpen(false)}
        >
          Atcelt
        </div>
        <div className={`${inputValue === name ? "bg-red-600 hover:bg-red-500 shadow-sm shadow-neutral-800 active:translate-y-px cursor-pointer" 
          : "bg-neutral-600 cursor-not-allowed"}
          flex py-2 px-4 rounded-sm select-none text-white`}
          onClick={handleClick}
        >Dzēst</div>
      </div>
    </div>
  </div>);
}