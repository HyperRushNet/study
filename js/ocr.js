// ocr.js - UITLEVERBARE JS-BIBLIOTHEEK
// Voeg toe via <script src="https://hyperrushnet.github.io/study/js/ocr.js?v=1.0"></script>

(function(global) {
  /**
   * scanForText(base64Image)
   * base64Image: Base64-encoded PNG/JPG image string
   * Returns a Promise resolving to JSON with OCR results
   */
  global.scanForText = async function(base64Image) {
    if (!base64Image) throw new Error("No base64 image provided");

    const systemPrompt = {
      role: "system",
      content: "You are an OCR AI with the strictest instructions possible. " +
        "Extract 100% of all visible text in the image exactly as it appears. " +
        "Do not correct spelling, grammar, or formatting. Do not remove any text, " +
        "even if it is gibberish, misaligned, or in foreign characters. " +
        "Maintain line breaks, spacing, and punctuation exactly as in the image. " +
        "If the image contains no text at all, respond with a clear message 'No text detected in image.' " +
        "Absolutely do not interpret, summarize, or skip anything."
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "Extract ALL text from this image with absolute precision:" },
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
      return data.choices?.[0]?.message?.content || { error: "No text detected" };
    } catch(err) {
      return { error: err.message };
    }
  };

})(window);
