import { useState } from "react";
import API from "../services/api";

export default function ImageUpload() {
  const [file, setFile] =
    useState(null);

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      await API.post(
        "/upload",
        formData
      );

      alert("Upload successful");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={upload}>
        Upload
      </button>
    </>
  );
}
