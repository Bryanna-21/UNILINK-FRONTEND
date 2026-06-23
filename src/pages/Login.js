import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
const navigate = useNavigate();
const { login } = useAuth();

const [form, setForm] = useState({
email: "",
password: "",
});

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]:
e.target.value,
});
};

const handleSubmit = async (
e
) => {
e.preventDefault();

```
setError("");
setLoading(true);

try {
  const res = await API.post(
    "/auth/login",
    form
  );

  const {
    token,
    user,
  } = res.data;

  login(user, token);

  switch (user.role) {
    case "admin":
      navigate("/admin");
      break;

    case "lecturer":
      navigate(
        "/lecturer"
      );
      break;

    default:
      navigate(
        "/student"
      );
  }
} catch (err) {
  setError(
    err.response?.data
      ?.message ||
      "Login failed"
  );
} finally {
  setLoading(false);
}
```

};

return ( <div className="auth-container"> <div className="auth-card"> <h1>UniLink</h1>

```
    <h2>Login</h2>

    {error && (
      <p className="error">
        {error}
      </p>
    )}

    <form
      onSubmit={
        handleSubmit
      }
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={
          form.email
        }
        onChange={
          handleChange
        }
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={
          form.password
        }
        onChange={
          handleChange
        }
        required
      />

      <button
        type="submit"
        disabled={
          loading
        }
      >
        {loading
          ? "Signing In..."
          : "Login"}
      </button>
    </form>

    <p>
      Don't have an
      account?{" "}
      <Link to="/register">
        Register
      </Link>
    </p>
  </div>
</div>
```

);
}
