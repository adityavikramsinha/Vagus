import Button from "../../../visualise-graphs/components/action-buttons/Button";

const EdgeCostEditor = ({
                            edgeCost,
                            onChange,
                        }: {
    edgeCost: number;
    onChange: (newCost: number) => void;
}) => {
    return (
        <div className="flex items-center gap-3 px-3 py-2  rounded-md justify-center">
            <Button
                onClick={() => onChange(edgeCost - 1)}
                className="px-2 py-1 rounded bg-cmd-bg hover:bg-cmd-border transition-colors duration-300"
            >
                –
            </Button>
            <span className="min-w-[2.5rem] text-center text-[#fff] font-mono text-sm">
                {edgeCost}
            </span>
            <Button
                onClick={() => onChange(edgeCost + 1)}
                className="px-2 py-1 rounded bg-cmd-bg hover:bg-cmd-border transition-colors duration-300"
            >
                +
            </Button>
        </div>
    );
};

export default EdgeCostEditor;
