import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import LoadingDots from "./loading-dots.gif"
import {useDropzone} from 'react-dropzone'
import MyColorPicker from '../utils/MyColorPicker';
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload }  from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"
import UserContext from "../../context/UserContext";
import NavTop from '../navbar/NavTop';
import LoadingScreen from '../utils/LoadingScreen';

const UploadPdf = () => {
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  //context
  const { userContextData, setUserContextData } = useContext(UserContext);
  useEffect(() => {

    // TODO: transform to one request
    if(userContextData.username === undefined) {
      console.log("reset token")
      axios.get("/auth/token")
        .then(res => {
          // check user acess
          setUserContextData(res.data);
        })
        .catch(({response: { status }}) => {
          if(status === 401 || status === 404) navigate("/login")
        })
    }

  Object.keys(userContextData).length === 0 && navigate("/");
  !userContextData.hasOwnProperty("status") && navigate("/");
  userContextData.status === "client" && navigate("/");
  }, [])

  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [pdfId, setPdfId] = useState(null);
  const [progress, setProgress] = useState(null);
  // document metadata:
  const [catalogueName, setcatalogueName] = useState("");
  let outputColors = useRef(["#000000", "#FFFFFF"]);

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('pdf', file, file.name);
    fd.append("colors", `${outputColors.current[0]},${outputColors.current[1]}`);
    fd.append("name", catalogueName);
    fd.append("author", "Developer");
    console.log(JSON.stringify(fd));
    console.log(fd);
    axios
      .post(`/api/pdfs/upload`, fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            'upload progress: ',
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
      .then(({ data }) => {
        console.log("Upload succesfull (axios has done its work)");
        setPdfId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      })
      .catch((err) => {
        console.log("axios error");
        console.log(err);
        if (err.response.status === 400) {
          const errMsg = err.response.data;
          if (errMsg) {
            console.log(errMsg);
            alert(errMsg);
          }
        } else if (err.response.status === 500) {
          console.log('db error');
          alert('db error');
        } else {
          console.log('other error: ', err);
        }
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setFile(acceptedFile[0]);
      setInputContainsFile(true);
    },
    multiple: false,
    accept: {'application/pdf': ['.pdf']}
  })

  const handleClick = () => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      fileUploadHandler();
    }
  };
  
  return (
    <> { Object.keys(userContextData).length === 0 ? <LoadingScreen /> :
      <>
      <NavLeft />
      <div className="max-w-screen w-full h-screen">
        <div className={`relative flex flex-col items-center w-full h-full bg-neutral-900 px-8 pb-8 pt-14 ${file!==null ? "gap-5" : ""}`}>
          <NavTop />
          <div className={`${file===null && "border-dashed border-2 border-blue-700"} flex items-center justify-center w-full h-full rounded-md 
          bg-neutral-800 cursor-pointer p-5`}
            {...getRootProps()}>
            <input  {...getInputProps()}
            />
            <div className={`${file!==null && "border-dashed border-2 border-neutral-700"} flex flex-col text-xl px-8 text-neutral-300 text-center select-none`}>
            { file===null ? `Noklikšķini vai ievelc PDF failu` 
            : <>
                <div className="w-full pb-3">
                  <p className="text-neutral-500 float-left">Faila nosaukums:&nbsp;</p>
                  <p className="text-left">{`${file.name}`}</p>
                </div>
                <div className="w-full">
                  <p className="text-neutral-500 float-left">Faila izmērs:&nbsp;</p>
                  <p className="text-left">{`${(file.size / 1024).toFixed(2)} kb`}</p>
                </div>
              </> }
            </div>
          </div>

          <div className={`flex flex-col lg:flex-row w-full gap-5 ${file!==null ? "min-h-[50%] lg:min-h-[200px]" : ""}`}>
            {currentlyUploading && 
            <div className='flex w-full h-full items-center justify-center bg-black rounded-md'>
              <img
                src={LoadingDots}
                className="h-12 w-12"
                alt="upload in progress..."
              />
            </div>

            }
            { file!==null && !currentlyUploading && (
              <>
                <form className={`${catalogueName.length < 3 ? "border-blue-700" : "border-neutral-700"} border-2 border-dashed flex w-full h-fit my-auto flex-col text-lg bg-neutral-800 bg-opacity-40 rounded-md p-5 justify-center`}>
                  <label className="text-neutral-200 pb-1 select-none">Kataloga nosaukums</label>
                  <input 
                    name="name" type="text" autoComplete="off" className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400" 
                    placeholder="..."
                    onChange={(e) => {setcatalogueName(e.target.value)}}></input>
                  <div className="flex flex-col gap-2 mt-2">
                    <MyColorPicker labelName="raksta krāsa" color={"#000000"} colorInex={0} outputColorRef={outputColors}/>
                    <MyColorPicker labelName="fona krāsa" color={ "#FFFFFF"} colorInex={1} outputColorRef={outputColors}/>
                  </div>
                </form>
                <div
                  className={`${catalogueName.length >= 3 ? "bg-blue-700 hover:bg-blue-600 cursor-pointer" : "bg-neutral-800 cursor-not-allowed opacity-40"}
                  flex items-center justify-center w-full lg:max-w-[200px] h-full cursor-pointer rounded-md`}
                  htmlFor='file' onClick={() => {catalogueName.length >= 3 && handleClick()}}
                  data-tip data-for="btn-upload-pdf"
                >
                  <FontAwesomeIcon icon={faUpload} className={` ${catalogueName.length >= 3 && "active:translate-y-px"} 
                  text-white select-none w-1/3 h-1/3`} 
                />
                </div>
                {catalogueName.length < 3 && (
                  <ReactTooltip id="btn-upload-pdf" clickable={false} type={"dark"}>
                    <div className='text-white text-lg select-none'>Kataloga nosaukumam jābūt garākam par 3 rakstzīmēm</div> 
                  </ReactTooltip>
                )}

              </>)
            }
          </div>
        </div>
      </div>
      <NavRight />
      </>
    } </>
  );
}

export default UploadPdf;