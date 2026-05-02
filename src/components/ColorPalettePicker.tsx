type PaletteItem = {
  color: string;
  text: string;
};

type ColorPalettePickerProps = {
  label?: string;
  palette: PaletteItem[];
  selectedPalette: PaletteItem;
  onChange: (palette: PaletteItem) => void;
};

export function ColorPalettePicker({
                                     label = 'MÀU SẮC',
                                     palette,
                                     selectedPalette,
                                     onChange,
                                   }: ColorPalettePickerProps) {
  return (
    <div>
      <label
        style={{
          fontSize: 11.5,
          color: '#999',
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {palette.map((p, i) => {
          const isSelected = selectedPalette === p;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(p)}
              title={`Màu ${i + 1}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.12s',
                background: p.color,
                border: `2.5px solid ${isSelected ? p.text : 'transparent'}`,
                boxShadow: isSelected ? `0 0 0 2px ${p.text}30` : 'none',
              }}
            >
              {isSelected && (
                <span style={{ fontSize: 13, color: p.text }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}