"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  PenTool,
  Eraser,
  RotateCcw,
  Trash2,
  Maximize2,
  Minimize2,
  X,
  Palette,
  Eye,
  EyeOff,
} from "lucide-react";

interface ScratchpadCanvasProps {
  questionId: string;
  isOpen: boolean;
  onToggle: () => void;
}

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Yellow", value: "#facc15" },
  { name: "Cyan", value: "#38bdf8" },
  { name: "Rose", value: "#fb7185" },
];

const STROKE_SIZES = [
  { label: "Tipis", size: 2 },
  { label: "Sedang", size: 4 },
  { label: "Tebal", size: 8 },
];

// In-memory persistent cache across questions during practice session
const scratchpadStorage = new Map<string, string>();

export function ScratchpadCanvas({
  questionId,
  isOpen,
  onToggle,
}: ScratchpadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<"pen" | "eraser">("pen");
  const [currentColor, setCurrentColor] = useState("#facc15"); // yellow default
  const [strokeSize, setStrokeSize] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);

  // Save current canvas to cache
  const saveToStorage = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && questionId) {
      const dataUrl = canvas.toDataURL("image/png");
      scratchpadStorage.set(questionId, dataUrl);
    }
  }, [questionId]);

  // Restore canvas from cache
  const restoreFromStorage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset canvas background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const savedData = scratchpadStorage.get(questionId);
    if (savedData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedData;
    }
  }, [questionId]);

  // Adjust canvas resolution to parent width/height without scaling distortion
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Save existing drawing before resize
    const dataUrl = canvas.toDataURL("image/png");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight || (isExpanded ? 600 : 320);

    const ctx = canvas.getContext("2d");
    if (ctx && dataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataUrl;
    }
  }, [isExpanded]);

  // Handle questionId changes
  useEffect(() => {
    if (isOpen) {
      restoreFromStorage();
    }
  }, [questionId, isOpen, restoreFromStorage]);

  // Handle resize and mount
  useEffect(() => {
    if (isOpen) {
      resizeCanvas();
      restoreFromStorage();
    }
  }, [isOpen, isExpanded, resizeCanvas, restoreFromStorage]);

  // Coordinate helper for mouse & touch
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save undo state
    const currentSnapshot = canvas.toDataURL();
    setUndoStack((prev) => [...prev.slice(-10), currentSnapshot]);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.strokeStyle = activeTool === "eraser" ? "#0f172a" : currentColor;
    ctx.lineWidth = activeTool === "eraser" ? strokeSize * 4 : strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setIsDrawing(true);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToStorage();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Save state for undo
    setUndoStack((prev) => [...prev.slice(-10), canvas.toDataURL()]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToStorage();
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      saveToStorage();
    };
    img.src = lastState;
  };

  if (!isOpen) return null;

  return (
    <div
      className={`transition-all duration-200 ${
        isExpanded
          ? "fixed inset-2 sm:inset-4 z-50 bg-slate-950/98 border border-slate-700 rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col backdrop-blur-md"
          : "w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-2.5 sm:p-3 shadow-inner my-4"
      }`}
    >
      {/* Scratchpad Header & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-semibold text-xs">
            <PenTool className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">Scratchpad</span>
            <span className="xs:hidden">Coretan</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden md:inline">
            Coretan tersimpan otomatis per soal
          </span>
        </div>

        {/* Tools Cluster */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
          {/* Pen / Eraser Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTool("pen")}
              className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded transition ${
                activeTool === "pen"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Kuas coretan kalkulasi"
            >
              <PenTool className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTool("eraser")}
              className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded transition ${
                activeTool === "eraser"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Penghapus coretan"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Picker Swatches */}
          {activeTool === "pen" && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCurrentColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-4 h-4 rounded-full transition ${
                    currentColor === c.value
                      ? "ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          )}

          {/* Brush Sizes */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px]">
            {STROKE_SIZES.map((s) => (
              <button
                key={s.size}
                onClick={() => setStrokeSize(s.size)}
                className={`px-1.5 py-0.5 min-h-[26px] rounded transition flex items-center gap-1 ${
                  strokeSize === s.size
                    ? "bg-slate-800 text-indigo-300 font-bold border border-indigo-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
                title={`Ukuran garis: ${s.label}`}
              >
                <span
                  className="rounded-full bg-current block shrink-0"
                  style={{ width: s.size + 1, height: s.size + 1 }}
                />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Undo & Clear */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition"
              title="Undo coretan terakhir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClear}
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/40 hover:border-rose-800 transition"
              title="Hapus seluruh kanvas"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expand / Minimize & Close */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title={isExpanded ? "Kecilkan" : "Perbesar Penuh (Layar Penuh)"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Tutup Scratchpad"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-xl overflow-hidden bg-slate-900/90 border border-slate-800/80 cursor-crosshair ${
          isExpanded ? "flex-1 min-h-[360px] sm:min-h-[450px]" : "h-64 sm:h-80"
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block touch-none"
        />
        <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-slate-600 font-mono">
          Canvas Coretdraft • {questionId}
        </div>
      </div>
    </div>
  );
}
