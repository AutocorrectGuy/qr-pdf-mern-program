import { useParams } from "react-router-dom"
import { useState, useEffect,useRef } from "react";
import QRCode from "qrcode";
import axios from "axios";
import ModalDelete from "../utils/ModalDelete";

const dataKeys = {
  name: "Nosaukums", 
  author: "Autors", 
  _id: "Id", 
  uploadDate: "Publicesanas datums", 
  filename: "Faila kriptetais nosaukums", 
  color1: "QR koda raksts", 
  color2: "QR koda fons"
}

const wrapperClass    = "flex flex-col sm:flex-row px-2 hover:bg-neutral-400 hover:bg-opacity-10 rounded-sm";
const textLeftClass   = "text-neutral-400 select-none w-[200px] sm:w-[230px] py-2";
const textRightClass  = "text-neutral-100 py-2";

export default function Test() {
  const params = useParams();

  const [data, setData] = useState([]);
  const [qrCode, setQRCode] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const firstUpdate = useRef(true);


  useEffect(() => {
    function getAxiosData() {
      axios.get(`/api/pdfs/json/${params.id}`)
        .then((res) => { setData(res.data) })
        .catch((err) => { console.log(`Error ${err}`) })
    }
    getAxiosData();
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    let colors = data.metadata.colors.split(",");
    QRCode.toDataURL(
      window.location.href, { 
      errorCorrectionLevel: "L", 
      margin: 4, color: { dark: colors[0], light: colors[1]}
    }).then((data) => setQRCode(data));
  }, [data])



  return(
    <div className="relative flex flex-col w-full min-h-screen">
      <div className={`absolute -z-10 flex justify-center max-w-screen w-full brightness-[25%] h-[300px]`}
      style={{background: `linear-gradient(${data.length !== 0 ? data.metadata.colors.split(",")[1] : "#52525b"}, #52525b)`}}></div>
      <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-600 brightness-[25%] max-h-max h-full"></div>
      {/* Actual content */}
      <div className="flex w-full p-8">
        {qrCode.length !== 0 && 
          <div className="hidden sm:block sm:my-auto sm:max-w-[148px] sm:max-h-[148px] sm:w-full sm:h-full">
            <img src={qrCode} className="object-contain"/>
          </div>
        }
        {data.length !== 0 &&
          <div className="flex flex-col justify-end gap-3 w-full pl-8">
             <div className="text-white text-lg font-semibold uppercase">Katalogs</div>
             <div className="text-white text-4xl font-bold">{data.metadata.name}</div>
             <div className="text-white text-lg font-semibold">{data.metadata.author}</div>
          </div>
        }
      </div>
      {data.length !== 0 &&
        <div className="flex flex-col">
          <div className="flex flex-col w-full p-8 font-semibold text-sm sm:text-base">
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.name}</div>
              <div className={textRightClass}>{data.metadata.name}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.author}</div>
              <div className={textRightClass}>{data.metadata.author}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys._id}</div>
              <div className={textRightClass}>{data._id}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.filename}</div>
              <div className={textRightClass}>{data.filename}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.color1}</div>
              <div className={textRightClass}>{data.metadata.colors.split(",")[0]}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.color2}</div>
              <div className={textRightClass}>{data.metadata.colors.split(",")[1]}</div>
            </div>
            <div className={wrapperClass}>
              <div className={textLeftClass}>{dataKeys.uploadDate}</div>
              <div className={textRightClass}>{data.uploadDate}</div>
            </div>
            <div className="py-8">
              <div className="flex w-fit px-6 py-3 text-red-500 bg-neutral-700 hover:bg-neutral-600 select-none rounded-md cursor-pointer active:translate-y-px shadow-sm shadow-neutral-800"
                onClick={() => setDeleteModalOpen(true)}
              >
                Izdzēst katalogu
              </div>
              {deleteModalOpen && 
                <ModalDelete 
                  deleteModalOpen={deleteModalOpen}  
                  setDeleteModalOpen={setDeleteModalOpen} 
                  name={data.metadata.name}
                  id={params.id}
                />
              }
            </div>
          </div>
        </div>
      }
    </div>
  );
}