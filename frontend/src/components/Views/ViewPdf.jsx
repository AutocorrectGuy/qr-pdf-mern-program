import { useParams } from "react-router-dom"
import { useState, useEffect, useRef, useContext } from "react";
import QRCode from "qrcode";
import axios from "axios";
import ModalDelete from "../utils/ModalDelete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCopy } from "@fortawesome/free-solid-svg-icons";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"
import NavTop from "../navbar/NavTop";
import UserContext from "../../context/UserContext";
import LoadingScreen from "../utils/LoadingScreen";

const dataKeys = {
  name: "Nosaukums",
  author: "Autors",
  _id: "Id",
  uploadDate: "Publicesanas datums",
  filename: "Faila kriptetais nosaukums",
  color1: "QR koda raksts",
  color2: "QR koda fons",
  link: "Links uz failu",
  qrCode: "QR pamatkods"
}

const wrapperClass = "flex flex-col sm:flex-row px-2 hover:bg-neutral-400 hover:bg-opacity-10 rounded-sm";
const textLeftClass = "text-neutral-400 select-none w-[200px] sm:w-[230px] py-2";
const textRightClass = "text-neutral-100 py-2";
const inputClass = "flex px-2 sm:my-[2px] py-2 sm:py-0 min-w-[1px] max-w-[300px] w-full bg-neutral-800 focus:bg-neutral-700 rounded-sm focus:outline-none text-white";

