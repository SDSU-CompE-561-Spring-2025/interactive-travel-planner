'use client';

import { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    placeholderText?: string;
    className?: string;
}

export const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(
    ({ selected, onChange, minDate, placeholderText, className }, ref) => {
        return (
            <div className="relative">
                <ReactDatePicker
                    selected={selected}
                    onChange={onChange}
                    minDate={minDate}
                    placeholderText={placeholderText}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className || ''}`}
                    dateFormat="MMMM d, yyyy"
                    ref={ref}
                />
            </div>
        );
    }
);

DatePicker.displayName = 'DatePicker'; 