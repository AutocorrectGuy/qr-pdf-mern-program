import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCopy, faUser } from "@fortawesome/free-solid-svg-icons"
import CopyToClipboard from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

export default function DataCard({ name, author, qrCode, outsideHref, insideHref, index }) {
  return (
    <div className={`${!qrCode && "opacity-0 select-none"} flex mx-auto flex-col p-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 max-w-[300px] sm:max-w-[224px] w-full`}>
      {
        qrCode
          ? <img className="w-full rounded-lg mb-4" src={qrCode} />
          : <div className="w-full rounded-lg pb-[100%] mb-4 relative">
            <div className="absolute top-0 left-0 pb-[100%]"></div>
          </div>
      }
      <div className="flex flex-col h-full justify-between">
        {
          qrCode
            ? <div className="flex justify-between">
            <Link to={insideHref} className="h-10 text-neutral-100 font-metrophobic font-bold mb-2 leading-5 line-clamp-2 cursor-pointer">
              {`${name}`}
            </Link>
            <a href={outsideHref} target="_blank" rel="noreferrer"
              className="pl-1 text-neutral-500 hover:text-white cursor-pointer">
              <FontAwesomeIcon
                data-tip data-for={`card-${name}-${author}`}
                icon={faLink}
                className={"w-5 h-5 text-neutral-600 hover:text-white active:translate-y-px"} />
            </a>
            <ReactTooltip
              effect="solid" clickable={true} delayShow={300} delayHide={200} type={"dark"}
              id={`card-${name}-${author}`}>
              <div className="flex gap-2">
                <div className="cursor-default">{outsideHref}</div>
                <CopyToClipboard text={outsideHref}>
                  <FontAwesomeIcon icon={faCopy} data-tip data-for={`pdf-link-copy-${index}`}
                    className={"w-5 h-5 text-neutral-400 hover:text-white cursor-pointer active:translate-y-px"} />
                </CopyToClipboard>
              </div>
            </ReactTooltip>
          </div>
          : <div className="select-none text-transparent h-10 mb-2">-</div>
        }
        {
          qrCode
            ? <div className="flex items-center gap-1 cursor-pointer">
              <FontAwesomeIcon icon={faUser} className="text-neutral-500 w-3 h-3" />
              <div className="text-neutral-500 text-sm leading-4 break-all line-clamp-2">
                {`${author}`}
              </div>
            </div>
            : <div className="text-sm leading-4">-</div>
        }
        
      </div>
    </div>
  )
}