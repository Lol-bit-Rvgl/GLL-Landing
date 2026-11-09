import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

type ClassValue = string | number | boolean | null | undefined | ClassArray | Svgr;
type ClassArray = ClassValue[];
type Svgr = { [key: string]: any };