export const fmtCr = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr`
    : n >= 100000 ? `₹${(n / 100000).toFixed(0)}L`
        : `₹${(n / 1000).toFixed(0)}K`;
