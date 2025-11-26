import React, { useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";

export default function AdminUploadDoc() {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const upload = async () => {
    const form = new FormData();
    form.append("file", file);

    const res = await API.post(`/docs/upload/${id}`, form);
    alert("Uploaded!");
  };

  return (
    <div className="container mt-4">
      <h3>Upload Document</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn btn-primary" onClick={upload}>Upload</button>
    </div>
  );
}
