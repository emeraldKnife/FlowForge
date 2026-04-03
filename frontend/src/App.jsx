import { useEffect, useState } from "react";
import { getMessage } from "./services/api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessage().then(setMessage);
  }, []);

  return (
    <div>
      <h1>FlowForge</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
