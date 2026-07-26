import { useState } from "react"

export const useAvatarOptions = ()=>{
    const [avatarOptions,setAvatarOptions] = useState({colorIndex:0,eyesIndex:0,mouthIndex:0});

    const avalabileOptions = {
        colorIndex: {cols: 10, rows: 3, total: 28},
        eyesIndex: {cols: 10, rows: 6, total: 57},
        mouthIndex: {cols: 10, rows: 6, total: 51},
    }
    
    const getStyle = (optionName) => {
        if (!avatarOptions) return {};
        const index = avatarOptions[optionName] ?? 0;
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
    const updateAvatarOptions = (optionName,direction) =>{
        let config = avalabileOptions[optionName]
        setAvatarOptions(prev =>{
            let newIndex = direction == "right" ? prev[optionName] + 1 : prev[optionName] - 1;
            if(newIndex >= config.total) newIndex = 0;
            if(newIndex < 0) newIndex = config.total - 1;

            return {...prev,[optionName]:newIndex}
        })
    }
    return{
        avatarOptions,
        updateAvatarOptions,
        getStyle
    }
}