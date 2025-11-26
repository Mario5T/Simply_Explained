import { useState } from 'react';

const PRESET_COLORS = [
    '#000000',
    '#e03131',
    '#2f9e44',
    '#1971c2', 
    '#f08c00', 
    '#ae3ec9',
    '#0c8599', 
    '#e8590c',
];

interface ColorPickerProps {
    color: string;
    onChange: (c: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [customColor, setCustomColor] = useState(color);

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        onChange(newColor);
    };

    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((presetColor) => (
                <button
                    key={presetColor}
                    className={`excali-color-swatch ${color === presetColor ? 'selected' : ''}`}
                    style={{ backgroundColor: presetColor }}
                    onClick={() => onChange(presetColor)}
                    title={`Color: ${presetColor}`}
                    aria-label={`Select color ${presetColor}`}
                />
            ))}

            {/* Custom color button */}
            <div style={{ position: 'relative' }}>
                <button
                    className={`excali-color-swatch ${!PRESET_COLORS.includes(color) ? 'selected' : ''}`}
                    style={{
                        background: `conic-gradient(
                            red, yellow, lime, aqua, blue, magenta, red
                        )`,
                    }}
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    title="Custom color"
                    aria-label="Select custom color"
                />
                {showCustomPicker && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '40px',
                            left: '0',
                            zIndex: 1000,
                            background: 'var(--color-canvas)',
                            border: '1.5px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-sm)',
                            boxShadow: 'var(--shadow-md)',
                        }}
                    >
                        <input
                            type="color"
                            value={customColor}
                            onChange={handleCustomColorChange}
                            style={{
                                width: '100px',
                                height: '100px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
