import { Wallet } from "lucide-react-native";

import { CATEGORY_NAMES } from "../application/data";

/**
 * Gets the RGBA Color
 * @param hex The hex string
 * @param alpha The alpha number
 */
export function getRgbaColor(hex: string, alpha: number) {
  let r = 148, g = 163, b = 184;
  if (hex && hex.startsWith("#")) {
    const cleaned = hex.replace("#", "");
    if (cleaned.length === 6) {
      r = parseInt(cleaned.substring(0, 2), 16);
      g = parseInt(cleaned.substring(2, 4), 16);
      b = parseInt(cleaned.substring(4, 6), 16);
    } else if (cleaned.length === 3) {
      r = parseInt(cleaned.substring(0, 1) + cleaned.substring(0, 1), 16);
      g = parseInt(cleaned.substring(1, 2) + cleaned.substring(1, 2), 16);
      b = parseInt(cleaned.substring(2, 3) + cleaned.substring(2, 3), 16);
    }
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get the category icon and color
 * @param name The name of the category
 */
export function getCategoryIconAndColor(name: string) {
  const normName = name.toLowerCase();
  const found = CATEGORY_NAMES.find(chip => chip.label.toLowerCase().includes(normName) || normName.includes(chip.id) || normName.includes(chip.label.toLowerCase()));
  if (found) {
    return { Icon: found.icon, color: found.color };
  }
  return { Icon: Wallet, color: "#6366F1" }; // Fallback
}