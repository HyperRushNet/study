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
      content: "You are a professional OCR AI. Your task is to extract ALL text from the image exactly as it appears. " +
               "Do not correct any spelling, punctuation, grammar, formatting, or capitalization. " +
               "Preserve ALL line breaks, spaces, symbols, and special characters EXACTLY as in the image. " +
               "Do not summarize, interpret, explain, or provide any additional content. " +
               "If the image contains no text, respond with the exact string: 'No text detected in image.' " +
               "Under no circumstances should you add or remove any text, or alter the structure. " +
               "You must output only the text from the image and nothing else."
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "Extract all text from this image exactly, preserving full structure:" },
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
