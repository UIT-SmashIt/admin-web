export function getInpStyle(filled = false): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box' as const,
    border: `1.5px solid ${filled ? '#D4840A' : '#e8e8e8'}`,
    borderRadius: 9, padding: '9px 13px', fontSize: 13.5, fontFamily: 'inherit',
    color: '#1a1a1a', background: filled ? '#FFFBF5' : '#fafafa', outline: 'none', transition: 'all 0.15s',
  };
}