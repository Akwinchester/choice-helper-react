// src/components/modals/CropImageEditor.jsx
import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function CropImageEditor({ originalFile, setOriginalFile, setCroppedFile }) {
  const [cardImage, setCardImage] = useState(null);
  const [crop, setCrop] = useState({ unit: "px", width: 300, height: 400, x: 50, y: 50 });
  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setCardImage(URL.createObjectURL(file));
      setCrop({ unit: "px", width: 300, height: 400, x: 50, y: 50 });
      setCroppedFile(null);
    }
  };

  const handleCropComplete = async (crop) => {
    if (!imageRef.current || !crop.width || !crop.height) return;
    const cropped = await getCroppedImage(imageRef.current, crop, originalFile);
    setCroppedFile(cropped);
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {cardImage && (
        <div className="image-crop-container">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={handleCropComplete}
            keepSelection
            aspect={300 / 400}
          >
            <img ref={imageRef} src={cardImage} alt="Выбор области" className="full-size-image" />
          </ReactCrop>
        </div>
      )}
    </>
  );
}

async function getCroppedImage(image, crop, originalFile) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const fileName = originalFile ? originalFile.name : "cropped-image.jpg";
      const file = new File([blob], fileName, { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
}

export default CropImageEditor;
