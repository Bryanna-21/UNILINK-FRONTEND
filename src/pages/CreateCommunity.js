import { useState } from "react";
import API from "../services/api";
import MainLayout from "../layout/MainLayout";

export default function CreateCommunity() {
  const [name, setName] =
    useState("");

  const submit = async () => {
    try {
      await API.post(
        "/communities",
        { name }
      );

      alert("Community Created");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <h2>Create Community</h2>

      <input
        value={name}
        onChange={e =>
          setName(e.target.value)
        }
      />

      <button onClick={submit}>
        Create
      </button>
    </MainLayout>
  );
}
