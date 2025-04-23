import React from "react";
import cn from "../../../cn";

type ButtonProps = React.ComponentPropsWithoutRef<"button">

const Button: React.FC<ButtonProps> = ({disabled = false, children, style, className, onClick, id}) => {
    return (
        <button disabled={disabled} style={style} className={cn(
            "inline-block align-middle border-none bg-transparent p-0 rounded-[2px]",
            "transition-transform duration-300 ease-in-out",
            disabled? "pointer-events-none grayscale-[50%]" : "hover:cursor-pointer",
            className
        )} onClick={onClick} id={id}>
            {children}
        </button>
    )
}

export default Button