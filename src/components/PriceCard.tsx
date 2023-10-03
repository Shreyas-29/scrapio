import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";

interface PriceCardProps {
    title: string;
    icon: string;
    value: string;
}

const PriceCard: FC<PriceCardProps> = ({
    title,
    icon,
    value,
}) => {
    return (
        <div className={cn("price-info_card")}>
            <p className="text-base text-black-100">
                {title}
            </p>
            <div className="flex gap-2">
                <Image src={icon} alt="Icon" width={20} height={20} />
                <p className="text-2xl font-bold text-secondary">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default PriceCard;