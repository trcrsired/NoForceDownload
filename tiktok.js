// Attempts to dismiss TikTok's middle and bottom CTA prompts by clicking their cancel buttons
function dismissTikTokAppPrompts() {
  // Middle CTA: "Not now"
  const middleCancelBtn = document.querySelector('[data-e2e="alt-middle-cta-cancel-btn"]');
  if (middleCancelBtn && middleCancelBtn.offsetParent !== null) {
    middleCancelBtn.click();
  }

  // Bottom CTA: "Log in"
  const bottomCancelBtn = document.querySelector('[data-e2e="bottom-cta-cancel-btn"]');
  if (bottomCancelBtn && bottomCancelBtn.offsetParent !== null) {
    bottomCancelBtn.click();
  }

	// Floating "Discover more" button
	const floatBtnWrapper = document.querySelector('.matrix-smart-wrapper > div[class*="DivFloatButtonWrapper"]');
  if (floatBtnWrapper) {
    floatBtnWrapper.remove();
  }
}

// Run once immediately in case the prompts are already present
dismissTikTokAppPrompts();

// Wait for DOM to be ready, then observe for dynamic CTA injection
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver(() => dismissTikTokAppPrompts());
  observer.observe(document.body, { childList: true, subtree: true });
});

// Prevent automatic navigation to onelink.me
const originalAssign = window.location.assign;
window.location.assign = function(url) {
  if (url.includes('onelink.me')) {
    console.log('[noforcedownload] Blocked location.assign to onelink.me:', url);
    return;
  }
  originalAssign.call(window.location, url);
};

const originalReplace = window.location.replace;
window.location.replace = function(url) {
  if (url.includes('onelink.me')) {
    console.log('[noforcedownload] Blocked location.replace to onelink.me:', url);
    return;
  }
  originalReplace.call(window.location, url);
};

const originalOpen = window.open;
window.open = function(url, ...args) {
  if (url.includes('onelink.me')) {
    console.log('[noforcedownload] Blocked window.open to onelink.me:', url);
    return null;
  }
  return originalOpen.call(window, url, ...args);
};
