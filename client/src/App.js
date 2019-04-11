import React, { useState } from "react";
import gif from "./movie.gif";

export default function App() {
  const [text, setText] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    if (text) {
      // make request to server to chnage gif subtitle
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={gif} className="App-logo" alt="logo" />
      </header>
      <form onSubmit={handleSubmit} className="flex justify-center p-5">
        <input
          type="text"
          className="border-black border-solid border-2"
          onChange={event => setText(event.target.value)}
          value={text}
        />
      </form>
    </div>
  );
}
