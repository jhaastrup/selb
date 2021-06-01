import { ClockIcon, XIcon } from "@heroicons/react/solid";
import { ArrowUpRight, ArrowDownLeft } from "app/components/icons";

export const getColor = (code) => {
    switch (code) {
        case 'in_escrow':
            return {
                backgroundColor: "bg-yellow-700",
                color: "text-black",
                icon: ClockIcon,
            };
        case 'paid':
            return {
                backgroundColor: "bg-green-700",
                color: "text-green-700",
                icon: ArrowUpRight,
            };
        case 'cancelled':
            return {
                backgroundColor: "bg-red-700",
                color: "text-red-700",
                icon: XIcon,
            };
        case 'exception':
            return {
                backgroundColor: "bg-red-700",
                color: "text-red-700",
                icon: XIcon,
            };
        default:
            return {
                backgroundColor: "bg-gray-300",
                color: "text-gray-300",
                icon: ArrowDownLeft,
            };
    }
};