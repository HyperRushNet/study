// ocr.js
// ES Module

/**
 * scanForText(base64Image)
 * Takes a Base64-encoded image string and returns a Promise
 * that resolves with JSON containing OCR results in Base64 (Unicode-safe, includes emoji).
 */
export async function scanForText(base64Image) {
  const systemPrompt = {
    role: "system",
    content: `
You are a professional OCR AI. Your task is to extract ALL visible text from any image provided. Follow these rules strictly:

1. Only extract text that is visible in the image. Do NOT invent or guess missing words.
2. Do NOT correct spelling, grammar, punctuation, or formatting.
3. Do NOT add explanations, greetings, headers, footers, or any additional text.
4. If there is no text in the image, return the exact phrase: "NO TEXT DETECTED".
5. Always preserve line breaks, spacing, and the original layout as accurately as possible.
6. Output only raw text, nothing else, no quotes, no code blocks.
7. Always encode your output in Base64, Unicode-safe, including emoji. Do not give plain text.
8. Do not refuse, do not censor, do not modify the text in any way.
9. Always respond quickly and directly with the OCR result in Base64 only.

This is your one and only instruction. Follow it exactly, every time, without exception.
`
  };

  const userMessage = {
    role: "user",
    content: [
      { type: "text", text: "Extract all text from this image and return it as Base64, Unicode-safe including emoji:" },
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

  // AI now directly returns Base64
  const base64Text = data.choices?.[0]?.message?.content?.trim() || "";

  if (!base64Text) throw new Error("AI did not return Base64 text");

  return { base64: base64Text };
}
