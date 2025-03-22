import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "../../styles/modals/CardDetailModal.css"; // оставим уникальное

function CardDetailModal({ isOpen, onClose, card, onUpdateCard, onDeleteCard, onCardUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card?.text || "");
  const [editedDesc, setEditedDesc] = useState(card?.short_description || "");

  const [cardImage, setCardImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [crop, setCrop] = useState({ unit: "px", width: 300, height: 400, x: 50, y: 50 });
  const [croppedFile, setCroppedFile] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      resetImageState();
      setIsEditing(false);
      setEditedText(card?.text || "");
      setEditedDesc(card?.short_description || "");
    }
  }, [isOpen, card]);

  const resetImageState = () => {
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

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("text", editedText);
    formData.append("short_description", editedDesc);

    if (croppedFile) {
      formData.append("image", croppedFile, croppedFile.name);
    }

    try {
      const updatedCard = await onUpdateCard(card.id, formData);
      onCardUpdated(updatedCard);
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении карточки:", error);
    }
  };

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Детали карточки</h2>
      {isEditing ? (
        <div className="form">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="input"
          />
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="input"
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
                <img
                  ref={imageRef}
                  src={cardImage}
                  alt="Выбор области"
                  className="full-size-image"
                />
              </ReactCrop>
            </div>
          )}

          <button onClick={handleSave} className="button green">Сохранить</button>
          <button onClick={() => setIsEditing(false)} className="button gray">Отмена</button>
        </div>
      ) : (
        <div className="card-view centered">
          {card.image_url && (
            <img
              src={`http://127.0.0.1:8000/${card.image_url}`}
              alt={card.text}
              className="img-cover"
            />
          )}
          <h3>{card.text}</h3>
          <p>{card.short_description}</p>
          <button onClick={() => setIsEditing(true)} className="button blue">Редактировать</button>
          <button
            onClick={() => {
              if (window.confirm("Вы уверены, что хотите удалить эту карточку?")) {
                onDeleteCard(card.id);
                onClose();
              }
            }}
            className="button red"
          >
            Удалить
          </button>
        </div>
      )}
    </Modal>
  );
}

export default CardDetailModal;
