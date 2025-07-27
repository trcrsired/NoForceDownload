// content.js

const bilibili = {
  domains: ['bilibili.com', 'dl.app.bilibili.com'],
  blockPatterns: [/\.apk$/i, /app\.bilibili\.com/i]
};

const baidu = {
  domains: ['tieba.baidu.com', 'baidu.com'],
  blockPatterns: [/appredirect/i, /baiduapp:\/\//i]
};

const rules = [bilibili, baidu]; // Expand with more rule modules

const hostname = location.hostname;

// Select the rule matching current domain
const activeRule = rules.find(rule =>
  rule.domains.some(domain => hostname.includes(domain))
);

/**
 * Checks whether a given URL or string matches known blocked patterns
 * for the current domain.
 */
export function shouldBlock(url) {
  if (!activeRule) return false;
  return activeRule.blockPatterns.some(pattern => pattern.test(url));
}


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
