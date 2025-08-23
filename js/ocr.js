/**
 * scanForText
 * @param {string} base64Image - Base64 string of the image
 * @returns {Promise<Object>} JSON response from OCR AI
 */
async function scanForText(base64Image) {
  const systemPrompt = {
    role: "system",
    content: "You are an OCR AI. Extract ALL text from the uploaded image as accurately as possible. Do not correct spelling or change content. Only output what is visible in the image. If there is no text, respond with: 'No text found in the image.'"
  };

  const userMessage = {
    role: "user",
    content: [
      { type: "text", text: "Extract all text from this image:" },
      { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } }
    ]
  };

  try {
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
    const text = data.choices?.[0]?.message?.content || "No text returned.";

    return {
      success: true,
      text: text,
      raw: data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      raw: null
    };
  }
}

/**
 * Convert a File object to a Base64 string
 * @param {File} file
 * @returns {Promise<string>}
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* Example usage:
const fileInput = document.querySelector("input[type='file']");
fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  const base64 = await fileToBase64(file);
  const result = await scanForText(base64);
  console.log(result);
});
*/
