import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Link } from "react-router-dom";

export default function CatalogueList() {

  const [dataPart1, setDataPart1] = useState([]);
  const [dataPart2, setDataPart2] = useState([]);
  const [qrCodes1, setQRCoes1] = useState([]);
  const [qrCodes2, setQRCoes2] = useState([]);
  const [dataWithQR1, setDataWithQR1] = useState();
  const [dataWithQR2, setDataWithQR2] = useState();

  // get data from db
  useEffect(() => {
    axios.get("/catalogues")
      // save data from database
      .then(res => {
        if(res.data.length > 0) {
          let dataObj = JSON.parse(res.data);
          setDataPart1(dataObj.part1);
          setDataPart2(dataObj.part2);
        }
      })
    }, [])

  // get qr codes1
  useEffect(() => {
    if(dataPart1.length > 0) {
      let newQRCodes = []
      dataPart1.map(async item => {
        newQRCodes.push(await QRCode.toDataURL(item.link, { 
          errorCorrectionLevel: "L",
          margin: 4, 
          color: { dark: item.color1, light: item.color2}
        }));
      })
      setQRCoes1(newQRCodes);
    }
  }, [dataPart1])
  useEffect(() => {
    let oldData = dataPart1;
    oldData.map((item, index) => {
      item.qrCode = qrCodes1[index]
    })
    setDataWithQR1(oldData)
  }, [qrCodes1])


  // get qr codes2
  useEffect(() => {
    if(dataPart2.length > 0) {
      let newQRCodes = []
      dataPart2.map(async fileId => {
        newQRCodes.push(await QRCode.toDataURL(`${window.location.href}api/pdf/${fileId}`, { 
          errorCorrectionLevel: "L",
          margin: 4, 
          color: { dark: "#000000", light:  "#FFFFFF"}
        }));
      })
      setQRCoes2(newQRCodes);
    }
  }, [dataPart1])

  useEffect(() => {
    let oldData = dataPart2;    
    let newData = oldData.map((fileId, index) => {
      return ({
        _id: fileId,
        qrCode: qrCodes2[index]
      })

    })
    setDataWithQR2(newData)
  }, [qrCodes2])

  // QRCode.toDataURL(stringToChange);

  function CatalogueList() {
    return(
      <div>
        <div className="p-10">
            <div className="text-white text-3xl font-bold my-8 cursor-default">Katalogu saraksts</div>
            <div className="grid justify-center sm:justify-start gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
              {(dataWithQR1 !== undefined) && dataWithQR1.map((item, index) => 
                <CatalogueCard imgSrc={item.qrCode} key={`qr-card-${index}`} id={item._id}  name={item.name} link={item.link}/>
              )}
            </div>
        </div>
      <div className="text-white">{(dataWithQR1 === undefined) && "List data is loading..."}</div>
      </div>
    )
  }

  function Catalogue2List() {
    return(
      <div>
        <div className="p-10">
          <div className="text-white text-3xl font-bold my-8 cursor-default">Katalogu saraksts</div>
          <div className="grid justify-center sm:justify-start gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            
            {(dataWithQR2 !== undefined) && dataWithQR2.map((item, index) => 
            {
              console.log(dataWithQR2);
              return(
                <div key={`link-db-${index}`} className="flex flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[224px] w-full">
                <img className="w-full rounded-lg mb-4" src={item.qrCode}/>
                  <div className="flex flex-col">
                    <div className="text-neutral-100 font-metrophobic font-bold mb-2 cursor-default leading-5 line-clamp-2">
                      {`Katalogs-${index}`}
                    </div>
                    <a href={`${window.location.href}/api/pdf/${item._id}`} className="text-neutral-500 hover:text-white text-sm cursor-pointer leading-4 break-all line-clamp-2 ">{item._id}</a>
                  </div>  
              </div>
              )
            }

            )}
          </div>
        </div>
      </div>
    );
  }

  function CatalogueCard({imgSrc, id, name, link}) {
    return(
      <div className="flex flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[224px] w-full">
        <img className="w-full rounded-lg mb-4 " src={imgSrc} />
        <div className="flex flex-col">
          <div className="text-neutral-100 font-metrophobic font-bold mb-2 cursor-default leading-5 line-clamp-2">
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
        <Catalogue2List />
        <CatalogueList />
      </div>
    </div>
  )
}