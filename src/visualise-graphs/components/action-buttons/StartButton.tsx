import React from "react";
import Button from "@graph/components/action-buttons/Button";
import useGraphStore from "@graph/api/FrontendStateManager";
import {match} from "ts-pattern";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@graph/components/DialogBox";
import * as StartButtonActions from "@graph/components/action-buttons/startButtonActions";


const StartButtonIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
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
const StartButton = () => {
    const [error, setError] = React.useState<{
        encountered: boolean,
        message?: string,
        header?: string
    }>({encountered: false})
    return (
        <Dialog open={error.encountered} onOpenChange={(open) => !open && setError({encountered: false})}>
            <DialogTrigger asChild>
                <Button disabled={useGraphStore(state => state.block)} className="button" id="start-button"
                        onClick={() => {
                            const algoFile = useGraphStore.getState().activeFiles.ts;
                            const err = StartButtonActions.startButtonClick(algoFile)
                            match(err)
                                .with(StartButtonActions.Exception.START_NODE_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        Start Node is of type NOTSET.
        This exception is thrown by the Runtime Environment because no Start Node has been selected.`,
                                    header: "RTE 0x01"
                                }))
                                .with(StartButtonActions.Exception.END_NODE_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        End Node is NOTSET.
        This exception is thrown by the Runtime Environment because no End Node has been selected.`,
                                    header: "RTE 0x02"
                                }))
                                .with(StartButtonActions.Exception.ALGORITHM_NOTSET, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Runtime Exception while trying to execute, because:
        No Algorithm has been selected.
        Please select an algorithm before attempting to run the visualization.`,
                                    header: "RTE 0x03"
                                }))
                                .with(StartButtonActions.Exception.BI_DIRECTIONAL_EXTRA_ARGS, () => setError({
                                    encountered: true,
                                    message: `
        Encountered a Compile Time Error while trying to compile, because:
        Argument mismatch occurred.
        A Bi Directional Search cannot be started with a Bomb Node, Start Node & End Node.
        You must have only 2 Nodes, (Start Node & End Node).
                                    `,
                                    header: "CTE 0x01"
                                }))
                        }}>
                    <StartButtonIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="stop-dialog-content">
                <DialogHeader className="stop-dialog-header">
                    <DialogTitle className="stop-dialog-title">{error.header}</DialogTitle>
                    <DialogDescription className="stop-dialog-description">
                        {error.message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="stop-dialog-footer">
                    <DialogClose asChild>
                        <Button className="stop-dialog-cancel-button">
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default StartButton

