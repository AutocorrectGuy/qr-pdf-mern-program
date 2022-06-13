import axios from "axios";
import { useEffect, useState, useRef, useContext, Children } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import NavLeft from "../navbar/NavLeft"
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faFileAlt } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "react-router-dom"
import QuestNavLeft from "../navbar/QuestNavLeft";

export default function ViewModelsFolder({folderName}) {
  const cardsPerPage = useRef(6);
  const pageCountPDF = useRef(0);
  const [pageOffsetPDF, setPageOffsetPDF] = useState(0);
  const [PDFdata, setPDFData] = useState(false);
  const [list, setList] = useState({});
  const params = useParams();
  const hrefAdressWithSpaces = useRef(params.id.replace(" ", "%20"));


  useEffect(() => {
    process.env.REACT_APP_NODE_ENV === 'development'
      && (axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL)

    const fetchData = async () => {
      let resString = "";
      try {
        resString = await axios.get(
          `/api/links/get-models`);
      } catch (err) {
        console.log(err);
      }
      let res = JSON.parse(resString.data);

      let itemsList = [];
      if(folderName === "es") {
        res.filesData.data.map(({ name, _id }) => {
          let nameToSearch = name.toUpperCase();
          const currentCatalogueName = params.id.toUpperCase();
          
          if (nameToSearch.search(currentCatalogueName) !== -1 && nameToSearch.endsWith("ES")) {
            itemsList.push(
              {name: name, _id: _id}
            )
          }
        })
      } else {
        res.filesData.data.map(({ name, _id }) => {
          let nameToSearch = name.toUpperCase();
          const currentCatalogueName = params.id.toUpperCase();
          
          if (nameToSearch.search(currentCatalogueName) !== -1 && !nameToSearch.endsWith("ES")) {
            itemsList.push(
              {name: name, _id: _id}
            )
          }
        })
      }
      
      setList(itemsList);

      setPDFData(res.filesData.data);
    }
    fetchData();
    console.log(params.id);
  }, []);

  const ToggableButton = ({ name, listItems }) => {
    return (
      <>
        {
          <div className={` text-black text-2xl font-semibold overflow-hidden w-full h-fit`} >
            {listItems.map((item, index2) =>
              <a 
                key={`li-${name}-${index2}`}
                href={`${window.location.href.replace(
                  folderName === "es" 
                    ? "/modelses" 
                    : "/models","").replace(`/${hrefAdressWithSpaces.current}`,"")}/api/pdfs/file/${item._id}`}
                target="_blank"
                rel="noreferrer"
                className={`hover:brightness-90 
                  flex justify-between px-4 py-4 items-center cursor-pointer
                  ${index2 % 2 
                    ? `${folderName === "es" 
                      ? "bg-green-300" 
                      : "bg-sky-300"}` 
                    : `${folderName === "es" 
                      ? "bg-green-500" 
                      : "bg-sky-500"}`}`
              }>
                <div className="flex justify-between gap-3 items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-black-600 w-7 h-7"/>
                  <div> {item.name} </div>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="text-black w-7 h-7 hover:text-blue-600" 
                  />
                </div>
              </a>
            )}
          </div>
        }
      </>

    )
  }

  return (
    // <> { Object.keys(userContextData).length === 0 ? <LoadingScreen /> :
    <>
      <QuestNavLeft />
      <div className="relative flex justify-center w-full min-h-screen">
        <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-600 to-neutral-800 brightness-50 h-[400px]"></div>
        <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
        <div className="flex flex-col w-full px-10">
          <div className="flex text-3xl text-white font-semibold uppercase my-16 mx-auto">{`Model ${params.id} catalogues`}</div>
          {
            list.length > 0 &&
            <div className="flex w-full mx-auto shadow-lg text-lg shadow-[#1a1a1a] border border-neutral-800">
              <div className="flex w-full flex-col">
                <ToggableButton 
                  name={params.id} 
                  listItems={list} 
                 />
              </div>
            </div>
          }
        </div>

      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}
        newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover
      />
    </>
    // } </>
  )
}