import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin,
  Bookmark,
  Navigation,
  Smartphone,
  Share2,
  ShoppingBag,
  Instagram,
  Phone,
  Clock,
  Pause,
  Play,
  Compass,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import BeagleThreeCanvas from './components/BeagleThreeCanvas';
import MenuSection from './components/MenuSection';
import GallerySection from './components/GallerySection';
import ReservationSection from './components/ReservationSection';
import CartDrawer, { CartEntry } from './components/CartDrawer';
import {
  GalleryFrame,
  INITIAL_GALLERY_FRAMES,
  INITIAL_MENU_ITEMS,
  MenuItem,
  NEARBY_LANDMARKS,
  RESTAURANT_INFO,
} from './data/restaurantData';

const HERO_SLIDES = [
  {
    kicker: 'Ushuaia · Desde 1994',
    title: 'Centolla Viva & Canal Beagle',
    subtitle: 'Acuario propio y cocina fueguina en Av. San Martín 232.',
  },
  {
    kicker: 'Fin del Mundo · Comida Casera',
    title: 'Sabores del Atlántico Sur',
    subtitle: 'Merluza negra, cazuelas y vinos patagónicos.',
  },
  {
    kicker: 'Av. San Martín 232 · Ushuaia',
    title: 'Tradición en Mariscos',
    subtitle: 'Elegí tu plato de la carta y pedí por WhatsApp.',
  },
];

