import React, { useState, useCallback } from 'react';
import axios from 'axios';
import LoadingDots from "./loading-dots.gif"
import {useDropzone} from 'react-dropzone'


const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [pdfId, setPdfId] = useState(null);
  const [progress, setProgress] = useState(null);

  let colors = {
    c1: "#fc00ff", c2: "#0f1572"
  }
  const fileUploadHandler = () => {
    const fd = new FormData();
    console.log(file);
    fd.append('pdf', file, `${file.name}`);
    fd.append("colors", `${colors.c1},${colors.c2}`);
    fd.append("name", "My file name");
    fd.append("author", "Monke Donkī");
    axios
      .post(`/api/pdfs/upload`, fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            'upload progress: ',
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
      .then(({ data }) => {
        console.log("done axios");
        setPdfId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      })
      .catch((err) => {
        console.log("axios error");
        console.log(err);
        if (err.response.status === 400) {
          const errMsg = err.response.data;
          if (errMsg) {
            console.log(errMsg);
            alert(errMsg);
          }
        } else if (err.response.status === 500) {
          console.log('db error');
          alert('db error');
        } else {
          console.log('other error: ', err);
        }
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFile) => {
      setFile(acceptedFile[0]);
      setInputContainsFile(true);
    },
    multiple: false,
    accept: {'application/pdf': ['.pdf']}
  })

  const handleClick = () => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      fileUploadHandler();
    }
  };
  
  return (
    <div className="bg-neutral-900 p-8 w-full flex flex-col items-center">
      {/* <div className="border border-red-600 h-28 w-full flex flex-col justify-around items-center">
        {pdfId ? (
          <div className='text-white'>Pdf fails augšuplādēts sekmīgi</div>
        ) : (
          <p className='text-neutral-400'>Ievelc PDF failu te</p>
        )}
      </div> */}


      <div className='bg-neutral-500 w-full h-full' {...getRootProps()}>
        <input  {...getInputProps()}
        />
        <p>Drop files here</p>
      </div>


      <div>
        {currentlyUploading && <img
            src={LoadingDots}
            className="h-12 w-12"
            alt="upload in progress..."
          />
        }
        { file!==null && !currentlyUploading && (
          <button
            className={`flex w-full h-full bg-blue-500 cursor-pointer`}
            htmlFor='file' onClick={handleClick}
          >
          Augšuplādēt</button>)}

      </div>






    </div>
  );
};

export default UploadPdf;