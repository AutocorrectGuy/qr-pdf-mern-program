import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import NavLeft from "../navbar/NavLeft"
import NavRight from "../navbar/NavRight"
import { ToastContainer, toast } from "react-toastify";
import { toastPropsRegular, tostConPropsRegular } from "../utils/ToastProps"
import { useCookies } from "react-cookie";
import LoadingScreen from "../utils/LoadingScreen";
import UserContext from "../../context/UserContext";
import NavTop from "../navbar/NavTop";
import PaginatedList from "../utils/PaginatedList";
// import useWindowSize from "../../hooks/useWindowSize";

export default function CatalogueList() {
  // useWindowSize();
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const devMode = useRef(false);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const cardsPerPage = useRef(6);
  const pageCountPDF = useRef(0);
  const pageCountLinks = useRef(0);
  const [pageOffsetPDF, setPageOffsetPDF] = useState(0);
  const [pageOffsetLinks, setPageOffsetLinks] = useState(0);
  const [PDFdata, setPDFData] = useState(false);
  const [linksData, setLinksData] = useState(false);

  const { userContextData, setUserContextData } = useContext(UserContext);

  useEffect(() => {
    process.env.REACT_APP_NODE_ENV === 'development' &&
      (axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL)

    if (userContextData.username === undefined && cookies.hello === undefined) {
      
        axios.get("/auth/token")
          .then(res => {
            setUserContextData(res.data)
          }
            )
          .catch(({ response: { status } }) =>
            (status === 401 || status === 404) && navigate("/login")
          )

    }
    // if (userContextData.username === undefined 
    //   && cookies.hello === undefined
    //   && process.env.REACT_APP_NODE_ENV === 'development'

    //   ) {
    //   navigate("/login");
    //   return;
    // }
    // .catch(function ({response: { status }}) {
    //   if(devMode.current) return;
    //   if(status === 401 || status === 404) navigate("/login");
    // });

    cookies.hello !== undefined && greetUser();

    const fetchData = async () => {
      let resString = "";
      try {
        process.env.REACT_APP_NODE_ENV === 'development'
          && (axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL)

        resString = await axios.get(
          `/api/links/get-links-and-pdfs-ids?page=0&limit=${cardsPerPage.current}`);
      } catch (err) {
        console.log(err);
      }
      let res = JSON.parse(resString.data);

      // GENERATE TOP 1ST LIST QR CODES
      res.filesData.data.map(async (card) => (
        card.qrCode = await QRCode.toDataURL(`${window.location.href}api/pdfs/file/${card._id}`, {
          errorCorrectionLevel: "L",
          margin: 4,
          color: {
            dark: card.colors.split(",")[0],
            light: card.colors.split(",")[1]
          }
        })
      ))
      pageCountPDF.current = Math.ceil(res.filesData.count / cardsPerPage.current);
      setPDFData(res.filesData.data);

      // GENERATE TOP 2ND LIST QR CODES
      res.linksData.data.map(async (card) => (
        card.qrCode = await QRCode.toDataURL(card.link, {
          errorCorrectionLevel: "L",
          margin: 4,
          color: { dark: card.color1, light: card.color2 }
        })
      ))
      pageCountLinks.current = Math.ceil(res.linksData.count / cardsPerPage.current);
      setLinksData(res.linksData.data);
    }

    fetchData();

  }, []);

  function greetUser() {
    process.env.REACT_APP_NODE_ENV === 'development'
      ? toast(`Sveiks, meistar`, toastPropsRegular)
      : toast(`Prieks tevi redzēt, ${userContextData.username}`, toastPropsRegular)
    removeCookie("hello");
  }

  return (
    <> {Object.keys(userContextData).length === 0 && process.env.REACT_APP_NODE_ENV !== 'development'
      ? <LoadingScreen />
      : <>
        <NavLeft />
        <div className="relative flex justify-center w-full min-h-screen">
          <div className="absolute -z-10 flex justify-center max-w-screen w-full bg-gradient-to-b from-neutral-600 to-neutral-800 brightness-50 h-[400px]"></div>
          <div className="absolute -z-20 flex justify-center max-w-screen w-full bg-neutral-800 brightness-50 max-h-max h-full"></div>
          <div className="flex flex-col w-full">
            <NavTop />
            <PaginatedList
              name={"Katalogu saraksts"}
              data={PDFdata} setData={setPDFData}
              pageOffset={pageOffsetPDF} setPageOffset={setPageOffsetPDF}
              cardsPerPage={cardsPerPage} pageCount={pageCountPDF} />
            <PaginatedList
              name={"Linku saraksts"}
              data={linksData} setData={setLinksData}
              pageOffset={pageOffsetLinks} setPageOffset={setPageOffsetLinks}
              cardsPerPage={cardsPerPage} pageCount={pageCountLinks} />
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