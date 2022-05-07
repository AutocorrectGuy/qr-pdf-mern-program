import { Link } from "react-router-dom"

const LinkWrapperClass = "text-center text-sm px-2 py-1 text-neutral-200 rounded-sm text-neutral-300 active:translate-y-px shadow-sm shadow-neutral-700";
export default function Navbar() {
  return(
    <div className="absolute w-full">
      <div className="flex gap-2 justify-center items-center bg-cyan-900 h-12 shadow-sm shadow-neutral-800">
        <div className={`${LinkWrapperClass} bg-cyan-700 hover:bg-cyan-600`}>
          <Link to="/">Catalogues</Link>
        </div>
        <div className={`${LinkWrapperClass} bg-rose-700 hover:bg-rose-600`}>
          <Link to="/catalogues/add">Add catalogue</Link>
        </div>
      </div>
    </div>
  )
}