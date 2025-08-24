(function(global) {
  'use strict';

  const SWLib = {};

  SWLib.register = function(swPath = '/sw.js') {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swPath)
        .then(reg => console.log('Service Worker geregistreerd:', reg.scope))
        .catch(err => console.error('SW registratie mislukt:', err));
    } else {
      console.warn('Service Workers niet ondersteund.');
    }
  };

  SWLib.isActive = function() {
    return !!(navigator.serviceWorker && navigator.serviceWorker.controller);
  };

  // Auto-register bij DOM ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    SWLib.register();
  } else {
    window.addEventListener('DOMContentLoaded', () => SWLib.register());
  }

  global.SWLib = SWLib;

})(window);
