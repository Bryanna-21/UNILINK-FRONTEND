const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    setLoading(false);
    return;
  }

  try {
    const response = await API.post(
      "/auth/register",
      {
        name: form.name,
        email: form.email,
        password: form.password,
      }
    );

    if (response.data.success) {
      navigate("/");
    } else {
      setError(
        response.data.message ||
          "Registration failed."
      );
    }
  } catch (err) {
    console.error(err);

    setError(
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Registration failed."
    );
  } finally {
    setLoading(false);
  }
};
