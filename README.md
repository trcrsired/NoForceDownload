# NoForceDownload 🚫📥

A lightweight browser extension designed to **block automatic app redirection** and **forced APK downloads** on mobile websites like Bilibili and Baidu.

## 📚 Features

- Removes `<meta http-equiv="refresh">` tags used for app redirects
- Intercepts `window.location.assign`, `replace`, and `open` calls to prevent unwanted downloads
- Removes hidden `<iframe>` elements that trigger APK downloads
- Modular domain-based rule system for easy scalability (e.g., TikTok, WhatsApp, Weibo)

## 🚀 Supported Sites

- bilibili.com
- baidu.com  
*(More sites can be added via modular rule definitions in the `/rules` directory)*
