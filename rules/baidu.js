export default {
  domains: ['baidu.com', 'tieba.baidu.com'],
  blockPatterns: [
    // APK and app download URLs
    /\.apk$/i,
    /wenku-down\.baidu\.com/i,
    /tieba\.baidu\.com\/appredirect/i,
    /baiduapp:\/\/open/i,

    // Meta refresh to app schemes or download links
    /http-equiv=["']refresh["']\s+content=["']\d+;\s*url=.*\.apk["']/i,

    // Tieba-specific forced redirects
    /\/tb\/client\/redirect/i,
    /tieba-open-app\./i
  ]
};
