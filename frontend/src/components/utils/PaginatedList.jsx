import SkeletonCard from "../utils/SkeletonCard";
import ReactPaginate from 'react-paginate';
import Card from "../utils/Card"
import { useEffect, useRef } from "react";
import axios from "axios";
import QRCode from "qrcode";
import useWindowSize from "../../hooks/useWindowSize";
import Skeleton from "react-loading-skeleton";

export default function PaginatedList ({
  name, 
  data, 
  pageOffset, 
  setPageOffset, 
  setData, 
  cardsPerPage,
  pageCount
}) {

  // const size = useWindowSize();
  // useEffect(() => {
  //   console.log(size)
  // }, [size])
  const cardTotalCount = useRef(18);

  const handlePageClick = async ({selected}) => {
    setData(false);
    const fetchedCards = await fetchCards(selected);
    setPageOffset(selected);
    setData(fetchedCards);
  }

  const fetchCards = async (currentPage) => {
    const res = await axios.get(`/api/links/get-links-and-pdfs-ids?page=${currentPage}&limit=${cardsPerPage.current}`)
    const data = JSON.parse(res.data);
    
    if(name === "Katalogu saraksts") {
      data.filesData.data.map(async (card) => (
        card.qrCode = await QRCode.toDataURL(`${window.location.href}api/pdfs/file/${card._id}`, {
          errorCorrectionLevel: "L",
          margin: 4,
          color: {
            dark: card.colors.split(",")[0],
            light: card.colors.split(",")[1]
          }
        })
      ))
      cardTotalCount.current = data.filesData.count;
      pageCount.current = Math.ceil(cardTotalCount.current / cardsPerPage.current);
      // if there are less than a half of cards in page, push empty cards to get optimal container height
      if(data.filesData.data.length < 4) 
        for (let i = 0; i < 3; i++) 
          data.filesData.data.push({});
      return data.filesData.data;

    } else {
      data.linksData.data.map(async (card) => (
        card.qrCode = await QRCode.toDataURL(card.link, {
          errorCorrectionLevel: "L",
          margin: 4,
          color: { dark: card.color1, light: card.color2 }
        })
      ))
      cardTotalCount.current = data.linksData.count;
      pageCount.current = Math.ceil(cardTotalCount.current / cardsPerPage.current);
      
      // if there are less than a half of cards in page, push empty cards to get optimal container height
      if(data.linksData.data.length < 4) 
        for (let i = 0; i < 3; i++) 
          data.linksData.data.push({});
      return data.linksData.data;
    }
  }

  return (
    <div className="px-10">
      <div className="pb-5">
        <div className="text-white text-3xl font-bold my-8 cursor-default">
          {name}
        </div>
        <div className="justify-center flex flex-col items-center px-5 sm:px-0 sm:grid sm:items-stretch sm:grid-cols-3 gap-3">
          {!data
            ? [...Array(cardsPerPage.current)].map((x, i) =>
              <SkeletonCard key={`skel-${name}-${i}`} />
            ) : data.map((item, i) => (
              name === "Katalogu saraksts" 
                ? <Card key={`card-${name}-${i}`}
                    outsideHref={`${window.location.href}api/pdfs/file/${item._id}`}
                    insideHref={`/pdfs/${item._id}`}
                    i={i} name={item.name} author={item.author} qrCode={item.qrCode}
                  />
                : <Card key={`card-${name}-${i}`}
                    outsideHref={item.link}
                    insideHref={`/links/${item._id}`}
                    i={i} name={item.name} author={item.author} qrCode={item.qrCode}
                  />
              )
            )
          }
        </div>
      </div>
      {
        !pageCount.current
          ? <Skeleton className="flex mx-auto w-5/12 h-10 rounded-md"/>
          : <ReactPaginate 
          forcePage={pageOffset}
          nextLabel="tālāk >"
          previousLabel="< atpakaļ"
          breakLabel="..."
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          pageCount={pageCount.current}
          renderOnZeroPageCount={null}
          containerClassName={"flex py-2 justify-center"}
          activeLinkClassName={"py-2 px-3 text-blue-600 bg-blue-50 border border-neutral-500 hover:bg-blue-100 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-700 dark:text-white"}
          pageLinkClassName={"py-2 px-3 leading-tight text-neutral-500 bg-white border border-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"}
          breakLinkClassName={"py-2 px-3 leading-tight text-neutral-500 bg-white border border-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"}
          previousLinkClassName={"py-2 px-3 ml-0 leading-tight text-neutral-500 bg-white rounded-l-lg border border-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"}
          nextLinkClassName={"py-2 px-3 ml-0 leading-tight text-neutral-500 bg-white rounded-r-lg border border-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"}
        />
      }
      
    </div>
  )
}