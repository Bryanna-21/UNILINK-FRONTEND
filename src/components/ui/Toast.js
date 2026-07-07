import React from "react";
import { Toaster } from "react-hot-toast";

const Toast = () => {

  return (

    <Toaster

      position="top-right"

      reverseOrder={false}

      gutter={8}

      toastOptions={{

        duration: 3500,

        style: {

          fontSize: "14px",

          borderRadius: "12px",

          padding: "14px 18px",

        },


        success: {

          duration: 3000,

        },


        error: {

          duration: 5000,

        }

      }}

    />

  );

};


export default Toast;
