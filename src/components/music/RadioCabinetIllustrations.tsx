import React from 'react';

interface RadioCabinetIllustrationProps {
  eraId: string;
  isPlaying?: boolean;
  frequencyKhz?: number;
  stationName?: string;
  vuLevel?: number; // 0 to 1
  isTubeWarm?: boolean;
  accentColor?: string;
  className?: string;
}

export const RadioCabinetIllustration: React.FC<RadioCabinetIllustrationProps> = ({
  eraId,
  isPlaying = false,
  frequencyKhz = 860,
  stationName = 'Rádio Nacional (PRE-8)',
  vuLevel = 0.5,
  isTubeWarm = true,
  className = '',
}) => {
  // 1. ERA 1930-1940: RÁDIO CAPELINHA / ART DÉCO VALVULADO
  if (eraId === 'catedral_1930_1940') {
    return (
      <div className={`relative w-full aspect-[4/3] max-h-[340px] bg-gradient-to-b from-[#3a1d0c] via-[#241106] to-[#120702] rounded-t-[100px] rounded-b-2xl border-4 border-[#8c532b] p-4 shadow-2xl shadow-black flex flex-col items-center justify-between select-none overflow-hidden ${className}`}>
        {/* Frisos de Madeira Entalhada Superior (Estilo Catedral) */}
        <div className="absolute top-2 w-32 h-6 border-b-2 border-[#a66a38]/60 flex justify-center gap-1.5 pt-1">
          <div className="w-1.5 h-3 bg-[#a66a38] rounded-t-sm" />
          <div className="w-1.5 h-4 bg-[#a66a38] rounded-t-sm" />
          <div className="w-1.5 h-5 bg-[#d49157] rounded-t-sm" />
          <div className="w-1.5 h-4 bg-[#a66a38] rounded-t-sm" />
          <div className="w-1.5 h-3 bg-[#a66a38] rounded-t-sm" />
        </div>

        {/* Grade de Tecido do Alto-Falante */}
        <div className="w-full flex-1 mt-6 bg-[#1a0e06] rounded-t-[70px] rounded-b-lg border-2 border-[#5c3116] relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner">
          {/* Trama Acústica Texturizada */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#d49157_1px,transparent_1px)] [background-size:6px_6px]" />
          
          {/* "Olho Mágico" Valvulado 6E5 (Verde Fosforescente Central) */}
          <div className="relative z-10 flex flex-col items-center mb-2">
            <div className={`w-10 h-10 rounded-full border-2 border-amber-900 bg-slate-950 flex items-center justify-center shadow-lg transition-all duration-500 ${
              isTubeWarm && isPlaying ? 'shadow-emerald-500/50' : 'shadow-black'
            }`}>
              {/* Leque Fosforescente */}
              <div
                className={`w-8 h-8 rounded-full transition-all duration-300 ${
                  isTubeWarm && isPlaying
                    ? 'bg-[radial-gradient(circle_at_center,#4ade80_0%,#15803d_60%,#052e16_100%)] shadow-[0_0_12px_#22c55e]'
                    : 'bg-emerald-950/40 opacity-40'
                }`}
                style={{
                  clipPath: isPlaying
                    ? `polygon(50% 50%, 0 0, 100% 0, 100% ${Math.min(100, Math.max(10, (1 - vuLevel) * 100))}%, 50% 50%)`
                    : 'polygon(50% 50%, 20% 0, 80% 0, 50% 50%)',
                }}
              />
            </div>
            <span className="text-[8px] font-mono font-bold text-amber-500/80 tracking-widest mt-0.5">
              VALV. 6E5
            </span>
          </div>

          {/* Brasão Dourado de Fábrica */}
          <div className="relative z-10 px-3 py-0.5 rounded bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 text-[9px] font-serif font-black tracking-widest shadow-md">
            NACIONAL • PRE-8
          </div>
        </div>

        {/* Dial de Frequência em Meia-Lua (Art Déco Amarelo/Âmbar) */}
        <div className="w-full mt-3 bg-gradient-to-b from-[#2a1708] to-[#140b04] border-2 border-[#8c532b] rounded-xl p-2.5 flex flex-col gap-1.5 shadow-md relative">
          <div className="flex justify-between items-center text-[10px] font-mono text-amber-400/90 font-bold px-1">
            <span>550 kHz</span>
            <span className="text-yellow-300 font-black tracking-wider text-xs">{frequencyKhz} kHz • AM</span>
            <span>1600 kHz</span>
          </div>

          {/* Régua de Escala com Agulha Iluminada */}
          <div className="relative h-6 bg-[#0d0703] rounded-lg border border-amber-900/60 overflow-hidden flex items-center px-2">
            {/* Graduações */}
            <div className="w-full flex justify-between text-[8px] font-mono text-amber-600/70">
              <span>55</span>
              <span>70</span>
              <span>86</span>
              <span>100</span>
              <span>120</span>
              <span>140</span>
              <span>160</span>
            </div>

            {/* Agulha Vermelha de Sintonia */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] transition-all duration-300"
              style={{
                left: `${Math.min(94, Math.max(6, ((frequencyKhz - 550) / (1600 - 550)) * 100))}%`,
              }}
            />
          </div>

          {/* Emissora Sintonizada */}
          <div className="text-center text-[10px] font-serif font-semibold text-amber-200 truncate">
            {stationName}
          </div>
        </div>

        {/* Botões Giratórios (Knobs) Inferiores de Baquelite */}
        <div className="w-full flex justify-around items-center mt-2.5 pt-1 border-t border-amber-950">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4a260f] to-[#1a0c05] border border-amber-600 shadow-md flex items-center justify-center">
              <div className="w-1 h-3 bg-amber-400 rounded-full" />
            </div>
            <span className="text-[8px] font-mono text-amber-500 mt-0.5">VOLUME</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4a260f] to-[#1a0c05] border border-amber-600 shadow-md flex items-center justify-center">
              <div className="w-1 h-3 bg-amber-400 rounded-full" />
            </div>
            <span className="text-[8px] font-mono text-amber-500 mt-0.5">SINTONIA</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. ERA 1920: RÁDIO GALENA & CRISTAL DE ROCHA
  if (eraId === 'galena_1920') {
    return (
      <div className={`relative w-full aspect-[4/3] max-h-[340px] bg-gradient-to-b from-[#2e1c10] via-[#1c1109] to-[#0d0703] rounded-2xl border-4 border-[#734320] p-4 shadow-2xl shadow-black flex flex-col justify-between select-none overflow-hidden ${className}`}>
        {/* Placa de Cobre Superior Roquette-Pinto */}
        <div className="flex justify-between items-center border-b border-amber-800/60 pb-2">
          <span className="text-[9px] font-mono text-amber-400 font-bold">RECEPTOR GALENA 1922</span>
          <span className="text-[8px] font-mono text-yellow-600">CENTENÁRIO INDEPENDÊNCIA</span>
        </div>

        {/* Bobina de Cobre Enrolada & Bigode de Gato (Detector de Cristal) */}
        <div className="flex-1 my-3 bg-[#120a05] rounded-xl border border-amber-900/80 p-3 flex items-center justify-around relative">
          {/* Bobina Solenoide com Fios de Cobre Brilhantes */}
          <div className="w-24 h-24 rounded-lg bg-[#0a0502] border border-amber-800/80 flex flex-col justify-around p-1.5 relative overflow-hidden shadow-inner">
            <div className="text-[7px] font-mono text-amber-500/80 text-center">BOBINA DE SINTONIA</div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-1 bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 rounded-full" />
            ))}
            {/* Cursor Deslizante da Bobina */}
            <div
              className="absolute top-4 bottom-4 w-1.5 bg-yellow-300 rounded shadow-[0_0_6px_#fde047] transition-all"
              style={{
                left: `${Math.min(85, Math.max(15, ((frequencyKhz - 550) / 1050) * 100))}%`,
              }}
            />
          </div>

          {/* Detector Bigode de Gato (Cristal Galena Sulfeto de Chumbo) */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-stone-900 border-2 border-yellow-700/80 flex items-center justify-center relative shadow-lg">
              {/* Cristal Mineral */}
              <div className={`w-8 h-8 rounded-sm bg-gradient-to-br from-slate-400 to-stone-700 border border-slate-300 shadow-sm ${
                isPlaying ? 'animate-pulse' : ''
              }`} />
              {/* Agulha Bigode de Gato */}
              <div className="absolute w-6 h-0.5 bg-amber-400 rotate-45 top-5 left-5 shadow-[0_0_4px_#fbbf24]" />
            </div>
            <span className="text-[8px] font-mono text-yellow-500 mt-1 font-bold">CRISTAL DE GALENA</span>
          </div>
        </div>

        {/* Fones de Ouvido Arcaicos & Frequência */}
        <div className="bg-[#190e06] p-2 rounded-xl border border-amber-900 flex justify-between items-center text-[10px] font-mono text-amber-300">
          <div>SINTONIA: <span className="text-yellow-400 font-bold">{frequencyKhz} kHz</span></div>
          <div className="text-[8px] text-amber-500/80">SEM BATERIA (0W)</div>
        </div>
      </div>
    );
  }

  // 3. ERA 1950-1960: RÁDIO BAQUELITE & SPIDÔMETRO "BOSSA NOVA"
  if (eraId === 'modernista_1950_1960') {
    return (
      <div className={`relative w-full aspect-[4/3] max-h-[340px] bg-gradient-to-b from-[#38281a] via-[#1f160e] to-[#0c0805] rounded-3xl border-4 border-[#9c6a3b] p-4 shadow-2xl shadow-black flex flex-col justify-between select-none overflow-hidden ${className}`}>
        {/* Painel Frontal Marfim Estilo Automotivo dos Anos 50 */}
        <div className="flex justify-between items-center border-b-2 border-amber-600/40 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            <span className="text-[10px] font-serif font-black text-amber-200 tracking-wider">BOSSA NOVA • BRASÍLIA</span>
          </div>
          <span className="text-[9px] font-mono text-amber-400/80 font-bold">ERA JK 1956</span>
        </div>

        {/* Dial Horizontal Estilo Velocímetro de Automóvel */}
        <div className="my-3 bg-[#140c06] rounded-2xl border-2 border-[#b88049] p-3 shadow-inner relative flex flex-col justify-between flex-1">
          <div className="flex justify-between text-[9px] font-mono text-amber-300/80 font-bold border-b border-amber-900/60 pb-1">
            <span>ONDAS MÉDIAS (AM)</span>
            <span className="text-yellow-300 font-black">{frequencyKhz} kHz</span>
            <span>ONDAS TROPICAIS (OT)</span>
          </div>

          {/* Agulha Dourada e Escala Luminescente */}
          <div className="relative h-12 bg-gradient-to-r from-amber-950/80 via-yellow-950/60 to-amber-950/80 rounded-xl border border-amber-800/80 flex items-center px-3 overflow-hidden">
            <div className="w-full flex justify-between text-[10px] font-mono font-bold text-amber-400/70">
              <span>54</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
              <span>120</span>
              <span>140</span>
              <span>160</span>
            </div>

            {/* Agulha Spidômetro Iluminada */}
            <div
              className="absolute top-1 bottom-1 w-1 bg-yellow-400 shadow-[0_0_10px_#fde047] transition-all duration-300 rounded-full"
              style={{
                left: `${Math.min(93, Math.max(7, ((frequencyKhz - 550) / 1050) * 100))}%`,
              }}
            />
          </div>

          <div className="text-center text-[10px] font-serif text-amber-100 font-bold truncate">
            {stationName}
          </div>
        </div>

        {/* Botões Baquelite Cromados Estilo Vintage 50s */}
        <div className="flex justify-around items-center pt-1 border-t border-amber-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border-2 border-yellow-200 shadow-md flex items-center justify-center font-serif text-[9px] font-black text-slate-900">
              VOL
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-700 border-2 border-yellow-200 shadow-md flex items-center justify-center font-serif text-[9px] font-black text-slate-900">
              TUN
            </div>
          </div>
          <span className="text-[9px] font-mono text-amber-400 font-semibold">CIRCUITO SUPER-HETERÓDINO</span>
        </div>
      </div>
    );
  }

  // 4. ERA 1970-1980: BOOMBOX ESTÉREO & TAPE DECK DOS FESTIVAIS
  if (eraId === 'boombox_1970_1980') {
    return (
      <div className={`relative w-full aspect-[4/3] max-h-[340px] bg-gradient-to-b from-[#1e2530] via-[#121720] to-[#080b10] rounded-2xl border-4 border-slate-500 p-4 shadow-2xl shadow-black flex flex-col justify-between select-none overflow-hidden ${className}`}>
        {/* Alça Metálica e Antenas Telescópicas */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400">STEREO CASSETTE RECORDER</span>
          <span className="text-[9px] font-mono text-slate-400">AM / FM ESTÉREO</span>
        </div>

        {/* Alto-Falantes Duplos & Cassete Central com VU Meter */}
        <div className="flex items-center justify-between gap-2 my-2 flex-1">
          {/* Caixa Esquerda */}
          <div className="w-16 h-24 rounded-full bg-slate-950 border-2 border-slate-600 flex items-center justify-center p-1 relative shadow-inner">
            <div className={`w-12 h-12 rounded-full border border-cyan-500/50 bg-slate-900 flex items-center justify-center ${
              isPlaying ? 'scale-105 transition-transform duration-100' : ''
            }`}>
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </div>
          </div>

          {/* Fita Cassete Girando no Centro & VU Meter */}
          <div className="flex-1 h-24 bg-slate-950 rounded-xl border border-slate-700 p-2 flex flex-col justify-between">
            {/* VU Meter com Agulhas Analógicas Iluminadas */}
            <div className="flex justify-around items-center bg-slate-900 p-1 rounded border border-slate-800">
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-mono text-slate-400">L - VU</span>
                <div className="w-12 h-3 bg-slate-950 rounded relative overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-100"
                    style={{ width: `${isPlaying ? Math.min(100, vuLevel * 120) : 10}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] font-mono text-slate-400">R - VU</span>
                <div className="w-12 h-3 bg-slate-950 rounded relative overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-rose-500 transition-all duration-100"
                    style={{ width: `${isPlaying ? Math.min(100, vuLevel * 110) : 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Fita Cassete K7 com Rolos Giratórios */}
            <div className="flex justify-around items-center bg-stone-900/90 p-1 rounded-md border border-stone-700">
              <div className={`w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
              <span className="text-[8px] font-mono text-cyan-300 font-bold">K7 • FESTIVAIS</span>
              <div className={`w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }}>
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Caixa Direita */}
          <div className="w-16 h-24 rounded-full bg-slate-950 border-2 border-slate-600 flex items-center justify-center p-1 relative shadow-inner">
            <div className={`w-12 h-12 rounded-full border border-cyan-500/50 bg-slate-900 flex items-center justify-center ${
              isPlaying ? 'scale-105 transition-transform duration-100' : ''
            }`}>
              <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </div>
          </div>
        </div>

        {/* Frequência FM/AM */}
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 flex justify-between items-center text-[10px] font-mono text-cyan-300">
          <div>FREQ: <span className="text-white font-bold">{frequencyKhz} kHz</span></div>
          <div className="text-emerald-400 font-bold">LOUDNESS ON</div>
        </div>
      </div>
    );
  }

  // 5. ERA 1990-2000: MINI SYSTEM DIGITAL PLL & HI-FI
  return (
    <div className={`relative w-full aspect-[4/3] max-h-[340px] bg-gradient-to-b from-[#0e1e24] via-[#071115] to-[#020507] rounded-2xl border-4 border-emerald-500/80 p-4 shadow-2xl shadow-black flex flex-col justify-between select-none overflow-hidden ${className}`}>
      {/* Display VFD Fluorescente Azul-Esmeralda */}
      <div className="flex justify-between items-center border-b border-emerald-900/80 pb-1.5">
        <span className="text-[10px] font-mono font-bold text-emerald-400">DIGITAL PLL SYNTHESIZED TUNER</span>
        <span className="text-[9px] font-mono text-emerald-300">3-CD CHANGER / MP3</span>
      </div>

      {/* Painel Display Digital com Analisador de Espectro Gráfico */}
      <div className="my-2 bg-[#02090b] rounded-xl border-2 border-emerald-600 p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex flex-col justify-between flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-black text-emerald-300 tracking-wider">CH 01 • MEMORY</span>
          <span className="text-sm font-mono font-black text-emerald-400 animate-pulse">{frequencyKhz} kHz AM</span>
        </div>

        {/* Analisador de Espectro Gráfico Digital (Equalizador 7 Bandas) */}
        <div className="flex justify-between items-end h-10 px-2 my-1 bg-slate-950 rounded border border-emerald-950">
          {[60, 150, 400, 1000, 2500, 6000, 15000].map((hz, i) => (
            <div key={hz} className="flex flex-col items-center gap-0.5">
              <div
                className="w-4 bg-emerald-400 rounded-t-sm shadow-[0_0_6px_#34d399] transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.min(32, Math.max(4, Math.random() * 28 + (vuLevel * 10)))}px` : '4px',
                }}
              />
              <span className="text-[6px] font-mono text-emerald-600">{hz >= 1000 ? `${hz / 1000}k` : hz}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] font-mono text-emerald-200 truncate">
          {stationName}
        </div>
      </div>

      {/* Botões Digitais e Bass Boost */}
      <div className="bg-[#041217] p-2 rounded-xl border border-emerald-900 flex justify-between items-center text-[10px] font-mono">
        <span className="text-emerald-400 font-bold">BASS BOOST: +6dB</span>
        <span className="text-emerald-300 font-bold">PRESET AUTO-SCAN</span>
      </div>
    </div>
  );
};
