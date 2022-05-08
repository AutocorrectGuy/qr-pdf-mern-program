import { Link } from "react-router-dom"

const LinkWrapperClass = "text-center text-sm px-4 py-2 rounded-sm active:translate-y-px shadow-sm shadow-neutral-700";
export default function Navbar() {
  return(
    <div className="flex justify-center">
      <div className="flex justify-center absolute w-full shadow-md bg-[#323639]">
        <div className="flex gap-3 mr-3 justify-end items-center bg-[#323639] h-14 max-w-7xl w-full">
          <div className={`${LinkWrapperClass} bg-neutral-500 hover:bg-neutral-600 text-white`}>
            <Link to="/">Katalogu saraksts</Link>
          </div>
          <div className={`${LinkWrapperClass} bg-red-600 hover:bg-red-500 text-neutral-200`}>
            <Link to="/catalogues/add">Pievienot katalogu</Link>
          </div>
        </div>
      </div>
      <div className="flex absolute w-full h-3 bg-white mt-14 max-w-7xl"></div>
    </div>

    
  )
}