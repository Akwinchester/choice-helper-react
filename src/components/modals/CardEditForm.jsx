// src/components/modals/CardEditForm.jsx
import React from "react";
import CropImageEditor from "./CropImageEditor";

function CardEditForm({
  editedText,
  setEditedText,
  editedDesc,
  setEditedDesc,
  setOriginalFile,
  setCroppedFile,
  originalFile,
  croppedFile,
  onSave,
  onCancel
}) {
  return (
    <div className="form">
      <input
        type="text"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        className="input"
        placeholder="Название"
      />
      <textarea
        value={editedDesc}
        onChange={(e) => setEditedDesc(e.target.value)}
        className="input"
        placeholder="Описание"
      />
      <CropImageEditor
        originalFile={originalFile}
        setOriginalFile={setOriginalFile}
        setCroppedFile={setCroppedFile}
      />
      <button onClick={onSave} className="button green">Сохранить</button>
      <button onClick={onCancel} className="button gray">Отмена</button>
    </div>
  );
}

export default CardEditForm;
