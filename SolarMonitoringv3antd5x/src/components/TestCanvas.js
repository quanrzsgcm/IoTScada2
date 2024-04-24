import React, { useEffect, useRef } from "react";

const CanvasComponent = () => {
  // Ref to access the canvas element
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Draw on the canvas
    context.fillStyle = "green";
    context.fillRect(10, 10, 100, 100);
  }, []);

  return <canvas ref={canvasRef} width="100%" height="100%" />;
};

export default CanvasComponent;
