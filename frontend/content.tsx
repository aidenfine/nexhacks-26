import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
    matches: [
        "https://claude.ai/*",
        "https://chatgpt.com/*",
        "https://chat.openai.com/*"
    ]
}

// Function to insert prompt into the page
const insertPrompt = (promptText: string) => {
    console.log("Attempting to insert prompt:", promptText)

    const isClaude = window.location.hostname.includes("claude.ai")
    const isChatGPT = window.location.hostname.includes("chatgpt.com") ||
        window.location.hostname.includes("chat.openai.com")

    console.log("Is Claude:", isClaude, "Is ChatGPT:", isChatGPT)

    if (isClaude) {
        // Try multiple selectors for Claude
        const selectors = [
            'div[contenteditable="true"]',
            '[contenteditable="true"]',
            'div.ProseMirror',
            'div[role="textbox"]'
        ]

        let input: HTMLElement | null = null
        for (const selector of selectors) {
            input = document.querySelector(selector) as HTMLElement
            if (input) {
                console.log("Found Claude input with selector:", selector)
                break
            }
        }

        if (input) {
            input.focus()
            input.textContent = promptText
            input.dispatchEvent(new Event('input', { bubbles: true }))
            input.dispatchEvent(new Event('change', { bubbles: true }))
            console.log("Inserted into Claude input")

            // Try to find and click the send button for Claude
            setTimeout(() => {
                const sendButton = document.querySelector('button[aria-label*="Send"]') as HTMLButtonElement
                if (sendButton && !sendButton.disabled) {
                    sendButton.click()
                    console.log("Clicked Claude send button")
                }
            }, 100)
        } else {
            console.error("Could not find Claude input field")
        }
    } else if (isChatGPT) {
        // Try multiple selectors for ChatGPT
        const selectors = [
            '#prompt-textarea',
            'textarea[placeholder*="Message"]',
            'textarea',
            'div[contenteditable="true"]'
        ]

        let input: HTMLTextAreaElement | HTMLElement | null = null
        for (const selector of selectors) {
            input = document.querySelector(selector) as HTMLTextAreaElement
            if (input) {
                console.log("Found ChatGPT input with selector:", selector)
                break
            }
        }

        if (input) {
            input.focus()
            if (input instanceof HTMLTextAreaElement) {
                input.value = promptText
            } else {
                input.textContent = promptText
            }
            input.dispatchEvent(new Event('input', { bubbles: true }))
            input.dispatchEvent(new Event('change', { bubbles: true }))
            console.log("Inserted into ChatGPT input")

            // Try to find and click the send button for ChatGPT
            setTimeout(() => {
                const sendButtonSelectors = [
                    'button[data-testid="send-button"]',
                    'button[aria-label="Send prompt"]',
                    'button[type="submit"]',
                    'button svg[class*="icon"]' // Button with icon
                ]

                let sendButton: HTMLButtonElement | null = null
                for (const selector of sendButtonSelectors) {
                    const element = document.querySelector(selector)
                    if (element) {
                        sendButton = element.closest('button') as HTMLButtonElement
                        if (sendButton) {
                            console.log("Found ChatGPT send button with selector:", selector)
                            break
                        }
                    }
                }

                if (sendButton && !sendButton.disabled) {
                    sendButton.click()
                    console.log("Clicked ChatGPT send button")
                } else {
                    console.log("Send button not found or disabled")
                }
            }, 100)
        } else {
            console.error("Could not find ChatGPT input field")
        }
    }
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

                <h2 style={{ margin: "0 0 8px 0", color: "#333" }}>TinyToken</h2>
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