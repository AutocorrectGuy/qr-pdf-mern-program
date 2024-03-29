import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faExternalLinkAlt, faFileAlt } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom";
import LoadingScreen from "../utils/LoadingScreen";
import QuestNavLeft from "../navbar/QuestNavLeft";

export default function ViewModels({ folderName }) {
  const [, setPDFData] = useState(false);
  const [list, setList] = useState({});

  useEffect(() => {

    process.env.REACT_APP_NODE_ENV === 'development'
      && (axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL)

    console.log(axios.defaults.baseURL)
    const fetchData = async () => {
      let resString = "";
      try {
        resString = await axios.get(`api/links/get-models`);
      } catch (err) {
        console.log(err);
      }
      let res = JSON.parse(resString.data);

      let itemsList = {};

      let searchable = ["HEIZOHACK", "JENZ", "BRUKS", "ALBACH", "DOPPSTADT", "MUSMAX", "PEZZOLATO", "SILVATOR", "DIAMANT"];
      if (folderName === "es") {
        searchable.push("ESCHLBOCK BIBER")
        res.filesData.data.map(({ name, _id }) => {
          let nameToSearch = name.toUpperCase();
          if (folderName === "es" && nameToSearch.endsWith("ES"))
            searchable.forEach(item => {
              if (nameToSearch.search(item) !== -1) {
                itemsList[item] === undefined
                  ? itemsList[item] = [{ name: nameToSearch, _id: _id }]
                  : itemsList[item] = [...itemsList[item], { name: nameToSearch, _id: _id }]
                return;
              }
            });
        })
      } else {
        searchable.push("BIBER")
        res.filesData.data.map(({ name, _id }) => {
          let nameToSearch = name.toUpperCase();
          if (folderName !== "es" && !nameToSearch.endsWith("ES"))
            searchable.forEach(item => {
              if (nameToSearch.search(item) !== -1) {
                itemsList[item] === undefined
                  ? itemsList[item] = [{ name: nameToSearch, _id: _id }]
                  : itemsList[item] = [...itemsList[item], { name: nameToSearch, _id: _id }]
                return;
              }
            });
        })
      }
      setList(itemsList);
      setPDFData(res.filesData.data);
    }
    fetchData();

  }, []);

  const ToggableButton = ({ name, listItems, index }) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => { setOpen(!open) }}
          className={`hover:brightness-150  
          text-neutral-200 select-none py-2 px-3 flex flex-col bg-opacity-10 
            ${index % 2 ? "bg-neutral-700" : "bg-neutral-200"}`}
        >
          <div
            className="flex w-full justify-between items-center active:translate-y-px">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faList} className={`${(folderName === "es") ? "text-green-400" : "text-blue-400"} w-4 h-4`} />
              <div>{`${name} (${listItems.length})`}</div>
            </div>
            <div className="flex">
              <Link to={`${name.toLowerCase()}`}>
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  className="text-white w-4 h-4 hover:text-blue-600"
                />
              </Link>
            </div>
          </div>

        </button>
        {
          <div className={` text-black font-semibold overflow-hidden w-full
          ${open ? "h-fit" : "h-0"}`} >
            {listItems.map((item, index2) =>
              <a
                key={`li-${name}-${index2}`}
                href={`${window.location.href.replace(folderName === "es" ? "/modelses" : "/models", "")}/api/pdfs/file/${item._id}`}
                target="_blank"
                rel="noreferrer"
                className={`hover:brightness-90
                  flex gap-3 px-3 items-center cursor-pointer
                  ${index2 % 2 
                    ? `${folderName === "es" 
                      ? "bg-green-300" 
                      : "bg-sky-300"}` 
                    : `${folderName === "es" 
                      ? "bg-green-500" 
                      : "bg-sky-500"}`}`
                }>
                <FontAwesomeIcon icon={faFileAlt} className="text-black-600 w-5 h-5" />
                <div>
                  {item.name}
                </div>
              </a>
            )}
          </div>
        }
      </>

    )
  }

  return (
    <> {Object.keys(list).length === 0
      ? <LoadingScreen />
      :
      <>
        <QuestNavLeft />
        <div className="relative flex justify-center w-full min-h-screen">
          <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-600 to-neutral-800 brightness-50 h-[400px]"></div>
          <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
          <div className="flex flex-col w-full px-10">
            <div className="flex text-3xl text-white font-semibold uppercase my-16 mx-auto">Select you model</div>
            {
              Object.keys(list).length > 0 &&
              <div className="flex w-full mx-auto shadow-lg text-lg shadow-[#1a1a1a] border border-neutral-800">
                <div className="flex w-full flex-col">
                  {
                    Object.keys(list).map((keyItem, index) =>
                      <ToggableButton key={`ul-${keyItem}`} name={keyItem} listItems={list[keyItem]} index={index} />
                    )
                  }
                </div>
              </div>
            }
          </div>
        </div>
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}
          newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover
        />
      </>
    } </>
  )
}