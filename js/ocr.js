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
      content: "You are an OCR AI. Extract ONLY the text that is visible in the image. " +
               "Do NOT add any labels, headings, commentary, or prefixes. " +
               "Do NOT add 'Extracted text:' or any other words. " +
               "Do NOT correct spelling, grammar, punctuation, formatting, or capitalization. " +
               "Preserve ALL line breaks, spaces, symbols, and special characters EXACTLY as in the image. " +
               "Do not summarize or interpret. " +
               "If there is no text, respond ONLY with exactly: 'No text detected in image.'"
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "Extract all text from this image exactly as it appears, without adding anything:" },
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
