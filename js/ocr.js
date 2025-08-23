// ocr.js
// Expose a global function `scanForText` that takes base64 image and returns JSON
function scanForText(base64) {
  return new Promise(async (resolve, reject) => {
    if (!base64) {
      reject(new Error("No image data provided"));
      return;
    }

    try {
      // Using Pollinations OpenAI API
      const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [
            {
              role: "system",
              content: "You are an OCR AI. Extract all visible text from the image. Do not fix spelling or change the layout. Return JSON: { text: '...' }."
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Extract text from this image:" },
                { type: "image_url", image_url: { url: "data:image/png;base64," + base64 } }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      resolve({ text });
    } catch (err) {
      reject(err);
    }
  });
}
