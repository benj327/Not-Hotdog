import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import Confetti from "react-confetti";
import confetti from "canvas-confetti";

function App() {
  const [imageURL, setImageURL] = useState("");
  const [prediction, setPrediction] = useState("");
  const [celebrating, setCelebrating] = useState(false);
  const fireworkCanvas = useRef(null);

  useEffect(() => {
    if (celebrating && fireworkCanvas.current) {
      const fireworks = setInterval(() => {
        confetti({
          particleCount: 100,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          zIndex: 100,
          disableForReducedMotion: true,
        });
      }, 500);

      setTimeout(() => {
        clearInterval(fireworks);
      }, 5000);
    }
  }, [celebrating]);

  async function handleImageUpload(e) {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);

      const image = new Image();
      image.src = url;
      image.width = 224;
      image.height = 224;
      image.onload = async () => {
        const model = await mobilenet.load();
        const imgTensor = tf.browser.fromPixels(image).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
        const predictions = await model.classify(imgTensor);
        const topPrediction = predictions[0];

        if (topPrediction.className.toLowerCase().includes("hotdog")) {
          setPrediction("Hotdog");
          setCelebrating(true);
        } else {
          setPrediction("Not Hotdog");
          setCelebrating(false);
        }
      };
    }
  }

  return (
    <div className="App">
      <h1>Not Hotdog</h1>
      <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} />
      <label htmlFor="imageUpload">Choose an image</label>
      {imageURL && <img src={imageURL} alt="Selected" width="224" height="224" />}
      {prediction && (
        <>
          {prediction === "Hotdog" && <Confetti />}
          <div className="banner">{prediction}</div>
          {prediction === "Hotdog" && (
            <canvas ref={fireworkCanvas} style={{ top: 0, left: 0, zIndex: 100 }} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