export default function ViewPdf() {

  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const devMode = useRef(false);
  const [cookies] = useCookies([]);

  const params = useParams();
  const [data, setData] = useState([]);
  const [qrCode, setQRCode] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const fullHref = useRef(`${window.location.host}/api/pdfs/file/${params.id}`);
  // editing data
  const [editiongMode, setEditingMode] = useState(false);
  const [name, setName] = useState(null);
  const [author, setAuthor] = useState(null);
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);
  //context
  const { userContextData, setUserContextData } = useContext(UserContext);

  useEffect(() => {
    process.env.REACT_APP_NODE_ENV === 'development' &&
      (axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL)

    if (process.env.REACT_APP_NODE_ENV !== 'development' && !userContextData.hasOwnProperty("username")) {
      axios.get("/auth/token")
        .then(res => {
          setUserContextData(res.data);
        })
        .catch(({ response: { status } }) => {
          if (status === 401 || status === 404) navigate("/login")
        })
    }

    axios.get(`/api/pdfs/json/${params.id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch(function ({ response: { status } }) {
        if (devMode.current) return;
        if (status === 401 || status === 404) navigate("/login");
      });
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
      margin: 4, color: { dark: colors[0], light: colors[1] }
    }).then((data) => setQRCode(data));
  }, [data])

  useEffect(() => {
    if (editiongMode) {
      setName(data.metadata.name);
      setAuthor(data.metadata.author);
      setColor1(data.metadata.colors.split(",")[0]);
      setColor2(data.metadata.colors.split(",")[1]);
    }
  }, [editiongMode]);

  function toggleEditingMode(e) {
    e.preventDefault();
    setEditingMode(!editiongMode)
  }
  function onSubmit(e) {
    axios.put(`/api/pdfs/update/${params.id}`, {
      name: name,
      author: author,
      colors: `${color1},${color2}`
    })
      .then(res => { console.log("edition done succesfully!") })
      .catch(err => console.log(`Error ${err}`));
  }
  return (
    <> {Object.keys(userContextData).length === 0 ? <LoadingScreen /> :
      <>
        <NavLeft />
        <div className="relative flex flex-col w-full min-h-screen">
          <NavTop />
          <div className={`absolute -z-10 flex justify-center max-w-screen w-full brightness-[25%] h-[300px]`}
            style={{ background: `linear-gradient(${data.length !== 0 ? data.metadata.colors.split(",")[1] : "#52525b"}, #52525b)` }}></div>
          <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-600 brightness-[25%] max-h-max h-full"></div>
          {/* Actual content */}
          <div className="max-w-4xl w-full mx-auto">
            <div className="flex w-full p-8">
              {qrCode.length !== 0 &&
                <div className="hidden sm:block sm:my-auto sm:max-w-[148px] sm:max-h-[148px] sm:w-full sm:h-full">
                  <img src={qrCode} className="object-contain" />
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
                    {!editiongMode ? <div className={textRightClass}>{data.metadata.name}</div>
                      : <input className={inputClass} name="name" value={name} type="text" autoComplete="off"
                        onChange={(e) => (setName(e.target.value))} />
                    }
                  </div>
                  <div className={wrapperClass}>
                    <div className={textLeftClass}>{dataKeys.color1}</div>
                    {!editiongMode ? <div className={textRightClass}>{data.metadata.colors.split(",")[0]}</div>
                      : <input className={inputClass} name="color1" value={color1} type="text" autoComplete="off"
                        onChange={(e) => (setColor1(e.target.value))} />
                    }
                  </div>
                  <div className={wrapperClass}>
                    <div className={textLeftClass}>{dataKeys.color2}</div>
                    {!editiongMode ? <div className={textRightClass}>{data.metadata.colors.split(",")[1]}</div>
                      : <input className={inputClass} name="color2" value={color2} type="text" autoComplete="off"
                        onChange={(e) => (setColor2(e.target.value))} />
                    }
                  </div>
                  <div className={wrapperClass}>
                    <div className={textLeftClass}>{dataKeys.author}</div>
                    {!editiongMode ? <div className={textRightClass}>{data.metadata.author}</div>
                      : <input className={inputClass} name="author" value={author} type="text" autoComplete="off"
                        onChange={(e) => (setAuthor(e.target.value))} />
                    }
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
                    <div className={textLeftClass}>{dataKeys.uploadDate}</div>
                    <div className={textRightClass}>{data.uploadDate}</div>
                  </div>

                  <div className={wrapperClass}>
                    <div className={textLeftClass}>{dataKeys.link}</div>
                    <input className={`${inputClass} bg-opacity-40`} value={fullHref.current} type="text" />
                    <div className={textRightClass}>
                      <CopyToClipboard text={fullHref.current}>
                        <FontAwesomeIcon icon={faCopy}
                          className={"w-5 h-5 ml-1 text-neutral-400 hover:text-white cursor-pointer active:translate-y-px"} />
                      </CopyToClipboard>
                    </div>
                  </div>

                  <div className={wrapperClass}>
                    <div className={`${textLeftClass} whitespace-nowrap`}>{dataKeys.qrCode}</div>
                    <input className={`${inputClass} bg-opacity-40`} value={qrCode} type="text" />
                    <div className={`${textRightClass} overflow-x-hidden max-w-sm`}>
                      <CopyToClipboard text={qrCode}>
                        <FontAwesomeIcon icon={faCopy}
                          className={"w-5 h-5 ml-1 text-neutral-400 hover:text-white cursor-pointer active:translate-y-px"} />
                      </CopyToClipboard>
                    </div>
                  </div>

                  {
                    (userContextData.status === "employee" || userContextData.status === "admin") &&
                    <div className="flex flex-col my-10 border border-neutral-800 rounded-md">
                      <div className="flex justify-between items-center p-4 gap-2 border-t border-t-neutral-800 border-b border-b-neutral-800">
                        <div className="flex flex-col">
                          <p className="text-neutral-300 font-semibold text-sm">Apskatīt PDF failu</p>
                          <p className="text-neutral-300 font-normal text-sm">Fails pašlaik tiek glabāts iekšējā datubāzē un tam iespējams piekļūt tikai caur norādīto konkrēto linku. No šī linka arī tiek veidots qr kods.</p>
                        </div>
                        <a className="flex font-semibold items-center w-fit px-3 py-2 h-fit whitespace-nowrap text-sky-600 bg-neutral-800 text-sm
                     hover:bg-neutral-700 border border-neutral-700 select-none rounded-md cursor-pointer active:translate-y-px shadow-sm shadow-neutral-800"
                          href={`/api/pdfs/file/${params.id}`} target="_blank" rel="noreferrer"
                        >Atvērt PDF failu
                          <FontAwesomeIcon
                            data-tip data-for={"qr-source"}
                            icon={faLink} className="text-sky-600 w-4 h-4 ml-1"
                          />
                        </a>
                      </div>
                      <div className="flex justify-between gap-2 p-4 items-center">
                        <div className="flex flex-col gap-2">
                          <p className="text-neutral-300 font-semibold text-sm">Ieraksta metadatu rediģēšana</p>
                          <p className="text-neutral-300 font-normal text-sm">Pēc rediģēšanas dati tiks atjaunoti datubāzē. Šie meta-dati ir pievienoti ierakstam datubāzē, taču nav pievienoti pašam PDF failam.</p>
                        </div>
                        <form onSubmit={(e) => onSubmit(e)} className="flex flex-col w-fit gap-2 items-end">
                          <button className={`${!editiongMode ? "text-green-600" : "text-neutral-400"}
                      flex font-semibold w-fit h-fit items-center px-3 py-2  bg-neutral-800 hover:bg-neutral-700 border whitespace-nowrap
                      border-neutral-700 select-none rounded-md cursor-pointer active:translate-y-px shadow-sm shadow-neutral-800 text-sm`}
                            onClick={(e) => toggleEditingMode(e)}>{`${!editiongMode ? "Rediģēt datus" : "Atcelt rediģēšanu"}`}</button>
                          {editiongMode &&
                            <button className="flex font-semibold w-fit px-3 py-2 h-fit text-white bg-green-700 hover:bg-green-600 whitespace-nowrap select-none rounded-md cursor-pointer active:translate-y-px shadow-sm shadow-neutral-800 text-sm"
                              type="sumbit">Saglabāt izmaiņas</button>
                          }
                        </form>
                      </div>
                      <div className="flex justify-between items-center p-4 gap-2 border-t border-t-neutral-800">
                        <div className="flex flex-col">
                          <p className="text-neutral-300 font-semibold text-sm">Ieraksta dzēšana</p>
                          <p className="text-neutral-300 font-normal text-sm">Rezultātā no datu bāzes neatgriezeniski tiks dzēsts pats PDF fails kopā ar šo ierakstu, tajā skaitā, qr kods, kā arī līdzšinējā adrese uz šo pdf failu. </p>
                        </div>
                        <button className="flex font-semibold items-center w-fit px-3 py-2 h-fit whitespace-nowrap text-red-600 bg-neutral-800 text-sm
                     hover:bg-neutral-700 border border-neutral-700 select-none rounded-md cursor-pointer active:translate-y-px shadow-sm shadow-neutral-800"
                          onClick={() => setDeleteModalOpen(true)}
                        >Dzēst katalogu</button>
                        {deleteModalOpen &&
                          <ModalDelete setDeleteModalOpen={setDeleteModalOpen} name={data.metadata.name} id={params.id} type={"pdfs"} />
                        }
                      </div>
                    </div>
                  }


                </div>
              </div>
            }
          </div>
        </div>
        <NavRight />
      </>
    } </>
  )
}