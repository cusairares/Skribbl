import React, { useState, useRef ,useEffect, useContext} from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { SignalRContext } from "../../context/SignalR/SignalRContext";
import { SessionContext } from '../../context/Session/SessionContext';
function Canvas() {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false); 

  const {connection} = useContext(SignalRContext)
  const {roomId} = useContext(SessionContext)
  const lastSentTime = useRef(0);

  const handleMouseDown = (e) => {
      isDrawing.current = true;
      const point = e.target.getStage().getPointerPosition();
      
      setLines(prev => [...prev, { 
          points: [point.x, point.y], 
          stroke: '#df4b26', 
          strokeWidth: 5 
      }]);

      if (!connection) return;
      connection.invoke("SendCanvasUpdate", {
          RoomId: roomId,
          X: point.x,
          Y: point.y,
          IsNewStroke: true,
          Width: 5,
          Color: '#df4b26'
      });
    };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setLines(prevLines => {
      if (prevLines.length === 0) return prevLines;
      
      const newLines = [...prevLines];
      const lastIndex = newLines.length - 1;
      const lastLine = { ...newLines[lastIndex] };
      
      lastLine.points = [...(lastLine.points || []), point.x, point.y];
      newLines[lastIndex] = lastLine;

      return newLines;
    });

    const now = Date.now();
    if (connection && now - lastSentTime.current > 33) {
        lastSentTime.current = now;
        connection.invoke("SendCanvasUpdate", {
            RoomId: roomId,
            X: point.x,
            Y: point.y,
            IsNewStroke: false,
            Width: 5,
            Color: '#df4b26'
        }).catch(err => console.error("SignalR Draw Error: ", err));
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

useEffect(() => {
    if (!connection) return;

    connection.on("CanvasUpdated", (update) => {
      if (update.IsNewStroke) {
        setLines(prev => [...prev, {
            points: [update.X, update.Y],
            stroke: update.Color ?? '#000000',
            strokeWidth: update.Width ?? 5
        }]);
      } 
      else {
        setLines(prev => {
          if (prev.length === 0) {
            return [{
              points: [update.X, update.Y],
              stroke: update.Color ?? '#000000',
              strokeWidth: update.Width ?? 5
            }];
          }
          const newLines = [...prev];
          const lastLine = { ...newLines[newLines.length - 1] };
          lastLine.points = [...(lastLine.points ?? []), update.X, update.Y];
          newLines[newLines.length - 1] = lastLine;
          return newLines;
        });
      }
    });

    return () => connection.off("CanvasUpdated");
}, [connection]);
  
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
}

export {Canvas}