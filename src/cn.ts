import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tw-merge';

// Custom cn utility function that combines clsx and tw-merge
const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(...inputs));
};

export default cn;
