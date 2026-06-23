import {
createContext,
useContext,
useEffect,
useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({
children,
}) => {
const [user, setUser] =
useState(null);

useEffect(() => {
const storedUser =
localStorage.getItem("user");

```
if (storedUser) {
  try {
    setUser(
      JSON.parse(storedUser)
    );
  } catch (error) {
    console.error(error);
    localStorage.removeItem(
      "user"
    );
  }
}
```

}, []);

const login = (
userData,
token
) => {
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

return (
<AuthContext.Provider
value={{
user,
login,
logout,
isAuthenticated:
!!localStorage.getItem(
"token"
),
}}
>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () =>
useContext(AuthContext);

export default AuthContext;
