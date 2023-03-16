import React, { useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

function App() {
  const [imageURL, setImageURL] = useState("");
  const [prediction, setPrediction] = useState("");

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
        } else {
          setPrediction("Not Hotdog");
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
      <p>{prediction}</p>
    </div>
  );
}

export default App;
