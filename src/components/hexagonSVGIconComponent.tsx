import React from 'react';


interface HexIconProps {
  idSVG?: string;
  idPATH?: string;
}
export function HexIcon(props:HexIconProps) {
    return (
        <svg className="icon no-node" xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 30"
             fill="currentColor" id={props.idSVG}>
            <path id={props.idPATH} d="M26.763 27.7849L32.9536 17.0625C33.6904 15.7862 33.6904 14.2138 32.9536 12.9375L26.763
            2.21507C26.0261 0.938788 24.6643 0.152567 23.1906 0.152567L10.8094 0.152567C9.33568 0.152567
            7.97391 0.938787 7.23705 2.21507L1.04645 12.9375C0.309585 14.2138 0.309585 15.7862 1.04645
            17.0625L7.23705 27.7849C7.97391 29.0612 9.33568 29.8474 10.8094 29.8474L23.1906 29.8474C24.6643 29.8474
            26.0261 29.0612 26.763 27.7849Z" stroke="#484E5B" strokeWidth="0.25"/>
        </svg>
    )
}
