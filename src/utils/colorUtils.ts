export const toRGBA = (rgb: string, opacity: number): string => {
  return rgb.replace("rgb", "rgba").replace(")", `, ${opacity})`);
};

export const baseShadow = (color: string): string => {
  return `0 8px 12px -2px ${toRGBA(color, 0.8)}, 0 4px 8px -2px ${toRGBA(
    color,
    0.06
  )}`;
};

export const hoverShadow = (color: string): string => {
  return `0 25px 50px -12px ${color.replace("1)", "0.9)")}`;
};
export const membershipColorPalette = [
  "rgb(247, 68, 113)", // Softened red (originally bright red)
  "rgb(68, 175, 247)", // Muted blue (originally bright blue)
  "rgb(69, 241, 186)", // Pastel teal (originally bright cyan)
  "rgb(255, 216, 120)", // Creamy yellow (originally bright yellow)
  "rgb(173, 133, 255)", // Lavender (originally medium purple)
];
