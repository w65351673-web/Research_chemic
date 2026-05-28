export const contentType = 'image/svg+xml';
export const size = { width: 32, height: 32 };

export default function Icon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#0f172a"/>
  <rect x="2" y="2" width="28" height="28" rx="6" fill="none" stroke="rgba(220,38,38,0.6)" stroke-width="1.5"/>
  <ellipse cx="16" cy="16" rx="11" ry="4.5" fill="none" stroke="rgba(139,92,246,0.55)" stroke-width="1" transform="rotate(0,16,16)"/>
  <ellipse cx="16" cy="16" rx="11" ry="4.5" fill="none" stroke="rgba(167,139,250,0.45)" stroke-width="1" transform="rotate(60,16,16)"/>
  <ellipse cx="16" cy="16" rx="11" ry="4.5" fill="none" stroke="rgba(167,139,250,0.45)" stroke-width="1" transform="rotate(-60,16,16)"/>
  <circle cx="16" cy="16" r="3.2" fill="#dc2626"/>
  <circle cx="16" cy="16" r="1.8" fill="#f87171"/>
</svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
