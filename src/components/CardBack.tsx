import { memo } from "react";
import cardBackSvg from "@/assets/card-back.svg";

export const CardBack = memo(() => {
  return (
    <div 
      className="w-full relative flex items-center justify-center opacity-60"
    >
      <div 
        className="relative inline-block"
        style={{ 
          transform: window.innerWidth < 768 ? 'scale(1.6)' : 'scale(1)' 
        }}
      >
        {/* SVG Card Back Image */}
        <img 
          src={cardBackSvg} 
          alt="Card Back"
          className="w-full h-auto object-contain rounded-2xl block"
          draggable={false}
        />
      </div>
    </div>
  );
});
