// sw-register.js
(function(global) {
  'use strict';

  const SWLib = {};

  /**
   * Registreer de Service Worker
   * @param {string} swPath - pad naar de SW
   */
  SWLib.register = function(swPath = '/sw.js') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swPath)
        .then(reg => {
          console.log(`Service Worker geregistreerd: ${reg.scope}`);
        })
        .catch(err => {
          console.error('SW registratie mislukt:', err);
        });
    } else {
      console.warn('Service Workers niet ondersteund.');
    }
  };

  /**
   * Check of SW actief is
   * @returns {boolean}
   */
  SWLib.isActive = function() {
    return navigator.serviceWorker && navigator.serviceWorker.controller ? true : false;
  };

  // Auto-register bij DOMContentLoaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    SWLib.register();
  } else {
    window.addEventListener('DOMContentLoaded', () => SWLib.register());
  }

  global.SWLib = SWLib;

})(window);
