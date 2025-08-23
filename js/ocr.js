// ocr.js
// Simple JS OCR library using Pollinations AI with Base64 output

export async function scanForText(base64Image) {
  const payload = {
    model: "openai",
    messages: [
      {
        role: "system",
        content: "You are an OCR AI. Extract ALL text from the uploaded image accurately. Do not correct spelling or add text. Only output visible text from the image. If no text is visible, say 'No text found.'"
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract all text from this image:" },
          { type: "image_url", image_url: { url: "data:image/png;base64," + base64Image } }
        ]
      }
    ]
  };

  try {
    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No text returned.";

    // Encode the text as Base64
    const base64Text = btoa(unescape(encodeURIComponent(text)));

    return { success: true, text: base64Text };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
