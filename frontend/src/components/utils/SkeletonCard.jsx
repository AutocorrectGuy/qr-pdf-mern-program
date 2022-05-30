import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCopy, faUser } from "@fortawesome/free-solid-svg-icons"
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

export default function SkeletonCard() {
  return (
    <div className="flex mx-auto flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[300px] sm:max-w-[224px] w-full">
      <div className="pb-[100%] relative">
        <div className="w-full absolute block pb-[100%]">
          <Skeleton style={{
            position: "absolute",
            height: "0px",
            paddingBottom: "100%"
          }} />
        </div>
      </div>
      <div className="mt-2">
        <Skeleton count={2}/>
        <Skeleton style={{width: "66%"}}/>
      </div>

    </div>
  )
}