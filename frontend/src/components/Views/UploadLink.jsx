import { useRef, useState, useEffect, useContext } from "react"
import axios from "axios";
import MyColorPicker from "../utils/MyColorPicker";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"
import UserContext from "../../context/UserContext";
import NavTop from "../navbar/NavTop";
import LoadingScreen from "../utils/LoadingScreen";
import { ToastContainer, toast } from "react-toastify";
import { toastPropsRegular, tostConPropsRegular} from "../utils/ToastProps"


export default function UploadLink() {

  // const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const [cookies] = useCookies([]);

  let [data, setData] = useState();
  let outputColors = useRef(["#000000", "#FFFFFF"]);
  let inputName = useRef(null);
  let inputLink = useRef(null);

  const { userContextData, setUserContextData } = useContext(UserContext);

  useEffect(() => {
    // TODO: transform to one request
    if(userContextData.username === undefined) {
      axios.get("/auth/token")
        .then(res => {
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

  /**
   * on key change save input value to react state variable
   */
  function onChangeCallback(e, inputTarget) {
    inputTarget.current = e.target.value;
  }

  /**
   * !U#Y!@#&!---- SUMBIT POST DATA TO THE DATABASE ----!#&##Y!&@#!
   */
  function onSubmit(e) {
    e.preventDefault();
    axios.post("/api/links/upload", {
      name: inputName.current, 
      link: inputLink.current,
      color1: outputColors.current[0],
      color2: outputColors.current[1],
      username: userContextData.username
    })
      .then(res => { 
        navigate("/") 
        // toast(`Links sagalbāts sekmīgi!`, toastPropsRegular)
      })
      .catch(err => {
        toast(`Radusies kļūda saglabājot linku!`, toastPropsRegular)
        console.log(`Error ${err}`)
      });
  }

  return(
    <> { Object.keys(userContextData).length === 0 ? <LoadingScreen /> :
      <>
      <NavLeft />
      <div className="relative flex justify-center w-full min-h-screen px-6">
        <NavTop />
        <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-900 brightness-50 to-neutral-800 h-[300px]"></div>
        <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
        <div className="flex max-w-md w-full items-center ">
          <form onSubmit={(e) => onSubmit(e)}
            className="flex w-full my-auto flex-col text-lg bg-neutral-800 bg-opacity-40 rounded-md p-8 h-fit">
            <label className="text-neutral-200 pb-1">
              Kataloga nosaukums
            </label>
            <input 
              type="text" name="name" autoComplete="off"
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="..."
              onChange={(e)=>onChangeCallback(e, inputName)}
            />
            <label className="text-neutral-200 pt-6 pb-1">
              Kataloga adrese/links
            </label>
            <input autoComplete="off"
              type="text" name="link" 
              className="px-3 bg-neutral-800 focus:bg-neutral-700 rounded-md focus:outline-none text-white py-1 placeholder:text-neutral-400"
              placeholder="https://..."
              onChange={(e)=>onChangeCallback(e, inputLink)}
            />
            <div className="flex flex-col gap-2 mt-8">
              <MyColorPicker labelName="raksta krāsa" color={"#000000"} colorInex={0} outputColorRef={outputColors}/>
              <MyColorPicker labelName="fona krāsa" color={ "#FFFFFF"} colorInex={1} outputColorRef={outputColors}/>
            </div>
            <button 
              type="sumbit"
              className="text-white font-semibold bg-blue-700 hover:bg-blue-600 rounded-md px-8 py-4 mx-auto mt-8 shadow-sm shadow-neutral-800 active:translate-y-px"
            >
              Pievienot
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false}
          newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover
        />
      <NavRight />
      </>
    } </>
  )
}