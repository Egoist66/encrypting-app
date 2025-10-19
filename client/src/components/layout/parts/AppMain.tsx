import { Activity, useState } from "react";
import { Encryption } from "../../api/Encryption";
import { Decryption } from "../../api/Decryption";
import { Switcher } from "../../api/Switcher";

type Mode = "encrypt" | "decrypt";

export const AppMain = () => {
  const [mode, setMode] = useState<Mode>("encrypt");

  return (
    <main className="App-main">
      <div className="mode-container">
        <Switcher mode={mode} setMode={setMode} />

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
