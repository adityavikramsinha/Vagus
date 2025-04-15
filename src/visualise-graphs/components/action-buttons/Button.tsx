import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">

const Button: React.FC<ButtonProps> = ({disabled = false, children, style, className, onClick, id}) => {
    return (
        <button disabled={disabled} style={style} className={className} onClick={onClick} id={id}>
            {children}
        </button>
    )
}

export default Button