import { M } from "../constants/fonts";

export const sparkPath = (data, w, h) => {
    if (data.length < 2)
        return "";
    const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1;
    return data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = (h - 4) - ((v - mn) / rng) * (h - 8) + 4;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
};
