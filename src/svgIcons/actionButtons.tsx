import React from 'react';
import '../css/navbar.css';
import '../css/actionButtons.css';

export function PrevButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="button" id="prev-button" {...props}>
            <rect width="17" height="17" rx="2" fill="#262626" />
            <path
                d="M8.6683 6.66667C6.98534 6.66667 5.46116 7.32667 4.28627 8.4L2 6V12H7.71568L5.41671 9.58667C6.29946 8.81333 7.42355 8.33333 8.6683 8.33333C10.9165 8.33333 12.828 9.87333 13.4949 12L15 11.48C14.1172 8.68667 11.6214 6.66667 8.6683 6.66667Z"
                fill="#8167AD" />
        </svg>
    )
}

export function RunButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="button" id="run-button" {...props}>
            <rect width="17" height="17" rx="2" fill="#262626" />
            <path d="M15 9L4.5 15.0622L4.5 2.93782L15 9Z" fill="#499C54" />
        </svg>
    )
}

export function StopButtonIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="button" id="stop-button" {...props}>
            <rect width="17" height="17" rx="2" fill="#262626" />
            <rect x="5.12134" y="3" width="13" height="3" transform="rotate(45 5.12134 3)"
                fill="#FF0000" />
            <rect width="13" height="3"
                transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.1924 3)" fill="#FF0000" />
        </svg>
    )
}