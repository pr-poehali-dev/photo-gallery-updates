
import React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: number;
  fallback?: keyof typeof LucideIcons;
}

const Icon = ({ name, size = 24, fallback = "CircleAlert", className, ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] || LucideIcons[fallback];
  
  return <LucideIcon size={size} className={cn("", className)} {...props} />;
};

export default Icon;
