import React from "react";
import Button from "../Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../DialogBox";
import useActionStore from "../../providers/ActionStore";


const StartButtonIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17"
             fill="none">
            <g clipPath="url(#clip0_80_24)">
                <path
                    d="M14.5 7.63398C15.1667 8.01888 15.1667 8.98112 14.5 9.36602L6.25 14.1292C5.58333 14.5141 4.75 14.0329 4.75 13.2631L4.75 3.73686C4.75 2.96706 5.58333 2.48593 6.25 2.87083L14.5 7.63398Z"
                    stroke="#00FF2F" fill="#00FF2F" fillOpacity="0.1"/>
            </g>
            <defs>
                <clipPath id="clip0_80_24">
                    <rect width="17" height="17" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    )
}

// Start Button.
export interface StartButtonError {
    message: string;
    header: string;
}

type StartButtonProps = {
    onClick: () => StartButtonError | null;
}

const StartButton: React.FC<StartButtonProps> = ({onClick}) => {
    const [error, setError] = React.useState<StartButtonError | null>(null)
    return (
        <Dialog open={!!error}
                onOpenChange={(open) => !open && setError(null)}>
            <DialogTrigger asChild>
                <Button className="hover:bg-cmd-border"
                        disabled={useActionStore(state => state.block)} id="start-button"
                        onClick={() => {
                            const err = onClick();
                            if (err) setError(err)
                        }}
                >
                    <StartButtonIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="stop-dialog-content">
                <DialogHeader className="stop-dialog-header">
                    <DialogTitle className="stop-dialog-title">{error?.header}</DialogTitle>
                    <DialogDescription className="stop-dialog-description">
                        {error?.message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="stop-dialog-footer">
                    <DialogClose asChild>
                        <Button className="
                            flex items-center justify-center font-medium p-1 rounded-[5px]
                            bg-red-400 text-inherit cursor-pointer border-none transition-all
                            duration-200 hover:shadow-[0_0_0_2px_#ff6467]">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default StartButton
