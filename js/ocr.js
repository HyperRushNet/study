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
      content: "You are an OCR AI. Extract ALL text exactly as seen in the image. " +
               "Do not correct spelling, grammar, punctuation, or formatting. " +
               "Preserve all line breaks, spacing, and characters exactly as in the image. " +
               "If no text exists, respond with exactly 'No text detected in image.' " +
               "Absolutely do not summarize or interpret."
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "Extract all text from this image, preserving exact structure:" },
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
      // encode the exact AI output as Base64
      return btoa(unescape(encodeURIComponent(text)));
    } catch(err) {
      return btoa(unescape(encodeURIComponent("Error: " + err.message)));
    }
  };

})(window);
