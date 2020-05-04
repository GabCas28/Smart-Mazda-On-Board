import React, { useEffect, useState } from "react";
import "./App.css";
// import Gauge from "./components/Gauge";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      fetch("/time")
        .then((res) => res.json())
        .then(async (data) => {
          setCurrentTime(data.time);
        });
    }, 1000);
  });
  return (
    <div className="App">
      <header className="App-header">
        {/* <Gauge/> */}
        <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default App;
