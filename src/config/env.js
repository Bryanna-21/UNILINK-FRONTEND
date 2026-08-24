const env = {
  APP_NAME: "UniLink",

  APP_VERSION: "1.0.0",

  API_URL:
    process.env.REACT_APP_API_URL ||
    "https://unilink-backend-1.onrender.com/api",

  SOCKET_URL:
    process.env.REACT_APP_SOCKET_URL ||
    "https://unilink-backend-1.onrender.com",

  NODE_ENV:
    process.env.NODE_ENV || "development",

  APP_URL:
    process.env.REACT_APP_URL ||
    "http://localhost:3000",

  GOOGLE_CLIENT_ID:
    process.env.REACT_APP_GOOGLE_CLIENT_ID || "",

  MAPBOX_TOKEN:
    process.env.REACT_APP_MAPBOX_TOKEN || "",

  CLOUDINARY_CLOUD_NAME:
    process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "",

  CLOUDINARY_UPLOAD_PRESET:
    process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "",

  ENABLE_NOTIFICATIONS:
    process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true",

  ENABLE_CHAT:
    process.env.REACT_APP_ENABLE_CHAT === "true",

  ENABLE_EMERGENCY:
    process.env.REACT_APP_ENABLE_EMERGENCY === "true",

  ENABLE_ANALYTICS:
    process.env.REACT_APP_ENABLE_ANALYTICS === "true",
};

export default env;
