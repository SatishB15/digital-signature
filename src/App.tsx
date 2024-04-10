import { ChangeEvent, useRef, useState } from 'react';
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import ReactSignatureCanvas from 'react-signature-canvas';
import { ToastContainer, toast } from 'react-toastify';
import { downloadBase64Content } from './helpers/utils';


function App() {
  const signCanvas = useRef<ReactSignatureCanvas | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [penColor, setPenColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const clearCanvas = () => {
    if (isCanvasEmpty()) {
      toast.warn("Canvas is Empty");
      return;
    }
    if (signCanvas.current) {
      signCanvas.current?.clear();
    }
  }

  const handleFileUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];
      if (selectedFile.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === 'string') {
            const dataURL = reader.result;
            if (signCanvas.current) {
              signCanvas.current.fromDataURL(dataURL, {
                height: 270,
                width: 500,
                callback: (error) => {
                  if (error) {
                    toast.error("Failed to retirve the signature.",)
                    return;
                  }
                }
              });
            }
          }
        };
        reader.readAsDataURL(selectedFile);
      } else {
        toast.error('Please select a PNG file.');
      }
    }
  };


  const isCanvasEmpty = (): boolean => {
    if (signCanvas.current) {
      return signCanvas.current?.isEmpty();
    }
    return true;
  }

  const downLoadSVG = () => {
    if (isCanvasEmpty()) {
      toast.warn("Canvas is Empty");
      return;
    }
    if (signCanvas.current) {
      downloadBase64Content(signCanvas.current.toDataURL("image/png"))
      toast.info("Image downloaded successfully.")
    }
  }

  return (
    <>
      <main className='container'>
        <p className='heading'>Digital Signature Pad
        </p>
        <span>
          Effortlessly create and download your personalized digital signature using our simple tool.
        </span>
        <div className="operation-buttons">
          <div className="w-100">
            <p className="label">Set Pen Color</p>
            <input type="color" value={penColor} name="pen-color" onChange={(e) => setPenColor(e.target.value)} />
          </div>
          <div className="w-100">
            <p className="label">Set Background Color</p>
            <input type="color" value={backgroundColor} name="background-color" onChange={(e) => setBackgroundColor(e.target.value)} />
          </div>
        </div>
        <ReactSignatureCanvas
          penColor={penColor}
          backgroundColor={backgroundColor}
          clearOnResize={true}
          dotSize={0.5}
          ref={signCanvas}
          canvasProps={{ className: 'signature-canvas' }}
        />
        <div className="operation-buttons">
          <button className='download-button' type="button" onClick={downLoadSVG}>Download</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png"
            style={{ display: 'none' }}
          />
          <button className='update-button' type="button" onClick={handleFileUploadButtonClick}>Upload</button>
          <button className='clear-button' type="button" onClick={clearCanvas}>Clear</button>
        </div>
      </main>
      <ToastContainer
        autoClose={2000}
        position="top-right"
        hideProgressBar
        closeButton={false}
        newestOnTop
        theme='colored'
        limit={2}
        closeOnClick
      />
    </>
  )
}

export default App
