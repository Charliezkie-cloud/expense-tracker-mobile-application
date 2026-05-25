import {ThemeMode} from "../theme/themeSchemes";

export type CurrencyCode = "PHP" | "USD" | "EUR" | "GBP" | "JPY" | "CNY" | "CAD" | "AUD" | "INR";
export type Settings = {
  currencyCode: CurrencyCode;
  theme: ThemeMode;
};