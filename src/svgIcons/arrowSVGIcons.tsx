import React from 'react';
import '../css/navbar.css';

export function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow" {...props}>
            <path d="M1.52544 0L6.49123 5.13485L11.457 0L12.9825 1.58082L6.49123 8.30769L0 1.58082L1.52544 0Z" fill="#959595" />
        </svg>
    )
}