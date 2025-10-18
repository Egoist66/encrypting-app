import { Activity, useState } from "react";
import { Encryption } from "../../api/Encryption";
import { Decryption } from "../../api/Decryption";

type Mode = "encrypt" | "decrypt";

export const AppMain = () => {
  const [mode, setMode] = useState<Mode>("encrypt");

  return (
    <main className="App-main">
      <div className="mode-container">
        <div className="mode-switcher">
          <button
            className={mode === "encrypt" ? "active" : ""}
            onClick={() => setMode("encrypt")}
          >
            🔒 Зашифровать
          </button>
          <button
            className={mode === "decrypt" ? "active" : ""}
            onClick={() => setMode("decrypt")}
          >
            🔓 Расшифровать
          </button>
        </div>


        <Activity mode={mode === "encrypt" ? "visible" : "hidden"}>
          <Encryption />
        </Activity>
        <Activity mode={mode === "decrypt" ? "visible" : "hidden"}>
          <Decryption />
        </Activity>
      </div>
    </main>
  );
};
