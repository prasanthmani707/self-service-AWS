import type { HTMLAttributes } from "react";
export function Card(props: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={`rounded-lg border border-[#d8e5df] bg-white p-5 ${props.className ?? ""}`} />; }
