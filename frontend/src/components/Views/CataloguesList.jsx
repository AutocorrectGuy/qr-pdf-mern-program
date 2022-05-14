import axios from "axios";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink, faCopy, faUser }  from "@fortawesome/free-solid-svg-icons"
import ReactTooltip from "react-tooltip";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function CatalogueList() {

  const [dataPart1, setDataPart1] = useState([]);
  const [dataPart2, setDataPart2] = useState([]);
  const [qrCodes1, setQRCoes1] = useState([]);
  const [qrCodes2, setQRCoes2] = useState([]);
  const [dataWithQR1, setDataWithQR1] = useState();
  const [dataWithQR2, setDataWithQR2] = useState();

  // fetch db data
  useEffect(() => {
    axios.get("/api/links/get-links-and-pdfs-ids")
      // save data from database
      .then(res => {
        if(res.data.length > 0) {
          let dataObj = JSON.parse(res.data);
          setDataPart1(dataObj.part1);
          setDataPart2(dataObj.part2);
        }
      })
    }, [])

  // generate qr-images for LINKS
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


  // generate qr-images for PDF-FILES
  useEffect(() => {
    if(dataPart2.length > 0) {
      let newQRCodes = []
      dataPart2.map(async pdfFile => {
        console.log(dataPart2);
        let colors = pdfFile.colors.split(",");
        newQRCodes.push(await QRCode.toDataURL(`${window.location.href}api/pdfs/${pdfFile._id}`, { 
          errorCorrectionLevel: "L",
          margin: 4, 
          color: { dark: colors[0], light: colors[1]}
        }));
      })
      setQRCoes2(newQRCodes);
    }
  }, [dataPart1])

  useEffect(() => {
    let oldData = dataPart2;    
    let newData = oldData.map((pdfFile, index) => {
      return ({
        _id: pdfFile._id,
        name: pdfFile.name,
        author: pdfFile.author,
        qrCode: qrCodes2[index]
      })

    })
    setDataWithQR2(newData)
  }, [qrCodes2])


  function PdfsList() {
    return(
      <div>
        <div className="p-10">
          <div className="text-white text-3xl font-bold my-8 cursor-default">Katalogu saraksts</div>
          
          <div className="flex flex-col items-center sm:items-stretch sm:grid justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
            {(dataWithQR2 !== undefined) && dataWithQR2.map((pdfFile, index) => 
              <DataCard 
                targetLink={`${window.location.href}api/pdfs/${pdfFile._id}`} 
                index={index} name={pdfFile.name} author={pdfFile.author} qrCode={pdfFile.qrCode} 
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  function LinksList() {
    return(
      <div>
        <div className="p-10">
            <div className="text-white text-3xl font-bold my-8 cursor-default">Ārējo adrešu un katalogu saraksts</div>
            <div className="flex flex-col items-center sm:items-stretch sm:grid justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
              {(dataWithQR1 !== undefined) && dataWithQR1.map((item, index) => 
                <DataCard key={`card-links-${index}`}
                  targetLink={item.link} 
                  index={index} name={item.name} author={item.author} qrCode={item.qrCode} 
                />
              )}
            </div>
        </div>
      <div className="text-white">{(dataWithQR1 === undefined) && "List data is loading..."}</div>
      </div>
    )
  }

  function DataCard({name, author, qrCode, targetLink, index}) {
    return(
      <div key={`link-db-${index}`} className="flex flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[300px] sm:max-w-[224px] w-full">
        <img className="w-full rounded-lg mb-4" src={qrCode}/>
        <div className="flex flex-col h-full justify-between">
          <div className="flex justify-between">
            <div className="text-neutral-100 font-metrophobic font-bold mb-2 cursor-default leading-5 line-clamp-2">
              {`${name}`}
            </div>
            <a href={targetLink} target="_blank" className="pl-1 text-neutral-500 hover:text-white cursor-pointer">
              <FontAwesomeIcon 
                data-tip data-for={`card-${name}-${author}`} 
                icon={faLink} 
                className={"w-5 h-5 text-neutral-600 hover:text-white active:translate-y-px"} />
            </a>
            <ReactTooltip 
              effect="solid" clickable={true} delayShow={300} delayHide={200} type={"dark"}
              id={`card-${name}-${author}`}> 
                <div className="flex gap-2">
                  <div className="cursor-default">{targetLink}</div>
                  <CopyToClipboard text={targetLink}>
                    <FontAwesomeIcon icon={faCopy} data-tip data-for={`pdf-link-copy-${index}`} 
                      className={"w-5 h-5 text-neutral-400 hover:text-white cursor-pointer active:translate-y-px"}/>
                  </CopyToClipboard>
                </div>
            </ReactTooltip>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <FontAwesomeIcon icon={faUser} className="text-neutral-500 w-3 h-3"/>
            <div className="text-neutral-500 text-sm leading-4 break-all line-clamp-2">
              {`${author}`}
            </div> 
          </div>
                   
        </div>  
      </div>
    )
  }

  return(
    <div className="relative flex justify-center w-full min-h-screen">
      <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-700 to-neutral-800 brightness-50 h-[400px]"></div>
      <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
      <div className="flex flex-col">
        <PdfsList />
        <LinksList />
      </div>
    </div>
  )
}