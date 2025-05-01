import React from "react";
import cn from "../cn";

type ButtonProps = React.ComponentPropsWithoutRef<"button">

const Button: React.FC<ButtonProps> = ({disabled = false, children, style, className, onClick, id}) => {
    return (
        <button
            disabled={disabled}
            style={style}
            className={cn(
                "inline-block align-middle border-none bg-transparent rounded-[5px] duration-500 ease-in-out p-0.5 transition-colors",
                disabled ? "pointer-events-none grayscale-[50%]" : "hover:cursor-pointer",
                className
            )}
            onClick={onClick} id={id}
        >
            {children}
        </button>
    )
}

export default Button
