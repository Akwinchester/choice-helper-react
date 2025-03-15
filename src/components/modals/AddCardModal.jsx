import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./AddCardModal.css";

function AddCardModal({ isOpen, onClose, onCreateCard }) {
  const [cardText, setCardText] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [cardImage, setCardImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [crop, setCrop] = useState({ unit: "px", width: 300, height: 400, x: 50, y: 50 });
  const [croppedFile, setCroppedFile] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setCardText("");
    setCardDesc("");
    setCardImage(null);
    setOriginalFile(null);
    setCroppedFile(null);
    setCrop({ unit: "px", width: 300, height: 400, x: 50, y: 50 });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardText.trim()) return;

    const formData = new FormData();
    formData.append("text", cardText);
    formData.append("short_description", cardDesc);

    if (croppedFile) {
      formData.append("image", croppedFile, "cropped-image.jpg");
    } else if (originalFile) {
      formData.append("image", originalFile, originalFile.name);
    }

    // 🔍 Логируем данные перед отправкой
    console.log("📤 Отправляем данные:", Object.fromEntries(formData.entries()));

    try {
      await onCreateCard(formData);
      resetState();
      onClose();
    } catch (error) {
      console.error("❌ Ошибка при создании карточки:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создание новой карточки</h2>
      <form className="add-card-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название карточки"
          value={cardText}
          onChange={(e) => setCardText(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={cardDesc}
          onChange={(e) => setCardDesc(e.target.value)}
        />
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

        <button type="submit">Сохранить</button>
      </form>
    </Modal>
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

export default AddCardModal;
