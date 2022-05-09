import axios from "axios";

export default function UploadCatalogue() {



  function onSubmit(e) {
    axios.post("/catalogues/upload", {
      name: "name 1",
      color1: "123456",
      color2: "12345",

    })
      .then(res => {
        console.log(res.data)
        window.location = '/';
      })
      .catch(err => console.log(`Error ${err}`));
  }
  return(

    <div className="flex flex-col w-full min-h-screen">
      <div className="flex text-neutral-500 ">Ready to upload catalogues?</div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input type="file" name="uploadFile" className="text-white bg-rose-600 px-6 py-2 h-fit"></input>
        <button type="submit" className="bg-green-500 px-4 py-2">UPLOAD FILE</button>
      </form>
    </div>
  )
}