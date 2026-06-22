import { useAuth } from "../context/AuthContext";

const { login } = useAuth();

const handleSubmit = async (e) => {
e.preventDefault();

try {
const res = await API.post(
"/auth/login",
form
);

```
login(
  res.data.user,
  res.data.token
);

navigate("/feed");
```

} catch (err) {
console.error(err);
alert(
err.response?.data?.message ||
"Login failed"
);
}
};
