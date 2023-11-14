import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000/streaming");

const CameraFeed = ({ start_stremaing }) => {
  const [image, setImage] = useState(null);
  const handleButtonClick = () => {
    setImage(false);
    if (start_stremaing) {
      socket.emit("stop_video_feed", "15");
    }
  };

  useEffect(() => {
    if (start_stremaing) {
      socket.emit("video_feed", "15");
    }
    console.log("hola");
  }, [start_stremaing]);

  useEffect(() => {
    socket.on("video_frame", (image) => {
      setImage(image.image);
    });
    socket.on("connect", () => {
      console.log("me conecté");
    });
    return () => {
      socket.off("connect", () => {});
      socket.off("video_frame", () => {});
    };
  }, [socket]);

  if (!image) {
    return <div>Primero debes subir un archivo para ver la cámara.</div>;
  }

  return (
    <>
      <img id="camera-feed" src={`data:image/png;base64,${image}`} />
      <button
        className="mt-5"
        onClick={(e) => {
          handleButtonClick();
        }}
      >
        Parar transmisión
      </button>
    </>
  );
};

export default CameraFeed;
