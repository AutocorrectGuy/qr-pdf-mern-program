import LoadingDots from "../Views/loading-dots.gif"
export default function() {
  return(
    <div className='flex w-screen h-screen items-center justify-center bg-black'>
      <img src={LoadingDots} className="h-12 w-12"/>
    </div>
  )
}

// regular structure: 
{/* <>
  { Object.keys(userData).length === 0 ? <LoadingScreen /> :
    <div></div>
  }
</> */}