// sw-register.js
(function (global) {
  'use strict';

  // Bibliotheek object
  const SWLib = {};

  /**
   * Registreer de Service Worker
   * @param {string} swPath - Pad naar je Service Worker bestand
   */
  SWLib.register = function(swPath = './sw.js') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swPath)
        .then(registration => {
          console.log(`Service Worker geregistreerd: ${registration.scope}`);
        })
        .catch(error => {
          console.error('Service Worker registratie mislukt:', error);
        });
    } else {
      console.warn('Service Workers worden niet ondersteund in deze browser.');
    }
  };

  /**
   * Controleer of er een actieve Service Worker is
   * @returns {boolean}
   */
  SWLib.isActive = function() {
    return navigator.serviceWorker && navigator.serviceWorker.controller ? true : false;
  };

  // Auto-register bij load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    SWLib.register();
  } else {
    window.addEventListener('DOMContentLoaded', () => SWLib.register());
  }

  // Exporteer naar global object
  global.SWLib = SWLib;

})(window);
