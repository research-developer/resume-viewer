import React from "react";

interface DateProps {
  /**
   * The date to be displayed. Can be a string, Date object, null, or undefined
   */
  date: string | Date | null | undefined;

  /**
   * Optional format options for date display
   */
  options?: Intl.DateTimeFormatOptions;

  /**
   * Optional locale for date formatting
   */
  locale?: string;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Optional fallback text when date is null/undefined
   */
  fallback?: string;
}

/**
 * Date component for displaying dates with proper formatting
 */
export const DateUI: React.FC<DateProps> = ({
  date,
  options = {
    year: "numeric",
    month: "short",
  },
  locale = "en-US",
  className = "date-display",
  fallback = "",
}) => {
  if (!date) {
    return fallback ? <span className={className}>{fallback}</span> : null;
  }

  try {
    // Convert string date to Date object if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return (
        <span className={`${className} invalid-date`}>{date.toString()}</span>
      );
    }

    const formattedDate = dateObj.toLocaleDateString(locale, options);
    return <span className={className}>{formattedDate}</span>;
  } catch (error) {
    // Fallback for any parsing errors
    return <span className={`${className} date-error`}>{String(date)}</span>;
  }
};

export default DateUI;
