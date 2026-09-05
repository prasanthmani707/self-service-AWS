import type { ButtonHTMLAttributes } from "react";
export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={`rounded bg-[#0d766f] px-4 py-2 text-sm font-semibold text-white ${props.className ?? ""}`} />; }
