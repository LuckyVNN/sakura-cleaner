export function formatBytes(bytes) {
  const num = Number(bytes);
  if (!num || isNaN(num) || num <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Kawaii pastel palette for charts
export const kawaiiPalette = [
  '#f43f68', // Vibrant Sakura
  '#fb7185', // Strawberry rose
  '#fda4af', // Soft blush
  '#f472b6', // Pastel Pink
  '#c084fc', // Lilac
  '#e879f9', // Cotton candy
  '#a78bfa', // Lavender
  '#f9a8d4', // Carnation
  '#fb923c', // Peach
  '#38bdf8', // Sky pastel
  '#4ade80', // Mint
  '#facc15', // Buttercup
];
