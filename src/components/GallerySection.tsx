import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Pause,
  Play,
  Upload,
  X,
  ExternalLink,
} from 'lucide-react';
import { GalleryFrame, RESTAURANT_INFO } from '../data/restaurantData';

interface GallerySectionProps {
  frames: GalleryFrame[];
  isAdmin: boolean;
  onReplaceFrameImage: (frameId: string, dataUrl: string) => void;
}

export default function GallerySection({
  frames,
  isAdmin,
  onReplaceFrameImage,
}: GallerySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<GalleryFrame | null>(
    null
  );

  // Automatic carousel progression (every 4s), paused on hover/lightbox/manual toggle
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion || isPaused || isHovered || activeLightbox) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frames.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [frames.length, isPaused, isHovered, activeLightbox]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + frames.length) % frames.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % frames.length);
  };

  const handleFileUpload = (
    frameId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onReplaceFrameImage(frameId, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const activeFrame = frames[activeIndex] || frames[0];

  return (
    <section
      id="galeria"
      className="relative z-20 bg-[#FCEEF1] py-20 text-[#162A3A] sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#D1495B] uppercase">
              02 · Recorrido Visual
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#162A3A] sm:text-4xl">
              Galería del Restaurante
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4A6070] sm:text-base">
              Cinco postales de nuestra fachada, salón y platos insignia en Ushuaia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={
                isPaused ? 'Reanudar carrusel automático' : 'Pausar carrusel automático'
              }
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E2CCD2] bg-white px-3.5 py-2 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 text-[#D1495B]" />
                  <span>Reanudar</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5 text-[#D1495B]" />
                  <span>Pausar</span>
                </>
              )}
            </button>

            <a
              href={RESTAURANT_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#E2CCD2] bg-white px-4 py-2 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] hover:text-[#D1495B] whitespace-nowrap"
            >
              Ver en Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Automatic Carousel Container — Zero Text Overlapping Photos */}
        <div
          className="mt-10 overflow-hidden rounded-2xl border border-[#EADADF] bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Slide Viewport */}
          <div className="relative aspect-[16/9] max-h-[540px] w-full overflow-hidden bg-[#F4E6EA]">
            <div
              className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {frames.map((frame) => (
                <div
                  key={frame.id}
                  className="h-full w-full shrink-0 overflow-hidden"
                >
                  <img
                    src={frame.src}
                    alt={frame.title}
                    referrerPolicy="no-referrer"
                    style={{ objectPosition: frame.objectPosition }}
                    className={`h-full w-full object-cover ${frame.scaleClass}`}
                  />
                </div>
              ))}
            </div>

            {/* Clean Prev / Next & Expand Controls */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute top-1/2 left-3 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#162A3A] shadow-sm transition-colors hover:bg-[#D1495B] hover:text-white sm:left-4 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto siguiente"
              className="absolute top-1/2 right-3 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#162A3A] shadow-sm transition-colors hover:bg-[#D1495B] hover:text-white sm:right-4 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveLightbox(activeFrame)}
              aria-label={`Ampliar ${activeFrame.title}`}
              className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-[#162A3A] shadow-sm transition-colors hover:bg-[#D1495B] hover:text-white sm:right-4 sm:bottom-4"
            >
              <Expand className="h-4 w-4" />
            </button>
          </div>

          {/* Caption Bar Below Image */}
          <div className="flex flex-col gap-4 border-t border-[#F2E6EA] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#D1495B]">
                <span className="font-mono font-semibold tabular-nums">
                  0{activeIndex + 1} / 0{frames.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#4A6070]">
                  {activeFrame.caption}
                </span>
              </div>
              <h3 className="mt-0.5 truncate font-sans text-base font-semibold text-[#162A3A] sm:text-lg">
                {activeFrame.title}
              </h3>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isAdmin && (
                <label
                  title="Cambiar esta fotografía"
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-[#E2CCD2] bg-[#FAF7F6] px-3 py-1.5 text-xs font-semibold text-[#162A3A] hover:border-[#D1495B] hover:text-[#D1495B]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Cambiar foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(activeFrame.id, e)}
                    className="sr-only"
                  />
                </label>
              )}

              {/* Dot Progress Indicators */}
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label="Seleccionar diapositiva"
              >
                {frames.map((frame, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={frame.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ir a ${frame.title}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        isActive
                          ? 'w-7 bg-[#D1495B]'
                          : 'w-2.5 bg-[#E2CCD2] hover:bg-[#D1495B]/50'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Generous Selector Cards — Balanced 6-Column Grid (3 + 2) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {frames.map((frame, idx) => {
            const isActive = idx === activeIndex;
            const colSpanClass =
              idx < 3
                ? 'lg:col-span-2'
                : idx === 3
                ? 'lg:col-span-3'
                : 'sm:col-span-2 lg:col-span-3';

            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Ver ${frame.title}`}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all ${colSpanClass} ${
                  isActive
                    ? 'border-[#D1495B] ring-2 ring-[#D1495B]/25'
                    : 'border-[#EADADF] opacity-90 hover:border-[#D1495B]/60 hover:opacity-100'
                }`}
              >
                <div className="h-48 w-full overflow-hidden bg-[#F4E6EA] sm:h-52 lg:h-56">
                  <img
                    src={frame.src}
                    alt={frame.title}
                    referrerPolicy="no-referrer"
                    style={{ objectPosition: frame.objectPosition }}
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${frame.scaleClass}`}
                  />
                </div>
                <div className="flex w-full items-center justify-between gap-2 px-4 py-3">
                  <span className="truncate font-sans text-xs font-semibold text-[#162A3A] sm:text-sm">
                    {frame.title}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold tabular-nums shrink-0 ${
                      isActive ? 'text-[#D1495B]' : 'text-[#4A6070]'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeLightbox.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#162A3A]/75 p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[#EADADF] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveLightbox(null)}
              aria-label="Cerrar vista ampliada"
              className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-[#162A3A] shadow-sm hover:bg-[#D1495B] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#F4E6EA]">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.title}
                referrerPolicy="no-referrer"
                style={{ objectPosition: activeLightbox.objectPosition }}
                className={`h-full w-full object-cover ${activeLightbox.scaleClass}`}
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold text-[#D1495B]">
                {activeLightbox.caption}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#162A3A]">
                {activeLightbox.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4A6070]">
                {activeLightbox.detail}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
