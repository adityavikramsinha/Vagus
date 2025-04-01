import React from 'react';
import '../css/navbar.css';

export function ProjectIcon(props:React.SVGProps<SVGSVGElement>){
    return(
        <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg"{...props}>
            <rect width="19.2453" height="15" fill="#C4C4C4"/>
            <rect x="1.06604" y="3.33032" width="17.1132" height="10.3208" fill="#2079AD" stroke="black"/>
        </svg>

    )
}