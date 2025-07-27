// blocker.js
import bilibili from './rules/bilibili.js';
import baidu from './rules/baidu.js';
// Add future sites here: import tiktok from './rules/tiktok.js';

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
