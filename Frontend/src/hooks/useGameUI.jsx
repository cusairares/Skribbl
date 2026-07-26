import { useState } from "react"

export const useGameUI = () =>{
  const [isGameStarted,setIsGameStarted] = useState(false);
  const [isStarting,setIsStarted] = useState(false);
  const [showRoleSplash,setShowRoleSplash] = useState(false);

  return {
    isGameStarted,
    isStarting,
    showRoleSplash,
    setIsGameStarted,
    setIsStarted,
    setShowRoleSplash,
  }
}

