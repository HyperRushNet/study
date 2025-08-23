// ocr.js
/**
 * scanForText(base64Image)
 * Takes a Base64-encoded image string and returns a Promise
 * that resolves with JSON containing OCR results.
 */
export async function scanForText(base64Image) {
    const systemPrompt = {
        role: "system",
        content: "You are an OCR AI. Extract ALL text from the image. If there is no text, respond clearly indicating that. Do not correct spelling or change content."
    };

    const userMessage = {
        role: "user",
        content: [
            { type: "text", text: "Extract all text from this image:" },
            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } }
        ]
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "openai",
            messages: [systemPrompt, userMessage]
        })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || { error: "No text detected" };
}
