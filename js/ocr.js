// ocr.js 2
// Simple JS OCR library using Pollinations AI with Base64 output (UTF-8 safe)

export async function scanForText(base64Image) {
  const payload = {
    model: "openai",
    messages: [
      {
        role: "system",
        content: `You are a highly accurate OCR AI. Your task is to extract **all visible text** from the uploaded image **exactly as it appears**, including:

- Every line, space, and character
- Repeated text exactly as it appears
- Special characters, numbers, symbols, and passwords
- Text formatting or order if visible (e.g., columns, line breaks)
- Maintain the **exact visual structure** of the text as on the image

Do NOT:
- Correct spelling or grammar
- Omit, censor, or modify any text
- Interpret or summarize the content
- Add anything that is not visually present

If no text is visible, return exactly: "No text found."

Return the extracted text exactly as-is, preserving the visual structure and all repetitions.`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Follow your system instructions precisely." },
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
  for (let i = 0; i < bytes.length; i++) {
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
