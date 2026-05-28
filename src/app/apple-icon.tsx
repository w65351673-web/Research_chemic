export const contentType = 'image/svg+xml';
export const size = { width: 180, height: 180 };

export default function AppleIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#0f172a"/>
  <rect x="10" y="10" width="160" height="160" rx="30" fill="none" stroke="rgba(220,38,38,0.6)" stroke-width="4"/>
  <ellipse cx="90" cy="90" rx="62" ry="25" fill="none" stroke="rgba(139,92,246,0.55)" stroke-width="3.5" transform="rotate(0,90,90)"/>
  <ellipse cx="90" cy="90" rx="62" ry="25" fill="none" stroke="rgba(167,139,250,0.45)" stroke-width="3" transform="rotate(60,90,90)"/>
  <ellipse cx="90" cy="90" rx="62" ry="25" fill="none" stroke="rgba(167,139,250,0.45)" stroke-width="3" transform="rotate(-60,90,90)"/>
  <circle cx="90" cy="90" r="18" fill="#dc2626"/>
  <circle cx="90" cy="90" r="10" fill="#f87171"/>
</svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
