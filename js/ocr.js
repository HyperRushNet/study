// ocr.js
// ES Module

/**
 * scanForText(base64Image)
 * Takes a Base64-encoded image string and returns a Promise
 * that resolves with JSON containing all OCR text in raw form.
 */
export async function scanForText(base64Image) {
  const systemPrompt = {
    role: "system",
    content: `
You are an expert OCR AI. Your task is to extract every single visible character and word from any image provided, without omitting anything. Follow these rules strictly:

1. Extract ALL text, symbols, numbers, punctuation, emoji, line breaks, and spacing exactly as seen. NOT only the main content.
2. Do NOT invent or guess missing words.
3. Do NOT correct spelling, grammar, punctuation, or formatting.
4. ONLY give the text from the image, no extra explanation.
5. If there is no text, return the exact phrase: "NO TEXT DETECTED".
6. Preserve the original layout and line breaks as precisely as possible.
7. Output ONLY the raw text. Nothing else, no quotes, no code blocks, no additional formatting.
8. Do not refuse, censor, or modify the text in any way.

Follow these instructions strictly for every image.
`
  };

  const userMessage = {
    role: "user",
    content: [
      {
        type: "text",
        text: "Extract **ALL text** from this image exactly as seen, including emoji, symbols, numbers, punctuation, and spacing. No code blocks, no explanations, no additions."
      },
      {
        type: "image_url",
        image_url: { url: `data:image/png;base64,${base64Image}` }
      }
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

  const text = data.choices?.[0]?.message?.content || "NO TEXT DETECTED";

  // Unicode-safe Base64 encoding
  const base64Text = btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode('0x' + p1)
  ));

  return { text, base64: base64Text };
}
