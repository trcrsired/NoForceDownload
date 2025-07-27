// content.js
import { shouldBlock } from 'blocker.js';

(() => {
  /**
   * Block <meta http-equiv="refresh"> redirections.
   */
  const metaTags = document.querySelectorAll('meta[http-equiv="refresh"]');
  metaTags.forEach(meta => {
    if (shouldBlock(meta.content)) {
      meta.remove();
      console.log('[NoForceDownload] Removed meta refresh tag:', meta.content);
    }
  });

  /**
   * Intercept window.location.assign and window.location.replace.
   */
  ['assign', 'replace'].forEach(fn => {
    const original = window.location[fn];
    window.location[fn] = function (url) {
      if (shouldBlock(url)) {
        console.log(`[NoForceDownload] Blocked location.${fn} to:`, url);
      } else {
        original.call(window.location, url);
      }
    };
  });

  /**
   * Intercept window.open to block APK URLs or app scheme redirects.
   */
  const originalOpen = window.open;
  window.open = function (url, ...args) {
    if (shouldBlock(url)) {
      console.log('[NoForceDownload] Blocked window.open call to:', url);
      return null;
    }
    return originalOpen.call(window, url, ...args);
  };

  /**
   * Remove iframes attempting to trigger forced downloads.
   */
  const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        if (
          node.tagName === 'IFRAME' &&
          typeof node.src === 'string' &&
          shouldBlock(node.src)
        ) {
          node.remove();
          console.log('[NoForceDownload] Removed malicious iframe:', node.src);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
