import { clsx, type ClassValue } from "clsx";

const cn = (...inputs: ClassValue[]) => {
    return clsx(inputs);
}
export default cn;