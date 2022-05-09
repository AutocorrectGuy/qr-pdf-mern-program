import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CatalogueList() {
  const params = useParams();

  const [data, setData] = useState([]);
  useEffect(() => {
    getBlogPost();
  }, [])

  function getBlogPost() {
    axios.get(`/catalogues/${params.id}`)
      .then((res) => { setData(res.data) })
      .catch((err) => { console.log(`Error ${err}`) })
  }

  return(    
    <div className="pt-14 flex flex-col items-center bg-rose-900">
      <div className="flex flex-col bg-white max-w-7xl w-full shadow-xl shadow-neutral-800 min-h-screen">
        <div className="flex justify-between mx-3">
          <div className="text-black font-mono my-4 text-center">
            {(data.length === 0) ? "Loading..." : `Kataloga nosaukums: "${data.catalogue}"`}
          </div>
          <div className="text-black font-mono mt-4 text-center">
            {(data.length === 0) ? "Loading..." : `id: ${data._id}`}
          </div>
        </div>
        <div className="flex justify-center items-center h-72 bg-black text-white">PDF-saturs darbiniekam:... apraksts... 
          <div className="flex bg-red-500 px-2 py-1 m-2 rounded-md cursor-pointer">Atvērt pdf failu</div>
        </div>
      </div>
    </div>
  );
}