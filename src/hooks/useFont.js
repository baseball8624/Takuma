import { useState, useEffect } from 'react';

const FONTS = [
    { id: 'pixel', name: 'ピクセル', family: '"DotGothic16", sans-serif' },
    { id: 'gothic', name: 'ゴシック', family: '"Noto Sans JP", sans-serif' },
    { id: 'rounded', name: '丸ゴシック', family: '"M PLUS Rounded 1c", sans-serif' },
    { id: 'mincho', name: '明朝', family: '"Noto Serif JP", serif' },
];

export function useFont() {
    const [fontId, setFontId] = useState(() => {
        return localStorage.getItem('self_hero_font') || 'pixel';
    });

    const font = FONTS.find(f => f.id === fontId) || FONTS[0];

    useEffect(() => {
        localStorage.setItem('self_hero_font', fontId);
        document.documentElement.style.setProperty('--font-family', font.family);
    }, [fontId, font]);

    return {
        font,
        setFontId,
        availableFonts: FONTS
    };
}
