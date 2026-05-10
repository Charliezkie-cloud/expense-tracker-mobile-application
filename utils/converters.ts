/**
 * Converts date object into a human readable date and time string
 * @param date The date object
 * @returns The human readable date and time string
 */
export function convertDateToDateString(date: Date) {
  const LOCALE = "en-US";
  
  const formattedDate = date.toLocaleDateString(LOCALE, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const formattedTime = date.toLocaleTimeString(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return `${formattedDate} ${formattedTime}`
}

/**
 * Converts number into a human readable currency format
 * @param amount The value of the number
 * @param currency The currency format string
 * @returns The human readable currency string
 */
export function convertNumberToCurrencyString(amount: number, currency: string = "PHP"): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}