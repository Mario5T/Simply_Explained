const BRUSH_SIZES = [
    { size: 2, label: 'Thin' },
    { size: 4, label: 'Normal' },
    { size: 8, label: 'Bold' },
    { size: 12, label: 'Extra Bold' },
];

interface BrushSizeProps {
    size: number;
    onChange: (s: number) => void;
}

export default function BrushSize({ size, onChange }: BrushSizeProps) {
    return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {BRUSH_SIZES.map((brushOption) => (
                <button
                    key={brushOption.size}
                    className={`excali-brush-btn ${size === brushOption.size ? 'selected' : ''}`}
                    onClick={() => onChange(brushOption.size)}
                    title={`${brushOption.label} (${brushOption.size}px)`}
                    aria-label={`Select ${brushOption.label} brush size`}
                >
                    <div
                        className="excali-brush-preview"
                        style={{
                            width: `${Math.min(brushOption.size * 2, 20)}px`,
                            height: `${Math.min(brushOption.size * 2, 20)}px`,
                        }}
                    />
                </button>
            ))}
        </div>
    );
}
