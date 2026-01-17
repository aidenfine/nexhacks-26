import { useState } from "react"

function IndexPopup() {
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState("")

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setStatus("Please enter a prompt");
      return;
    }

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) return setStatus("No active tab found");

      await chrome.tabs.sendMessage(tab.id, { type: "INSERT_PROMPT", prompt });
      setStatus("Prompt sent! ✓");
      setPrompt("");
      setTimeout(() => setStatus(""), 2000);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      style={{
        minWidth: "450px",
        minHeight: "300px",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#fff"
      }}>
      {/* Logo instead of text title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>Tiny</span>
        <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>T</span>

        {/* Token "o" */}
        <div style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '2px',
          marginRight: '2px',
          marginBottom: '-2px'
        }}>
          {/* Outer ring (gold token) */}
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #ca8a04 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Inner ring */}
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: '2px solid #fcd34d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Center circle */}
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: '2px solid #fcd34d',
                  opacity: 0.6
                }}></div>
              </div>
            </div>
          </div>

          {/* Shine effect */}
          <div style={{
            position: 'absolute',
            top: '4px',
            left: '7px',
            width: '8px',
            height: '8px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.4,
            filter: 'blur(2px)'
          }}></div>
        </div>

        <span style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>ken</span>
      </div>

      <p style={{
        margin: "0 0 16px 0",
        fontSize: "14px",
        color: "#666"
      }}>
        Enter your prompt and we'll send it to the chat
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your prompt here... (Shift+Enter for new line)"
        autoFocus
        style={{
          width: "100%",
          minHeight: "150px",
          padding: "12px",
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          lineHeight: "1.5"
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          marginTop: "16px",
          padding: "12px",
          border: "none",
          background: "#10a37f",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
          transition: "background 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#0d8c6f"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#10a37f"}>
        Send to Chat
      </button>

      {status && (
        <p style={{
          marginTop: "12px",
          fontSize: "14px",
          color: status.includes("✓") ? "#10a37f" : "#ef4444",
          textAlign: "center",
          fontWeight: "500"
        }}>
          {status}
        </p>
      )}
    </div>
  )
}

export default IndexPopup