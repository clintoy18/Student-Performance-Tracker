import React from "react";
import type { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  icon: LucideIcon;
  percentage?: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ title, icon: Icon, percentage, description }) => {
  return (
    <div className="border rounded-md p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      {percentage && <p className="text-lg font-semibold">{percentage}</p>}
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export default Card;
