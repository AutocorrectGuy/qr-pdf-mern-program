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
    axios.get("/catalogues")
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
        newQRCodes.push(await QRCode.toDataURL(`/catalogues/${item._id}`));
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
        <div className="flex flex-wrap justify-center gap-3">
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
      <div className="flex flex-row border border-neutral-400 p-4 gap-3 rounded-md bg-neutral-300 group-hover:text-white hover:bg-rose-600 max-w-[400px] w-full shadow-sm shadow-neutral-600">
        <img className="w-32 h-32" src={imgSrc} />
        <div className="flex flex-col">
          <div className="flex border-b border-b-neutral-600 font-bold mb-2 pb-1 text-lg cursor-default">{name}</div>
          <Link className="break-all text-neutral-600 hover:text-white" to={`/catalogues/${id}`}>{`Adrese: ${id}`}</Link>
        </div>  
      </div>
    )
  }

  return(
    <div className="flex min-h-screen bg-[#525659] justify-center">
      <div className="pt-14 flex justify-center bg-white max-w-7xl w-full shadow-xl shadow-neutral-800">
        <div className="flex flex-col">
          <div className="text-black text-2xl font-semibold text-center my-12 cursor-default">Katalogu saraksts</div>
          <CatalogueList />
        </div>
      </div>
    </div>
  )
}