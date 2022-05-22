import axios from "axios";
import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import Card from "../utils/Card"
import { useNavigate } from "react-router-dom";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"
import { ToastContainer, toast } from "react-toastify";
import { toastPropsRegular, tostConPropsRegular} from "../utils/ToastProps"
import { useCookies } from "react-cookie";
import { devModeCheck } from "../../demodeCheck";

export default function CatalogueList() {

  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const devMode = useRef(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [dataPart1, setDataPart1] = useState([]);
  const [dataPart2, setDataPart2] = useState([]);
  const [qrCodes1, setQRCoes1] = useState([]);
  const [qrCodes2, setQRCoes2] = useState([]);
  const [dataWithQR1, setDataWithQR1] = useState(null);
  const [dataWithQR2, setDataWithQR2] = useState(null);
  const [userData, setUserData] = useState([]);

  useEffect(() => { 
    devModeCheck(devMode, cookies, navigate);
    axios.get("/api/links/get-links-and-pdfs-ids")
      .then(res => {
        // convert convert json object to javascript object
        let dataObj = JSON.parse(res.data);

        // Lock 1: recieved empty OBJECT from DATABASE
        if(res.data.length === 0) navigate("/login");
        // Lock 2: token did not pass verification test
        if(!devMode.current)
          if(dataObj.token === {} || dataObj.token === undefined) navigate("/login")
        
        // result
        console.log("data");
        console.log(res.data);
        setUserData(devMode.current ? cookies.jwtdev : dataObj?.token);
        setDataPart1(dataObj?.part1)
        setDataPart2(dataObj?.part2);
      })
      .catch(function (error) {
        if(devMode.current) return;
        if(error.response.status === 401 || 
          error.response.status === 403 || 
          error.response.status === 404) 
           navigate("/login");
        });
  }, []);
  


  useEffect(() => {
    console.log("Devmode: ",devMode.current);
    if (firstUpdate.current) { firstUpdate.current = false; return }
    if (cookies.hello !== undefined) {
      devMode.current 
        ? toast(`Sveiks, makaka`, toastPropsRegular)
        : toast(`Welocme, ${userData.username}`, toastPropsRegular)
      removeCookie("hello");
    }
    
  }, [userData])

  // generate qr-images for LINKS
  useEffect(() => {
    if (firstUpdate.current) { firstUpdate.current = false; return }
    
    if(dataPart1.length === 0) return;
    let newQRCodes = []
    dataPart1.map(async item => {
      newQRCodes.push(await QRCode.toDataURL(item.link, { 
        errorCorrectionLevel: "L", margin: 4, color: { dark: item.color1, light: item.color2}
      }));
    })
    setQRCoes1(newQRCodes);
  }, [dataPart1])

  useEffect(() => {
    let oldData = dataPart1;
    oldData.map((item, index) => 
      item.qrCode = qrCodes1[index]
    )
    setDataWithQR1(oldData)
  }, [qrCodes1])

  // generate qr-images for PDF Files
  useEffect(() => {
    if(dataPart2.length === 0) return;
    let newQRCodes = [];
    dataPart2.map(async item => {
      let colors = item.colors.split(",");
      newQRCodes.push(await QRCode.toDataURL(`${window.location.href}api/pdfs/file/${item._id}`, { 
        errorCorrectionLevel: "L", margin: 4, color: { dark: colors[0], light: colors[1]}
      }));
    })
    setQRCoes2(newQRCodes);
  }, [dataPart2])

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
            {(dataWithQR2 !== null) && dataWithQR2.map((pdfFile, index) => 
              <Card key={`card-pdfs-${index}`}  
                outsideHref={`${window.location.href}api/pdfs/file/${pdfFile._id}`} 
                insideHref={`/pdfs/${pdfFile._id}`} 
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
            <div className="text-white text-3xl font-bold my-8 cursor-default">{process.env.REACT_APP_TEST}</div>
            <div className="flex flex-col items-center sm:items-stretch sm:grid justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6">
              {(dataWithQR1 !== null) && dataWithQR1.map((item, index) => 
                <Card key={`card-links-${index}`} 
                  outsideHref={item.link} 
                  insideHref={`/links/${item._id}`} 
                  index={index} name={item.name} author={item.author} qrCode={item.qrCode} 
                />
              )}
            </div>
        </div>
      <div className="text-white">{(dataWithQR1 === null) && "List data is loading..."}</div>
      </div>
    )
  }

  return(
    <>
    <NavLeft />
    <div className="relative flex justify-center w-full min-h-screen">
      <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-700 to-neutral-800 brightness-50 h-[400px]"></div>
      <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
      <div className="flex flex-col">
        <div> 
          {
          userData ? <div className="text-white">{userData.username}</div>
          :<div className="text-red-400">User data not recieved!</div>
          }
        </div>
        <PdfsList />
        <LinksList />
      </div>
    </div>
    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}
      newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover
    />
    <NavRight />
    </>
  )
}