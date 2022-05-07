import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Link } from "react-router-dom";

export default function CatalogueList() {

  const [data, setData] = useState([]);
  const [qrCodes, setQRCoes] = useState([]);
  const [dataWithQR, setDataWithQR] = useState();



  // get data from db
  useEffect(() => {
    axios.get("http://localhost:3001/catalogues")
      // save data from database
      .then(res => {
        if(res.data.length > 0) setData(res.data)
      })
    }, [])

  // get qr codes
  useEffect(() => {
    if(data.length > 0) {
      let newQRCodes = []
      data.map(async item => {
        newQRCodes.push(await QRCode.toDataURL(`http://localhost:3001/catalogues/${item._id}`));
      })
      setQRCoes(newQRCodes);
    }
  }, [data])

  useEffect(() => {
    let oldData = data;
    oldData.map((item, index) => {
      item.qrCode = qrCodes[index]
    })
    setDataWithQR(oldData)
  }, [qrCodes])

  // QRCode.toDataURL(stringToChange);

  function CatalogueList() {
    return(
      <div>
        <div className="grid grid-cols-2 gap-2">
          {(dataWithQR !== undefined) && dataWithQR.map((item, index) => 
            <CatalogueCard imgSrc={item.qrCode} key={`qr-card-${index}`} id={item._id}  name={item.catalogue}/>
          )}
        </div>
      <div className="text-white">{(dataWithQR === undefined) && "List data is loading..."}</div>
      </div>
      
    )
  }
  function CatalogueCard({imgSrc, id, name}) {
    return(
      <div className="flex flex-row border border-black p-2 rounded-md bg-neutral-400">
        <div className="w-14 h-14">
          <img className="flex w-full h-full" src={imgSrc} />
        </div>
        <div className="flex flex-col">
          <div className="flex border border-black">{name}</div>
          <Link to={`/catalogues/${id}`}>{id}</Link>
        </div>  
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-neutral-800">
      <div className="pt-12 flex justify-center">
        <div className="flex flex-col">
          <div className="text-white text-center my-5 font-mono">This is the  Catalogue list!</div>
          <CatalogueList />
        </div>
      </div>
    </div>
  )
}