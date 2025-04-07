import React from 'react';

export function PrevButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" className = "button" id = "prev-button"{...props}>
            <rect width="17" height="17" rx="5" fill="#FE640B" fill-opacity="0.39"/>
            <path d="M4.80859 11.1969C4.80859 11.1969 8.54798 14.7053 11.4784 11.9364C13.182 10.3268 13.2248 6.96281 11.4784 5.41602C8.85645 3.09371 4.80859 6.74129 4.80859 6.74129" stroke="#FE640B" stroke-width="2.5"/>
            <path d="M3.21695 8.12877L3.89018 5.1894C3.98172 4.78973 4.40875 4.65587 4.65885 4.94845L6.49814 7.10021C6.74823 7.39279 6.6338 7.89238 6.29217 7.99947L3.77966 8.78707C3.43803 8.89417 3.12541 8.52844 3.21695 8.12877Z" fill="#FE640B" stroke="#FE640B"/>
        </svg>
    )
}

export function RunButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" id = "run-button" className ="button" {...props}>
            <rect width="17" height="17" rx="5" fill="#00FF2F" fill-opacity="0.39"/>
            <path d="M13.75 7.20096C14.75 7.77831 14.75 9.22169 13.75 9.79904L7 13.6962C6 14.2735 4.75 13.5518 4.75 12.3971L4.75 4.60288C4.75 3.44818 6 2.7265 7 3.30385L13.75 7.20096Z" fill="#00FF2F"/>
        </svg>
    )
}

export function StopButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" {...props} id="stop-button" className = "button">
            <rect width="17" height="17" rx="5" fill="#FF0000" fill-opacity="0.39"/>
            <path d="M12.8086 4.19141L4.19087 12.8091" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
            <path d="M4.19141 4.19141L12.8091 12.8091" stroke="#FF0000" stroke-width="3" stroke-linecap="round"/>
        </svg>
    )
}
