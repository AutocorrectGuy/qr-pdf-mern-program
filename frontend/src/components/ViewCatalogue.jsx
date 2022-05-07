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
    axios.get(`http://localhost:3001/catalogues/${params.id}`)
      .then((res) => { setData(res.data) })
      .catch((err) => { console.log(`Error ${err}`) })
  }

  return(    
    <div className="pt-12 flex flex-col items-center bg-rose-900 min-h-screen">
      <div className="text-white font-mono mt-4">This is a single catalogue</div>
      <div className="text-white">
        {(data.length === 0) ? "Loading..." : `Catalogue name: ${data.catalogue}`}
        </div>
    </div>
  );
}