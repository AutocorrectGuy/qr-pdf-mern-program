import { Link } from "react-router-dom"

const LinkWrapperClass = "text-center text-sm px-2 py-1 text-neutral-200 rounded-sm text-neutral-300 active:translate-y-px shadow-sm shadow-neutral-700";
export default function Navbar() {
  return(
    <div className="absolute w-full">
      <div className="flex gap-2 justify-center items-center bg-neutral-900 h-12 shadow-sm shadow-neutral-800">
        <div className={`${LinkWrapperClass} bg-neutral-700 hover:bg-neutral-600`}>
          <Link to="/">Catalogues</Link>
        </div>
        <div className={`${LinkWrapperClass} bg-red-700 hover:bg-red-600`}>
          <Link to="/catalogues/add">Add catalogue</Link>
        </div>
      </div>
    </div>
  )
}