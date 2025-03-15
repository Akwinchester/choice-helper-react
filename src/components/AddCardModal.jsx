import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './AddCardModal.css';

function AddCardModal({ isOpen, onClose, onCreateCard }) {
  const [cardText, setCardText] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardImage, setCardImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 300, height: 400, x: 50, y: 50 });
  const [croppedFile, setCroppedFile] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // Сброс состояния
  const resetState = () => {
    setCardText('');
    setCardDesc('');
    setCardImage(null);
    setOriginalFile(null);
    setCroppedFile(null);
    setCrop({ unit: 'px', width: 300, height: 400, x: 50, y: 50 });
  };

  // Загружаем новое изображение и сбрасываем старый обрезанный фрагмент
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOriginalFile(file);
      setCardImage(URL.createObjectURL(file));
      setCrop({ unit: 'px', width: 300, height: 400, x: 50, y: 50 });
      setCroppedFile(null);
    }
  };

  // Обрезка изображения при завершении выбора
  const handleCropComplete = async (crop) => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    const cropped = await getCroppedImage(imageRef.current, crop, originalFile);
    setCroppedFile(cropped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardText.trim()) return;

    const formData = new FormData();
    formData.append('text', cardText);
    formData.append('short_description', cardDesc);

    if (croppedFile) {
      formData.append('image', croppedFile);
    }

    onCreateCard(formData);
    resetState(); // Сбрасываем форму после сохранения
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Новая карточка</h2>
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
              aspect={300 / 400} // Фиксируем пропорции
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

// Функция для получения обрезанного изображения в виде `File`
async function getCroppedImage(image, crop, originalFile) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

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
      const file = new File([blob], originalFile.name, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}

export default AddCardModal;
