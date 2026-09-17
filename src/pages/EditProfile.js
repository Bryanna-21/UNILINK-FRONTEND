import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  // Seeded from the cached user so the form opens with the current
  // name/bio instead of blank — previously this always started empty,
  // meaning a save without retyping the name would wipe it to "".
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || ""
  });

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Was PUT /users/profile — that route never existed on the
      // backend. The real route is PUT /profile/me, which returns
      // the updated user; push that into AuthContext too, or the
      // cached user (and this page's next load) would stay stale.
      const res = await API.put(
        "/profile/me",
        form
      );

      updateUser(res.data.data);
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
