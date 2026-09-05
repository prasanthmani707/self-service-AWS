export function redact(value: string | undefined) { return value ? `${value.slice(0, 4)}••••${value.slice(-4)}` : undefined; }
