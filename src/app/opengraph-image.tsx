import { ImageResponse } from 'next/og';

export const alt = 'Gradient — 136 guided engineering lessons';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SocialImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FAF7F0', color: '#292723', padding: 64, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg width="56" height="56" viewBox="0 0 28 28"><rect x="2" y="17" width="6" height="9" rx="2" fill="#A54C35" opacity=".5"/><rect x="11" y="10" width="6" height="16" rx="2" fill="#A54C35" opacity=".75"/><rect x="20" y="2" width="6" height="24" rx="2" fill="#A54C35"/></svg>
        <span style={{ fontSize: 36, fontWeight: 600 }}>Gradient</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 60, fontWeight: 600, maxWidth: 960 }}>Your next small step in C++ and DSA.</div>
        <div style={{ fontSize: 30, color: '#514D45' }}>136 guided lessons. Small practice tasks. Spaced recall.</div>
      </div>
      <div style={{ display: 'flex', fontSize: 24, color: '#A54C35' }}>At your pace, with room to return.</div>
    </div>,
    size
  );
}
