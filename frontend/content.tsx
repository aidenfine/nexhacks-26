import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import { insertPrompt } from "~utils/insertPrompt"

export const config: PlasmoCSConfig = {
    matches: [
        "https://claude.ai/*",
        "https://chatgpt.com/*",
        "https://chat.openai.com/*"
    ]
}

const AutoPopup = () => {
    const [isVisible, setIsVisible] = useState(true)
    const [prompt, setPrompt] = useState("")

    useEffect(() => {
        console.log("AutoPopup loaded on:", window.location.href)

        // Listen for messages from the popup
        const messageListener = (message: any, sender: any, sendResponse: any) => {
            console.log("Received message:", message)
            if (message.type === "INSERT_PROMPT") {
                insertPrompt(message.prompt)
                sendResponse({ success: true })
            }
            return true
        }

        try {
            chrome.runtime.onMessage.addListener(messageListener)
        } catch (error) {
            console.error("Error setting up message listener:", error)
        }

        return () => {
            try {
                chrome.runtime.onMessage.removeListener(messageListener)
            } catch (error) {
                // Extension context may be invalidated
            }
        }
    }, [])

    const handleSubmit = () => {
        if (!prompt.trim()) return
        insertPrompt(prompt)
        setIsVisible(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    if (!isVisible) return null

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999
            }}>
            <div
                style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    maxWidth: "500px",
                    width: "90%",
                    position: "relative",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        border: "none",
                        background: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#666"
                    }}>
                    ×
                </button>

                {/* Logo instead of text title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Tiny</span>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>T</span>

                    {/* Token "o" */}
                    <div style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '1px',
                        marginRight: '1px',
                        marginBottom: '-2px'
                    }}>
                        {/* Outer ring (gold token) */}
                        <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #ca8a04 100%)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Inner ring */}
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                border: '2px solid #fcd34d',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Center circle */}
                                <div style={{
                                    width: '13px',
                                    height: '13px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
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
                            top: '3px',
                            left: '6px',
                            width: '7px',
                            height: '7px',
                            background: 'white',
                            borderRadius: '50%',
                            opacity: 0.4,
                            filter: 'blur(2px)'
                        }}></div>
                    </div>

                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>ken</span>
                </div>

                <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "14px" }}>
                    Enter your prompt and we'll send it to the chat
                </p>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your prompt here..."
                    autoFocus
                    style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box"
                    }}
                />

                <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => setIsVisible(false)}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #ddd",
                            background: "#f3f4f6",
                            color: "#374151",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            background: "#10a37f",
                            color: "white",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}>
                        Send to Chat
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AutoPopup