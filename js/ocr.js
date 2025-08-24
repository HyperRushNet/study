// ocr.js
(function(global) {

  /**
   * scanForText(base64Image)
   * Returns a Promise resolving to base64-encoded string of the exact AI OCR output
   */
  global.scanForText = async function(base64Image) {
    if (!base64Image) throw new Error("No base64 image provided");

    const systemPrompt = {
      role: "system",
      content: "You are an OCR AI. ONLY return the text that is visible in the image. " +
               "Do NOT add labels, commentary, explanations, instructions, or extra words. " +
               "Do NOT correct spelling, grammar, or formatting. " +
               "Preserve all line breaks, spaces, symbols, and characters exactly as in the image. " +
               "If there is no text, return exactly: 'No text detected in image.' " +
               "Output ONLY the text, nothing else."
    };

    const userMessage = {
      role: "user",
      content: [
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
      const text = data.choices?.[0]?.message?.content || "No text detected in image.";
      return btoa(unescape(encodeURIComponent(text)));
    } catch(err) {
      return btoa(unescape(encodeURIComponent("Error: " + err.message)));
    }
  };

})(window);
