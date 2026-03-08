export function formatMoneyFromCents(amountInCents: number | undefined) {
    if (!amountInCents) return "0.00";

    return (amountInCents / 100).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

export function toDollars(amountInCents: number) {
    return amountInCents / 100
}