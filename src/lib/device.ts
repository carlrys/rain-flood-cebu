// Heuristic device check used only to decide whether it's safe to auto-request
// geolocation on load (desktop) or require a tap first (mobile — see App.vue).
export function isLikelyMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent || ''
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua)

  // iPadOS Safari reports a desktop Mac user-agent by default, so catch it
  // via its touch-capable-Mac fingerprint instead.
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  return isMobileUA || isTouchMac
}
