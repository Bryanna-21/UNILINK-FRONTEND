import { useState } from "react";
import API from "../services/api";
import MainLayout from "../layout/MainLayout";

export default function CreateEvent() {
  const [title, setTitle] =
    useState("");

  const [date, setDate] =
    useState("");

  const createEvent = async () => {
    try {
      await API.post("/events", {
        title,
        date
      });

      alert("Event Created");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <h2>Create Event</h2>

      <input
        value={title}
        onChange={e =>
          setTitle(e.target.value)
        }
      />

      <input
        type="date"
        value={date}
        onChange={e =>
          setDate(e.target.value)
        }
      />

      <button onClick={createEvent}>
        Create Event
      </button>
    </MainLayout>
  );
}
