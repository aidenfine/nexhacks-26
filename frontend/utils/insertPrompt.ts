import { fetchApi } from "./api";


export const insertPrompt = async (promptText: string, aggressiveness: number) => {
    console.log("Attempting to insert prompt:", promptText);

    const compressedPromptResponse = await fetchApi('/api/compress', promptText, aggressiveness)

    const compressedText = compressedPromptResponse.response.output

    const hostname = window.location.hostname;
    const isClaude = hostname.includes("claude.ai");
    const isChatGPT =
        hostname.includes("chatgpt.com") || hostname.includes("chat.openai.com");

    const selectors = isClaude
        ? [
            'div[contenteditable="true"]',
            '[contenteditable="true"]',
            'div.ProseMirror',
            'div[role="textbox"]'
        ]
        : [
            '#prompt-textarea',
            'textarea[placeholder*="Message"]',
            'textarea',
            'div[contenteditable="true"]'
        ];

    let input: HTMLElement | HTMLTextAreaElement | null = null;
    for (const selector of selectors) {
        input = document.querySelector(selector) as HTMLTextAreaElement;
        if (input) break;
    }

    if (!input) return console.error("Could not find input field");

    input.focus();
    if (input instanceof HTMLTextAreaElement) {
        input.value = compressedText;
    } else {
        input.textContent = compressedText;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    setTimeout(() => {
        const sendButtonSelectors = isClaude
            ? ['button[aria-label*="Send"]']
            : [
                'button[data-testid="send-button"]',
                'button[aria-label="Send prompt"]',
                'button[type="submit"]',
                'button svg[class*="icon"]'
            ];

        let sendButton: HTMLButtonElement | null = null;
        for (const selector of sendButtonSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                sendButton = element.closest("button") as HTMLButtonElement;
                if (sendButton && !sendButton.disabled) break;
            }
        }

        if (sendButton) sendButton.click();
        else console.log("Send button not found or disabled");
    }, 100);
};
