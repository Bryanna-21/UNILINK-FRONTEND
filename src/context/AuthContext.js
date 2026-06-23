import {
createContext,
useContext,
useEffect,
useMemo,
useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] =
useState(true);

useEffect(() => {
try {
const storedUser =
localStorage.getItem("user");

```
  const token =
    localStorage.getItem("token");

  if (storedUser && token) {
    setUser(
      JSON.parse(storedUser)
    );
  }
} catch (error) {
  console.error(
    "Failed to load auth state:",
    error
  );

  localStorage.removeItem(
    "user"
  );

  localStorage.removeItem(
    "token"
  );
} finally {
  setLoading(false);
}
```

}, []);

const login = (
userData,
token
) => {
try {
localStorage.setItem(
"token",
token
);

```
  localStorage.setItem(
    "user",
    JSON.stringify(userData)
  );

  setUser(userData);
} catch (error) {
  console.error(
    "Login storage error:",
    error
  );
}
```

};

const logout = () => {
localStorage.removeItem(
"token"
);

```
localStorage.removeItem(
  "user"
);

setUser(null);
```

};

const updateUser = (
updatedUser
) => {
setUser(updatedUser);

```
localStorage.setItem(
  "user",
  JSON.stringify(updatedUser)
);
```

};

const value = useMemo(
() => ({
user,
loading,
login,
logout,
updateUser,
isAuthenticated:
!!localStorage.getItem(
"token"
),
}),
[user, loading]
);

return (
<AuthContext.Provider
value={value}
>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => {
const context =
useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
};

export default AuthContext;
