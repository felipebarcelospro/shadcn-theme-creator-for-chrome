/**
 * Converts a hex color to an RGB object.
 * @param {string} hex - The hex color string.
 * @returns {Object} An object with r, g, and b properties.
 */
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Generates CSS variables from theme variables.
 * @param {Record<string, string>} themeVariables - The theme variables.
 * @returns {string} A string of CSS variables.
 */
export const generateCssVariables = (themeVariables: Record<string, string>): string => {
  return Object.entries(themeVariables).map(([key, value]) => {
    const rgb = hexToRgb(value);
    return rgb ? `--${key}: ${rgb.r} ${rgb.g} ${rgb.b};` : '';
  }).join('\n');
};
