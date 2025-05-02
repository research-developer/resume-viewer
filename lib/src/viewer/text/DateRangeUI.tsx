import React from "react";
import DateUI from "./DateUI";

interface DateRangeUIProps {
  /**
   * Start date of the range (optional)
   */
  startDate?: string | Date | null;

  /**
   * End date of the range (optional)
   */
  endDate?: string | Date | null;

  /**
   * Optional format options for date display
   */
  options?: Intl.DateTimeFormatOptions;

  /**
   * Optional locale for date formatting
   */
  locale?: string;

  /**
   * Optional text to display if startDate is present but endDate is not
   * (typically used to indicate "Present" or "Current")
   */
  currentText?: string;

  /**
   * Optional separator between start and end dates
   */
  separator?: string | React.JSX.Element;

  /**
   * Optional CSS class name for the container
   */
  className?: string;

  /**
   * Optional CSS class name for the start date
   */
  startClassName?: string;

  /**
   * Optional CSS class name for the end date
   */
  endClassName?: string;

  /**
   * Optional CSS class name for the separator
   */
  separatorClassName?: string;
}

/**
 * DateRange component for displaying a range of dates
 */
export const DateRangeUI: React.FC<DateRangeUIProps> = ({
  startDate,
  endDate,
  options = {
    year: "numeric",
    month: "short",
  },
  locale = "en-US",
  currentText = "Present",
  separator = " - ",
  className = "inline-flex items-center text-sm text-muted",
  startClassName = "font-medium",
  endClassName = "font-medium",
  separatorClassName = "mx-1 text-muted opacity-50",
}) => {
  // If both dates are missing, don't render anything
  if (!startDate && !endDate) {
    return null;
  }

  return (
    <div className={className}>
      {startDate && (
        <DateUI
          date={startDate}
          options={options}
          locale={locale}
          className={startClassName}
        />
      )}

      {startDate && (endDate || currentText) && (
        <span className={separatorClassName}>{separator}</span>
      )}

      {endDate ? (
        <DateUI
          date={endDate}
          options={options}
          locale={locale}
          className={endClassName}
        />
      ) : startDate && currentText ? (
        <span className={`${endClassName} text-accent-green`}>
          {currentText}
        </span>
      ) : null}
    </div>
  );
};

export default DateRangeUI;
