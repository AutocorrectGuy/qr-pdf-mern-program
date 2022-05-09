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
        newQRCodes.push(await QRCode.toDataURL(`/catalogues/${item.link}`));
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
        <div className="p-10">
            <div className="text-white text-3xl font-bold my-8 cursor-default">Katalogu saraksts</div>
            <div className="grid justify-center sm:justify-start gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
              {(dataWithQR !== undefined) && dataWithQR.map((item, index) => 
                <CatalogueCard imgSrc={item.qrCode} key={`qr-card-${index}`} id={item._id}  name={item.name} link={item.link}/>
              )}
            </div>

        </div>
      <div className="text-white">{(dataWithQR === undefined) && "List data is loading..."}</div>
      </div>
      
    )
  }
  function CatalogueCard({imgSrc, id, name, link}) {
    return(
      <div className="flex flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[224px] w-full">
        <img className="w-full rounded-lg pb-4" src={imgSrc} />
        <div className="flex flex-col">
          <div className="text-neutral-100 font-bold mb-2 cursor-default leading-5 line-clamp-2">
            {name}
          </div>
          <a className="text-neutral-500 hover:text-white text-sm cursor-pointer leading-4 break-all line-clamp-2 " href={link}>
            {link}
          </a>
        </div>  
      </div>
    )
  }

  return(
    <div className="relative flex justify-center w-full min-h-screen">
      <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-700 to-neutral-800 brightness-50 h-[400px]"></div>
      <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
      <div className="flex flex-col">
        <CatalogueList />
      </div>
    </div>
  )
}