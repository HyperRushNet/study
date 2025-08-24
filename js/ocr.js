// ocr.js - Gewone JS bibliotheek
// Laad met <script src="https://hyperrushnet.github.io/study/js/ocr.js?v=1.1"></script>

(function(global) {
  /**
   * scanForText(base64Image)
   * base64Image: Base64-encoded PNG/JPG image string WITHOUT line breaks
   * Returns a Promise resolving to JSON with OCR results
   */
  global.scanForText = async function(base64Image) {
    if (!base64Image) throw new Error("No base64 image provided");

    // Verwijder mogelijke line breaks
    const cleanBase64 = base64Image.replace(/\s+/g, '');

    const systemPrompt = {
      role: "system",
      content: "You are an OCR AI. Extract 100% of ALL visible text from the image EXACTLY as it appears. " +
               "Do not correct spelling, grammar, or punctuation. " +
               "Do not interpret, summarize, or skip anything. " +
               "Preserve line breaks, spacing, fonts, and all characters as visible in the image. " +
               "If there is no text, clearly respond: 'No text detected in image.'"
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "Extract ALL text from this image:" },
        { type: "image_url", image_url: { url: `data:image/png;base64,${cleanBase64}` } }
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
      return data.choices?.[0]?.message?.content || { error: "No text detected" };
    } catch(err) {
      return { error: err.message };
    }
  };

})(window);
