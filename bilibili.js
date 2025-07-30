// bilibili.js
function nop(){}

const selectors = [
	'#app > div > div.m-video.m-video-normal > div.video-share > m-open-app.m-open-app.fixed-openapp',
	'#app > div > div.m-video.m-video-normal > div.video-share > m-open-app > div',
	'#app > div > div.m-video.m-video-normal > div.openapp-dialog',
	'#app > div > div.m-video.m-video-normal > div.caution-dialog',	
	'#app > div > div.m-navbar > div > m-open-app',
	'#app > div > div.m-home > m-open-app',
	'#app > div > m-open-app > button',
	'#app > div > div.m-video.m-video-normal > div.video-natural-search > div.fixed-wrapper > m-open-app.m-open-app.m-video-main-launchapp',
	'#app > div > div.m-footer',
	'#app > div > div.m-video.m-video-normal > div.play-page-gotop',
	'body > a',
	'#app > div > div.m-video.m-video-normal > div > div.m-video-info > div.title-wrapper > m-open-app',
	'#app > div > div.suspension > div > div.m-navbar > div > m-open-app',
	//Download app bar
	'#app > div > div.m-video.m-video-normal > div > div.m-video-info > div.bottom-wrapper > div.toolbar-wrapper', // This is the vote/share/downvote bar, we disable it first to prevent misclick since it will jump to app. To do reimplement this feature
	'#app > div > div.m-channel-view > m-open-app', //remove channel app download
	'#__next > div > div.TopBar_container__c1Jqv > div.TopBar_right__vfGeb > m-open-app',
	'#__next > div > m-open-app:nth-child(9)',
	'#__next div[class^="FooterText_container__"]'
];

function removeByPartialMatch(rootSelector, partialClassFragments) {
	const root = document.querySelector(rootSelector);
	if (!root) return;

	partialClassFragments.forEach(fragment => {
		const el = root.querySelector(`[class*="${fragment}"]`);
		if (el) {
			el.remove();
		}
	});
}



function fixOpenAppRedirects() {
	const titleEl = document.querySelector(
		'#app > div > div.m-video.m-video-normal > div.video-share > div.m-video-info > div.title-wrapper > div > m-open-app'
	);	
	document.querySelectorAll('m-open-app').forEach(el => {
		const url = el.getAttribute('universallink');
		if (url) {
			el.onclick = e => {
				e.preventDefault();
				e.stopImmediatePropagation();
				window.location.href = url;
			};
		}
		let useclipboard = el.getAttribute('useclipboard');
		if (useclipboard) {
			useclipboard = false
		}
	});
}
function removeMainButton() {
	const playerContainer = document.querySelector('#__next [class*="Player_container"]');

	if (!playerContainer) return;

	const mainButton = playerContainer.querySelector('[class*="MainButton_container"]');
	if (mainButton) {
		mainButton.remove();
	}
}
function removeSelectors() {

	selectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(node => {
			node.remove();
		});
	});
	removeMainButton();
	fixOpenAppRedirects();

// Select the <h1> element nested inside <m-open-app>
const appH1 = document.querySelector('#app .m-video-info .title-wrapper m-open-app > h1');

if (appH1) {
	// Select the container where <h1> should be moved
	const wrapper = document.querySelector('#app .m-video-info .title-wrapper');

	// Clone the <h1> and insert it at the beginning of the container
	wrapper.insertBefore(appH1.cloneNode(true), wrapper.firstChild);

	// Remove the <m-open-app> component completely
	const openAppWrapper = document.querySelector('#app .m-video-info .title-wrapper m-open-app');
	if (openAppWrapper) {
		openAppWrapper.remove();
	}
}

	let dialog = document.querySelector('body > div.v-dialog');
	if (dialog) {
		let cancelBtn = dialog.querySelector(
				'div.v-dialog__body span'
			);

		if (cancelBtn) {
			cancelBtn.click();
			return;
		}
	}


	const dialog2 = document.querySelector('body > div.v-dialog.open-app-dialog');
	const closeBtn2 = dialog2?.querySelector('div.icon-close');
	if (closeBtn2) {
		closeBtn2.click();
	}
}
removeSelectors(); // Initial cleanup
function loadblocker() {
	removeSelectors(); // Initial cleanup
	const observer = new MutationObserver(() => removeSelectors());

	const appRoot = document.querySelector('#app');

	if (appRoot) {
		observer.observe(appRoot, { childList: true, subtree: true });
	}

	const bodyRoot = document.querySelector('body');
	if (bodyRoot)
	{
		observer.observe(bodyRoot, { childList: true, subtree: true });
	}

}
window.addEventListener('load', loadblocker);

window.addEventListener('DOMContentLoaded', () => {
	loadblocker();
	fixOpenAppRedirects();
});

//block bilibili force copy content into the clipboard
window.addEventListener('copy', (e) => {
	const selectedText = window.getSelection()?.toString();
	if (!selectedText) return;

	const bilibiliPattern = /^(\d{4,})\s+[A-Za-z0-9+/=]{100,}\s+https:\/\/m\.bilibili\.com/;

	if (bilibiliPattern.test(selectedText)) {
		// Optionally block or sanitize here
		e.stopImmediatePropagation();
		e.preventDefault();
		return;
	}


}, true);
