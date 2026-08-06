import { create } from "zustand";

export const avalabileOptions = {
    colorIndex: {cols: 10, rows: 3, total: 28},
    eyesIndex: {cols: 10, rows: 6, total: 57},
    mouthIndex: {cols: 10, rows: 6, total: 51},
}

export const getAvatarStyle = (options, optionName) => {
    if (!options) return {};
    const index = options[optionName] ?? 0;
    const {cols}  = avalabileOptions[optionName];

    const col = index % cols;
    const row = Math.floor(index / cols);

    const xPercent = cols > 1 ? (col / (cols - 1)) * 100 : 0;
    const yPercent = cols > 1 ? (row / (cols - 1)) * 100 : 0;

    return {
        backgroundPosition: `${xPercent}% ${yPercent}%`,
        backgroundSize: `1000% 1000%`, 
        imageRendering: 'pixelated',
        backgroundRepeat: 'no-repeat'
    };
}

export const useAvatarOptions = create((set) => ({
    avatarOptions: {colorIndex:0, eyesIndex:0, mouthIndex:0},

    updateAvatarOptions: (optionName, direction) => {
        let config = avalabileOptions[optionName];
        set((state) => {
            let newIndex = direction == "right" ? state.avatarOptions[optionName] + 1 : state.avatarOptions[optionName] - 1;
            if(newIndex >= config.total) newIndex = 0;
            if(newIndex < 0) newIndex = config.total - 1;

            return { avatarOptions: { ...state.avatarOptions, [optionName]: newIndex } };
        });
    }
}));