import { useState } from "react";
import API from "../services/api";
export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    bio: ""
  });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await API.put(
        "/users/profile",
        form
      );

      alert("Profile Updated");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <textarea
          placeholder="Bio"
          value={form.bio}
          onChange={e =>
            setForm({
              ...form,
              bio: e.target.value
            })
          }
        />

        <button type="submit">
          Save Profile
        </button>
      </form>
    </>
  );
}
