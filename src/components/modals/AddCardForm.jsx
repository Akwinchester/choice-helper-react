// src/components/modals/AddCardForm.jsx
import React from "react";
import CropImageEditor from "./CropImageEditor";

function AddCardForm({
  cardText,
  setCardText,
  cardDesc,
  setCardDesc,
  originalFile,
  setOriginalFile,
  croppedFile,
  setCroppedFile,
  onSubmit
}) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Название карточки"
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
        className="input"
      />
      <textarea
        placeholder="Описание"
        value={cardDesc}
        onChange={(e) => setCardDesc(e.target.value)}
        className="input"
      />
      <CropImageEditor
        originalFile={originalFile}
        setOriginalFile={setOriginalFile}
        setCroppedFile={setCroppedFile}
      />
      <button type="submit" className="button green">Сохранить</button>
    </form>
  );
}

export default AddCardForm;
