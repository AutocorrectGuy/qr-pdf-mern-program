import React, { useState } from 'react';
import axios from 'axios';
import LoadingDots from "./loading-dots.gif"

const UploadCatalogue = () => {
  const [file, setFile] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [pdfId, setPdfId] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setInputContainsFile(true);
  };

  const fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('pdf', file, file.name);
    axios
      .post(`/api/pdf/upload`, fd, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          console.log(
            'upload progress: ',
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
      .then(({ data }) => {
        setPdfId(data);
        setFile(null);
        setInputContainsFile(false);
        setCurrentlyUploading(false);
      })
      .catch((err) => {
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

  const handleClick = () => {
    if (inputContainsFile) {
      setCurrentlyUploading(true);
      fileUploadHandler();
    }
  };
  return (
    <div className="bg-neutral-900 p-8 w-full flex flex-col items-center">
      <div className="border border-red-600 h-28 w-full flex flex-col justify-around items-center">
        {pdfId ? (
          <>
            <div className='text-white'>Katalogs augšuplādēts sekmīgi</div>
            <a className='link' href={`/api/pdf/${pdfId}`} target='_blank'>
              link to picture
            </a>
          </>
        ) : (
          <p className='text-black'>no regular version pic yet</p>
        )}
      </div>
      <div className='h-10 w-24'>
        {currentlyUploading ? (
          <img
            src={LoadingDots}
            className='h-7 w-12'
            alt='upload in progress'
          />
        ) : (
          <div className="flex justify-center border border-blue-500 w-full">
            <input
              className='w-[1px] h-[1px] opacity-0 overflow-hidden -z-40'
              onChange={handleFile}
              type='file'
              name='file'
              id='file'
            />
            <label
              className={`flex w-full px-6 py-3 whitespace-nowrap full bg-red-700 hover:bg-red-600 text-white cursor-pointer
               ${file && 'bg-green-700 hover:bg-green-600'}`}
              htmlFor='file'
              onClick={handleClick}
            >
              {file ? <>AUGŠUPLĀDĒT</> : <>IZVĒLĒTIES FAILU</>}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCatalogue;