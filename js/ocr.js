// ocr.js
// ES Module

/**
 * scanForText(base64Image)
 * Takes a Base64-encoded image string and returns a Promise
 * that resolves with JSON containing OCR results in Base64.
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
  const text = data.choices?.[0]?.message?.content || "No text detected";

  // Convert AI text output to Base64
  const base64Text = btoa(unescape(encodeURIComponent(text)));

  return { base64: base64Text };
}
