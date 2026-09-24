import React from 'react';
import { SmartDateInput, SmartDateInputProps } from './SmartDateInput';

export type DateInputProps = SmartDateInputProps;

/**
 * Universal DateInput component (Alias to SmartDateInput)
 */
export const DateInput: React.FC<DateInputProps> = (props) => {
  return <SmartDateInput {...props} />;
};

export default DateInput;