const STORAGE_KEYS = {
  menu: 'lcdm_menu_items_v4',
  gallery: 'lcdm_gallery_frames_v4',
  saved: 'lcdm_saved_place_v4',
};

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.menu);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial items
    }
    return INITIAL_MENU_ITEMS;
  });

  const [galleryFrames, setGalleryFrames] = useState<GalleryFrame[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.gallery);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === 5) return parsed;
      }
    } catch {
      // Fallback to initial frames
    }
    return INITIAL_GALLERY_FRAMES;
  });

  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.saved) === '1';
    } catch {
      return false;
    }
  });
  const [showNearbyPanel, setShowNearbyPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // 3-second Hero Title Cycle (3s visible -> 3s hidden so background facade stays clear)
  const [slideIndex, setSlideIndex] = useState(0);
  const [isTitleVisible, setIsTitleVisible] = useState(true);
  const [isCyclePaused, setIsCyclePaused] = useState(false);

  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollProgressRef.current = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    if (isCyclePaused) {
      setIsTitleVisible(true);
      return;
    }
    const timer = window.setInterval(() => {
      setIsTitleVisible((prevVisible) => {
        if (prevVisible) return false;
        setSlideIndex((idx) => (idx + 1) % HERO_SLIDES.length);
        return true;
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [isCyclePaused]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(menuItems));
    } catch {
      // Storage quota safeguard
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(galleryFrames));
    } catch {
      // Storage quota safeguard
    }
  }, [galleryFrames]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((entry) => {
      map[entry.item.id] = entry.quantity;
    });
    return map;
  }, [cart]);

  const totalCartItems = useMemo(
    () => cart.reduce((sum, entry) => sum + entry.quantity, 0),
    [cart]
  );

  const syncedCart = useMemo(
    () =>
      cart.map((entry) => {
        const latest = menuItems.find((m) => m.id === entry.item.id);
        return latest ? { ...entry, item: latest } : entry;
      }),
    [cart, menuItems]
  );

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, quantity: e.quantity + 1 } : e
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`Agregado: ${item.name}`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((e) =>
          e.item.id === id ? { ...e, quantity: e.quantity + delta } : e
        )
        .filter((e) => e.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((e) => e.item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleUnlockAdmin = (pin: string) => {
    if (pin === '0608') {
      setIsAdmin(true);
      showToast('Modo Administrador habilitado');
      return true;
    }
    return false;
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const handleAddMenuItem = (newDish: Omit<MenuItem, 'id'>) => {
    const id = `custom-${Date.now()}`;
    setMenuItems((prev) => [{ ...newDish, id }, ...prev]);
    showToast(`Plato agregado: ${newDish.name}`);
  };

  const handleResetPrices = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.menu);
    showToast('Carta y precios restaurados a valores originales');
  };

  const handleReplaceFrameImage = (frameId: string, dataUrl: string) => {
    setGalleryFrames((prev) =>
      prev.map((frame) =>
        frame.id === frameId
          ? {
              ...frame,
              src: dataUrl,
              objectPosition: 'center center',
              scaleClass: 'scale-100',
            }
          : frame
      )
    );
    showToast('Imagen de galería actualizada');
  };

  const handleToggleSave = () => {
    const next = !isSaved;
    setIsSaved(next);
    try {
      localStorage.setItem(STORAGE_KEYS.saved, next ? '1' : '0');
    } catch {
      // Ignore storage error
    }
    showToast(
      next
        ? 'Guardado en tus lugares favoritos'
        : 'Quitado de tus lugares guardados'
    );
  };

  const handleShare = async () => {
    const shareText = `${RESTAURANT_INFO.name} — ${RESTAURANT_INFO.address} (${RESTAURANT_INFO.rating} ★)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: RESTAURANT_INFO.name,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(
        `${shareText} · ${RESTAURANT_INFO.googleMapsUrl}`
      );
      showToast('Enlace e información copiados al portapapeles');
    } catch {
      showToast('Compartí: Av. San Martín 232, Ushuaia');
    }
  };

  const handleSendToPhone = async () => {
    const cardMsg = `${RESTAURANT_INFO.name}\nDirección: ${RESTAURANT_INFO.address}\nTeléfono/WhatsApp: ${RESTAURANT_INFO.phoneDisplay}\nGoogle Maps: ${RESTAURANT_INFO.googleMapsUrl}`;
    try {
      await navigator.clipboard.writeText(cardMsg);
      showToast('Datos del local copiados para enviar a tu teléfono');
    } catch {
      showToast(`WhatsApp del local: ${RESTAURANT_INFO.phoneDisplay}`);
    }
  };

  const currentSlide = HERO_SLIDES[slideIndex];

  return (
    <div className="relative min-h-screen bg-[#FAF7F6] text-[#162A3A]">
      {/* Subtle Three.js WebGL Coastal Atmosphere */}
      <BeagleThreeCanvas scrollProgressRef={scrollProgressRef} />

      {/* 3-Zone Top Bar Contract (Pastel Pearl) */}
      <header className="sticky top-0 z-40 border-b border-[#E7DCE0] bg-[#FAF7F6]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#inicio"
            className="font-display text-base font-semibold tracking-tight text-[#162A3A] whitespace-nowrap shrink-0 sm:text-lg"
          >
            La Casa de los Mariscos
          </a>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-7 text-sm font-medium text-[#4A6070] md:flex"
          >
            <a
              href="#carta"
              className="transition-colors hover:text-[#D1495B] whitespace-nowrap shrink-0"
            >
              Carta
            </a>
            <a
              href="#galeria"
              className="transition-colors hover:text-[#D1495B] whitespace-nowrap shrink-0"
            >
              Galería
            </a>
            <a
              href="#reservas"
              className="transition-colors hover:text-[#D1495B] whitespace-nowrap shrink-0"
            >
              Reservas
            </a>
            <a
              href="#ubicacion"
              className="transition-colors hover:text-[#D1495B] whitespace-nowrap shrink-0"
            >
              Ubicación
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#D1495B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B8384A] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Ver Pedido</span>
              <span className="font-mono tabular-nums">({totalCartItems})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label="Abrir menú de navegación"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7DCE0] text-[#162A3A] md:hidden"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileNavOpen && (
          <nav
            aria-label="Navegación móvil"
            className="flex items-center justify-around border-t border-[#E7DCE0] bg-[#FCEEF1] px-4 py-2.5 text-xs font-semibold text-[#162A3A] md:hidden"
          >
            <a href="#carta" onClick={() => setIsMobileNavOpen(false)}>
              Carta
            </a>
            <a href="#galeria" onClick={() => setIsMobileNavOpen(false)}>
              Galería
            </a>
            <a href="#reservas" onClick={() => setIsMobileNavOpen(false)}>
              Reservas
            </a>
            <a href="#ubicacion" onClick={() => setIsMobileNavOpen(false)}>
              Ubicación
            </a>
          </nav>
        )}
      </header>

      <main>
        {/* Hero Section: Real Storefront Photo Maximally Visible + Minimal Bottom Scrim + 3s Title Cycle */}
        <section
          id="inicio"
          className="relative flex min-h-[82vh] items-end overflow-hidden py-10 sm:py-14"
        >
          <img
            src={RESTAURANT_INFO.mainPhoto}
            alt="Fachada de La Casa de los Mariscos en Av. San Martín 232, Ushuaia"
            referrerPolicy="no-referrer"
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          />

          {/* Light bottom-only gradient so top 70% of facade remains crisp and unobstructed */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[58%] bg-gradient-to-t from-[#162A3A]/85 via-[#162A3A]/35 to-transparent" />

          <div className="relative z-20 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl">
              {/* 3-Second Animated Title Block */}
              <div
                aria-live="polite"
                className={`hero-title-cycle min-h-[124px] sm:min-h-[144px] ${
                  isTitleVisible ? 'hero-title-visible' : 'hero-title-hidden'
                }`}
              >
                <p className="font-mono text-xs font-medium tracking-wide text-[#F9CFD8]">
                  {currentSlide.kicker}
                </p>
                <h1 className="mt-1.5 text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
                  {currentSlide.title}
                </h1>
                <p className="mt-2 text-sm text-slate-100 sm:text-base">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Persistent Compact Info + Primary Actions */}
              <div className="mt-4 flex flex-col gap-4 border-t border-white/20 pt-4">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-white/95 sm:text-sm">
                  <span className="font-mono font-semibold text-[#FDE68A] tabular-nums">
                    {RESTAURANT_INFO.rating} ★ ({RESTAURANT_INFO.reviewCount})
                  </span>
                  <span aria-hidden="true" className="text-white/60">
                    ·
                  </span>
                  <span className="font-mono tabular-nums">
                    {RESTAURANT_INFO.priceRange}
                  </span>
                  <span aria-hidden="true" className="text-white/60">
                    ·
                  </span>
                  <span>{RESTAURANT_INFO.categoryLabel}</span>
                  <span aria-hidden="true" className="text-white/60">
                    ·
                  </span>
                  <span>{RESTAURANT_INFO.shortAddress}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="#carta"
                    className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#D1495B] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B8384A] whitespace-nowrap"
                  >
                    Ver Carta
                  </a>
                  <a
                    href="#reservas"
                    className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-white/90 px-5 py-2 text-sm font-semibold text-[#162A3A] transition-colors hover:bg-white whitespace-nowrap"
                  >
                    Reservar Mesa
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsCyclePaused((prev) => !prev)}
                    aria-label={
                      isCyclePaused
                        ? 'Reanudar transición de títulos'
                        : 'Fijar título'
                    }
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-lg border border-white/30 bg-[#162A3A]/60 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#162A3A]/85"
                  >
                    {isCyclePaused ? (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>Reanudar</span>
                      </>
                    ) : (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Fijar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps Local Actions Strip (Pastel Seafoam Mint) */}
        <section
          aria-label="Ficha de Google Maps y accesos rápidos"
          className="relative z-20 border-y border-[#D2E3DF] bg-[#ECF5F3]"
        >
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#4A6070]">
                <span className="font-semibold text-[#162A3A]">
                  {RESTAURANT_INFO.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold tabular-nums text-[#162A3A]">
                  {RESTAURANT_INFO.rating} ★ ({RESTAURANT_INFO.reviewCount})
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {RESTAURANT_INFO.priceRange}
                </span>
                <span aria-hidden="true">·</span>
                <span>{RESTAURANT_INFO.categoryLabel}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={RESTAURANT_INFO.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C6DCD7] bg-white px-3 py-1.5 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
                >
                  <Navigation className="h-3.5 w-3.5 text-[#D1495B]" />
                  Cómo llegar
                </a>

                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    isSaved
                      ? 'border-[#D1495B] bg-[#FCEEF1] text-[#D1495B]'
                      : 'border-[#C6DCD7] bg-white text-[#162A3A] hover:border-[#D1495B]'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5 text-[#D1495B]" />
                  {isSaved ? 'Guardado' : 'Guardar'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowNearbyPanel((prev) => !prev)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C6DCD7] bg-white px-3 py-1.5 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
                >
                  <Compass className="h-3.5 w-3.5 text-[#D1495B]" />
                  Cercano
                </button>

                <button
                  type="button"
                  onClick={handleSendToPhone}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C6DCD7] bg-white px-3 py-1.5 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
                >
                  <Smartphone className="h-3.5 w-3.5 text-[#D1495B]" />
                  Enviar al teléfono
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#C6DCD7] bg-white px-3 py-1.5 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
                >
                  <Share2 className="h-3.5 w-3.5 text-[#D1495B]" />
                  Compartir
                </button>

                <a
                  href="#carta"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#D1495B] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#B8384A] whitespace-nowrap"
                >
                  Pedir en línea
                </a>
              </div>
            </div>

            {showNearbyPanel && (
              <div className="mt-4 grid gap-3 border-t border-[#D2E3DF] pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {NEARBY_LANDMARKS.map((place) => (
                  <div
                    key={place.name}
                    className="rounded-xl border border-[#D2E3DF] bg-white px-3.5 py-2.5"
                  >
                    <p className="text-xs font-semibold text-[#162A3A]">
                      {place.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#4A6070]">
                      {place.distance}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section 01: Digital Menu */}
        <MenuSection
          items={menuItems}
          cartQuantities={cartQuantities}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          onUpdateCartQty={handleUpdateCartQty}
          onUpdatePrice={handleUpdatePrice}
          onAddMenuItem={handleAddMenuItem}
          onResetPrices={handleResetPrices}
          onUnlockAdmin={handleUnlockAdmin}
          onLockAdmin={() => setIsAdmin(false)}
        />

        {/* Section 02: 5-Photo Gallery (5 Distinct High-Quality Photos, Clean Captions Below) */}
        <GallerySection
          frames={galleryFrames}
          isAdmin={isAdmin}
          onReplaceFrameImage={handleReplaceFrameImage}
        />

        {/* Section 03: Online Reservations -> WhatsApp */}
        <ReservationSection />
      </main>

      {/* Footer: Complete Restaurant Information & Location (Pastel Coastal Mist, No ZIP Container) */}
      <footer
        id="ubicacion"
        className="relative z-20 border-t border-[#CDDFE8] bg-[#E3EEF3] py-16 text-[#162A3A]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left: Complete Local Info, Socials, Hours & Contact */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-wider text-[#D1495B] uppercase">
                Ubicación y Contacto
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#162A3A] sm:text-3xl">
                {RESTAURANT_INFO.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4A6070]">
                {RESTAURANT_INFO.tagline}. Centolla viva de acuario, merluza negra y
                cocina artesanal fueguina en el centro de Ushuaia.
              </p>

              <ul className="mt-6 grid gap-3.5 text-sm sm:grid-cols-2">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D1495B]" />
                  <span>{RESTAURANT_INFO.address}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D1495B]" />
                  <span>
                    {RESTAURANT_INFO.hoursLunch} · {RESTAURANT_INFO.hoursDinner}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#D1495B]" />
                  <a
                    href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-semibold text-[#162A3A] hover:text-[#D1495B]"
                  >
                    {RESTAURANT_INFO.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-[#D1495B]" />
                  <a
                    href={RESTAURANT_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#162A3A] hover:text-[#D1495B]"
                  >
                    {RESTAURANT_INFO.instagramHandle}
                  </a>
                </li>
              </ul>

              <p className="mt-6 font-mono text-xs text-[#4A6070] tabular-nums">
                Google Maps: {RESTAURANT_INFO.rating} ★ ({RESTAURANT_INFO.reviewCount} opiniones) ·{' '}
                {RESTAURANT_INFO.priceRange} · {RESTAURANT_INFO.categoryLabel}
              </p>
            </div>

            {/* Right: Clean Location Card */}
            <div className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[#CDDFE8] bg-white p-6">
                <div>
                  <h3 className="font-sans text-base font-semibold text-[#162A3A]">
                    Visitanos en Av. San Martín 232
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4A6070]">
                    A 250 m del Canal Beagle y a 350 m del Puerto Turístico de Ushuaia.
                    Atención sin reserva previa sujeta a disponibilidad de mesas.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={RESTAURANT_INFO.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#D1495B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B8384A] whitespace-nowrap"
                  >
                    Cómo llegar
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-[#CDDFE8] bg-[#FAF7F6] px-4 py-2 text-xs font-semibold text-[#162A3A] transition-colors hover:border-[#D1495B] whitespace-nowrap"
                  >
                    Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#CDDFE8] pt-6 text-xs text-[#4A6070] sm:flex-row">
            <p>
              © {new Date().getFullYear()} {RESTAURANT_INFO.name} · Av. San Martín 232, Ushuaia.
            </p>
            <div className="flex items-center gap-5">
              <a href="#carta" className="hover:text-[#D1495B]">
                Carta
              </a>
              <a href="#galeria" className="hover:text-[#D1495B]">
                Galería
              </a>
              <a href="#reservas" className="hover:text-[#D1495B]">
                Reservas
              </a>
              <a
                href={RESTAURANT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D1495B]"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        entries={syncedCart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-[#E7DCE0] bg-[#162A3A] px-4 py-2.5 text-xs font-semibold text-white shadow-xl"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
