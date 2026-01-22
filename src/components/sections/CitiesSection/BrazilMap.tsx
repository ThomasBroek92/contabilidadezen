import { useState } from "react";
import { motion } from "framer-motion";

interface StateInfo {
  name: string;
  cities: number;
  region: 'sudeste' | 'sul' | 'outras';
}

const statesInfo: Record<string, StateInfo> = {
  SP: { name: "São Paulo", cities: 48, region: "sudeste" },
  RJ: { name: "Rio de Janeiro", cities: 4, region: "sudeste" },
  MG: { name: "Minas Gerais", cities: 3, region: "sudeste" },
  ES: { name: "Espírito Santo", cities: 1, region: "sudeste" },
  PR: { name: "Paraná", cities: 4, region: "sul" },
  SC: { name: "Santa Catarina", cities: 2, region: "sul" },
  RS: { name: "Rio Grande do Sul", cities: 1, region: "sul" },
  BA: { name: "Bahia", cities: 1, region: "outras" },
  CE: { name: "Ceará", cities: 1, region: "outras" },
  PE: { name: "Pernambuco", cities: 1, region: "outras" },
  RN: { name: "Rio Grande do Norte", cities: 1, region: "outras" },
  PB: { name: "Paraíba", cities: 1, region: "outras" },
  AL: { name: "Alagoas", cities: 1, region: "outras" },
  SE: { name: "Sergipe", cities: 1, region: "outras" },
  MA: { name: "Maranhão", cities: 1, region: "outras" },
  PI: { name: "Piauí", cities: 1, region: "outras" },
  DF: { name: "Distrito Federal", cities: 1, region: "outras" },
  GO: { name: "Goiás", cities: 1, region: "outras" },
  MS: { name: "Mato Grosso do Sul", cities: 1, region: "outras" },
  MT: { name: "Mato Grosso", cities: 1, region: "outras" },
  AM: { name: "Amazonas", cities: 1, region: "outras" },
  PA: { name: "Pará", cities: 1, region: "outras" },
};

export function BrazilMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getStateClass = (stateCode: string) => {
    const state = statesInfo[stateCode];
    if (!state) return "fill-muted stroke-border";
    
    switch (state.region) {
      case 'sudeste':
        return stateCode === 'SP' 
          ? "fill-primary stroke-primary/80" 
          : "fill-primary/70 stroke-primary/60";
      case 'sul':
        return "fill-accent stroke-accent/80";
      default:
        return "fill-muted stroke-border";
    }
  };

  const handleMouseMove = (e: React.MouseEvent, stateCode: string) => {
    if (statesInfo[stateCode]) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
      setHoveredState(stateCode);
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Tooltip */}
      {hoveredState && statesInfo[hoveredState] && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-50 px-3 py-2 rounded-lg bg-card border border-border shadow-lg pointer-events-none"
          style={{ 
            left: tooltipPos.x + 10, 
            top: tooltipPos.y - 40,
          }}
        >
          <p className="font-semibold text-foreground text-sm">
            {statesInfo[hoveredState].name}
          </p>
          <p className="text-xs text-muted-foreground">
            {statesInfo[hoveredState].cities} cidades atendidas
          </p>
        </motion.div>
      )}

      {/* Simplified Brazil Map SVG */}
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full"
        onMouseLeave={() => setHoveredState(null)}
      >
        {/* Background */}
        <rect width="500" height="500" fill="transparent" />
        
        {/* Simplified state shapes - positioned roughly */}
        {/* Norte */}
        <motion.path
          d="M80 80 L180 60 L220 100 L200 160 L140 180 L60 140 Z"
          className={`${getStateClass('AM')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'AM')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.path
          d="M220 80 L320 70 L340 120 L280 160 L220 140 Z"
          className={`${getStateClass('PA')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'PA')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        />
        
        {/* Nordeste */}
        <motion.path
          d="M340 90 L400 100 L420 140 L380 160 L340 140 Z"
          className={`${getStateClass('CE')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'CE')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.path
          d="M420 140 L460 150 L450 190 L410 180 Z"
          className={`${getStateClass('RN')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'RN')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
        />
        <motion.path
          d="M450 190 L470 200 L460 240 L430 230 Z"
          className={`${getStateClass('PB')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'PB')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.44 }}
        />
        <motion.path
          d="M460 240 L480 260 L460 300 L430 280 Z"
          className={`${getStateClass('PE')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'PE')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.46 }}
        />
        <motion.path
          d="M460 300 L470 330 L450 350 L430 330 Z"
          className={`${getStateClass('AL')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'AL')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
        />
        <motion.path
          d="M450 350 L460 380 L440 390 L420 370 Z"
          className={`${getStateClass('SE')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'SE')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <motion.path
          d="M300 140 L340 150 L360 200 L400 250 L380 320 L320 280 L280 200 Z"
          className={`${getStateClass('BA')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'BA')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        />
        <motion.path
          d="M280 100 L320 90 L340 130 L300 150 Z"
          className={`${getStateClass('MA')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'MA')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
        />
        <motion.path
          d="M300 150 L340 140 L360 180 L320 200 Z"
          className={`${getStateClass('PI')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'PI')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />
        
        {/* Centro-Oeste */}
        <motion.path
          d="M140 180 L200 170 L260 200 L240 280 L180 300 L120 260 Z"
          className={`${getStateClass('MT')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'MT')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.path
          d="M260 200 L300 220 L320 290 L280 320 L240 280 Z"
          className={`${getStateClass('GO')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'GO')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        />
        <motion.path
          d="M290 280 L310 290 L300 310 L280 300 Z"
          className={`${getStateClass('DF')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'DF')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.path
          d="M180 300 L240 290 L260 360 L200 400 L160 360 Z"
          className={`${getStateClass('MS')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'MS')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
        />
        
        {/* Sudeste - Destaque */}
        <motion.path
          d="M320 290 L380 310 L400 350 L380 380 L340 370 L300 340 Z"
          className={`${getStateClass('MG')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'MG')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        />
        <motion.path
          d="M400 360 L430 370 L420 400 L390 390 Z"
          className={`${getStateClass('ES')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'ES')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
        />
        <motion.path
          d="M340 380 L400 390 L420 420 L380 440 L340 420 Z"
          className={`${getStateClass('RJ')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'RJ')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
        />
        {/* São Paulo - Maior destaque */}
        <motion.path
          d="M260 360 L340 370 L360 420 L320 450 L260 430 L240 390 Z"
          className={`${getStateClass('SP')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'SP')}
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, type: "spring" }}
        />
        
        {/* Sul */}
        <motion.path
          d="M240 430 L320 450 L300 490 L260 500 L220 470 Z"
          className={`${getStateClass('PR')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'PR')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        />
        <motion.path
          d="M220 470 L260 500 L240 530 L200 520 L190 490 Z"
          className={`${getStateClass('SC')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'SC')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        />
        <motion.path
          d="M190 490 L200 530 L180 570 L140 560 L130 520 L160 490 Z"
          className={`${getStateClass('RS')} cursor-pointer transition-all duration-200`}
          onMouseMove={(e) => handleMouseMove(e, 'RS')}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Campinas pin */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          <circle cx="295" cy="400" r="8" className="fill-secondary animate-pulse" />
          <circle cx="295" cy="400" r="4" className="fill-secondary-foreground" />
        </motion.g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-muted-foreground">Sudeste</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent" />
          <span className="text-muted-foreground">Sul</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <span className="text-muted-foreground">Outras</span>
        </div>
      </div>
    </div>
  );
}
