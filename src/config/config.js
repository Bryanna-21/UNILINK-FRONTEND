import env from "./env";

const config = {

  appName: env.APP_NAME,

  version: env.APP_VERSION,

  apiBaseUrl: env.API_URL,

  socketUrl: env.SOCKET_URL,

  appUrl: env.APP_URL,

  environment: env.NODE_ENV,

  upload: {

    maxImageSize: 5 * 1024 * 1024,

    allowedImages: [

      "image/jpeg",

      "image/png",

      "image/webp",

      "image/jpg"

    ]

  },

  pagination: {

    feedLimit: 20,

    commentLimit: 20,

    notificationLimit: 30,

    messageLimit: 50

  },

  emergency: {

    refreshInterval: 10000,

    locationTimeout: 15000

  }

};

export default config;
