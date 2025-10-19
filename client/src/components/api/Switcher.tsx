export const Switcher = ({ mode, setMode }: { mode: "encrypt" | "decrypt", setMode: (mode: "encrypt" | "decrypt") => void }) => {
    return (
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
    )
}