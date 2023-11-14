import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Header from "./components/header";
import Form from "./components/formFile";
import CameraFeed from "./components/cameraFeed";

function App() {
  // "undefined" means the URL will be computed from the `window.location` object
  // const URL =
  //   process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

  // const socket = io(URL);

  const [count, setCount] = useState(0);
  const [start_stremaing, setStartStreaming] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    console.log(start_stremaing);
  }, [start_stremaing]);

  return (
    <div className="flex flex-col h-screen w-screen  bg-slate-400">
      <Header></Header>
      <div className="flex flex-col w-screen h-screen items-center pt-40">
        <div className="h-40">
          <h3>Seleccioná el archivo:</h3>
          <Form set={setStartStreaming}></Form>
        </div>
        <CameraFeed start_stremaing={start_stremaing}></CameraFeed>
      </div>
    </div>
    // <div className="App">
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src="/vite.svg" className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://reactjs.org" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR!
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </div>
  );
}

export default App;
