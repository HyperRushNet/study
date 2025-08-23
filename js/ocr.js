// ocr.js
// Simple JS OCR library using Pollinations AI with Base64 output (UTF-8 safe)

export async function scanForText(base64Image) {
  const payload = {
    model: "openai",
    messages: [
      {
        role: "system",
        content: "You are an OCR AI. Extract ALL text from the uploaded image accurately. Do not correct spelling or add text. Only output visible text from the image. If no text is visible, say 'No text found. Please put the text in the exact structure that is shown in the image.'"
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

    // Encode text veilig naar Base64 (UTF-8 safe)
    const base64Text = utf8ToBase64(text);

    return { success: true, text: base64Text };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// --- UTF-8 safe Base64 helpers ---

export function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUtf8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
