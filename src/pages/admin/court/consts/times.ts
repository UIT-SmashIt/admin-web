export const TIMES: string[] = [];
for (let h = 6; h < 22; h++) {
  TIMES.push(`${String(h).padStart(2, '0')}:00`);
  TIMES.push(`${String(h).padStart(2, '0')}:30`);
}
