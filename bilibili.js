// bilibili.js
function nop(){}
if (location.hostname === 'm.bilibili.com') 
{
	const selectors = [
		'#app > div > div.m-video.m-video-normal > div.openapp-dialog',
		'#app > div > div.m-video.m-video-normal > div.video-share > m-open-app.m-open-app.fixed-openapp',
		'#app > div > div.m-video.m-video-normal > div.video-share > m-open-app > div',
		'#app > div > div.m-video.m-video-normal > div.caution-dialog',	
		'#app > div > div.m-navbar > div > m-open-app',
		'#app > div > div.m-home > m-open-app',
		'#app > div > m-open-app > button',
		'#app > div > div.m-video.m-video-normal > div.video-natural-search > div.fixed-wrapper > m-open-app.m-open-app.m-video-main-launchapp',
		'#app > div > div.m-footer'
	];
	const partialSelectors =  [
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
	window.addEventListener('load', () => {
		removeSelectors(); // Initial cleanup
		const observer = new MutationObserver(() => removeSelectors());

		const appRoot = document.querySelector('#app');
		console.log("appRoot=",appRoot);
		if (appRoot) {
			observer.observe(appRoot, { childList: true, subtree: true });
		}

		const bodyRoot = document.querySelector('body');
		if (bodyRoot)
		{
			observer.observe(bodyRoot, { childList: true, subtree: true });
		}
	});

	window.addEventListener('DOMContentLoaded', fixOpenAppRedirects);

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

}
