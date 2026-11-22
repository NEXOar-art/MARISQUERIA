import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Lock,
  Unlock,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import {
  MENU_CATEGORIES,
  MenuCategory,
  MenuItem,
} from '../data/restaurantData';

interface MenuSectionProps {
  items: MenuItem[];
  cartQuantities: Record<string, number>;
  isAdmin: boolean;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQty: (id: string, delta: number) => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onResetPrices: () => void;
  onUnlockAdmin: (pin: string) => boolean;
  onLockAdmin: () => void;
}

function normalizeText(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function MenuSection({
  items,
  cartQuantities,
  isAdmin,
  onAddToCart,
  onUpdateCartQty,
  onUpdatePrice,
  onAddMenuItem,
  onResetPrices,
  onUnlockAdmin,
  onLockAdmin,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showNewDishForm, setShowNewDishForm] = useState(false);

  // New dish form state (Admin only)
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<Exclude<MenuCategory, 'Todas'>>(
    'Centolla Fueguina'
  );
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const filteredItems = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    return items.filter((item) => {
      const matchesCat =
        selectedCategory === 'Todas' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      const haystack = normalizeText(
        `${item.name} ${item.description} ${item.category} ${item.tags.join(' ')}`
      );
      return haystack.includes(q);
    });
  }, [items, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todas: items.length };
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockAdmin(pinInput.trim())) {
      setShowPinPrompt(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Clave incorrecta. Verificá el PIN de administrador.');
    }
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(newPrice);
    if (!newName.trim() || !numericPrice || numericPrice <= 0) return;
    onAddMenuItem({
      name: newName.trim(),
      category: newCat,
      description:
        newDesc.trim() || 'Preparación artesanal de la cocina de La Casa de los Mariscos.',
      price: numericPrice,
      tags: [newCat.toLowerCase(), newName.toLowerCase()],
    });
    setNewName('');
    setNewDesc('');
    setNewPrice('');
    setShowNewDishForm(false);
  };

  const formatARS = (value: number) =>
    `$ ${value.toLocaleString('es-AR')}`;

  return (
    <section
      id="carta"
      className="relative z-20 bg-[#FAF7F6] py-20 text-[#162A3A] sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 border-b border-[#E7DCE0] pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#D1495B] uppercase">
              01 · Gastronomía del Canal Beagle
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#162A3A] sm:text-4xl">
              Nuestra Carta Digital
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4A6070] sm:text-base">
              Filtrá por categoría o buscá por ingrediente para sumar tus platos al pedido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowNewDishForm((prev) => !prev)}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D6E5EC] bg-white px-4 py-2 text-xs font-semibold text-[#162A3A] transition-colors hover:bg-[#E9F3F7] whitespace-nowrap shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar Plato
                </button>
                <button
                  type="button"
                  onClick={onResetPrices}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#D6E5EC] bg-white px-4 py-2 text-xs font-semibold text-[#4A6070] transition-colors hover:bg-[#E9F3F7] whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restaurar Precios
                </button>
                <button
                  type="button"
                  onClick={onLockAdmin}
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#D1495B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#B8384A] whitespace-nowrap shrink-0"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Admin Activo (Cerrar)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinPrompt((prev) => !prev)}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#E2CCD2] bg-white px-4 py-2 text-xs font-semibold text-[#4A6070] transition-colors hover:border-[#D1495B] hover:text-[#162A3A] whitespace-nowrap shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
                Editar Precios (Admin)
              </button>
            )}
          </div>
        </div>

        {/* Admin PIN Unlock Panel */}
        {showPinPrompt && !isAdmin && (
          <form
            onSubmit={handlePinSubmit}
            className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Acceso de Administrador
              </h3>
              <p className="text-xs text-slate-600">
                Ingresá la clave numérica del local para habilitar la edición de precios y platos.
              </p>
              {pinError && (
                <p className="mt-1 text-xs font-medium text-[#C83232]" role="alert">
                  {pinError}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Clave PIN"
                aria-label="Clave de administrador"
                className="min-h-[40px] w-36 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPinPrompt(false);
                  setPinError('');
                }}
                aria-label="Cancelar acceso"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Admin Add New Dish Panel */}
        {isAdmin && showNewDishForm && (
          <form
            onSubmit={handleCreateDish}
            className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Nombre del plato
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Centolla Gratinada Especial"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Categoría
                <select
                  value={newCat}
                  onChange={(e) =>
                    setNewCat(e.target.value as Exclude<MenuCategory, 'Todas'>)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                >
                  {MENU_CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Precio (ARS)
                <input
                  type="number"
                  min={100}
                  step={100}
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="45000"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </label>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-700">
                Descripción
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ingredientes, preparación o guarnición"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                />
              </label>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg bg-[#C83232] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A62626]"
              >
                <Check className="h-4 w-4" />
                Guardar Plato
              </button>
            </div>
          </form>
        )}

        {/* Search + Category Taxonomy Bar */}
        <div className="mt-8 space-y-5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por frase, ingrediente o producto (ej: centolla, merluza negra, ajillo, sin tacc, paella)..."
              aria-label="Buscar en la carta"
              className="min-h-[48px] w-full rounded-xl border border-slate-300 bg-white pr-10 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Categorías de la carta"
            className="flex flex-wrap gap-2"
          >
            {MENU_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {category}{' '}
                  <span
                    className={`ml-1 font-mono text-[11px] tabular-nums ${
                      active ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong className="font-mono tabular-nums text-slate-800">{filteredItems.length}</strong> platos
            {selectedCategory !== 'Todas' ? ` en ${selectedCategory}` : ''}
          </span>
          {isAdmin && (
            <span className="font-medium text-[#C83232]">
              Modo edición habilitado · Los cambios se guardan automáticamente
            </span>
          )}
        </div>

        {/* Menu Grid — Text-First, Zero Product Images as Requested */}
        {filteredItems.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-base font-semibold text-slate-900">
              No encontramos platos que coincidan con "{searchQuery}"
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Probá buscando por "centolla", "merluza", "cazuela", "pasta" o seleccioná otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todas');
              }}
              className="mt-4 min-h-[40px] rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Ver toda la carta
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const qtyInCart = cartQuantities[item.id] || 0;
              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-transform duration-150 hover:-translate-y-0.5 hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#C83232]">
                        {item.category}
                      </span>
                      {item.highlight && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-slate-600">
                            {item.highlight}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-2 font-sans text-base font-semibold leading-snug text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    {isAdmin ? (
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <span>$</span>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={item.price}
                          onChange={(e) => {
                            const nextVal = Number(e.target.value);
                            if (!Number.isNaN(nextVal) && nextVal >= 0) {
                              onUpdatePrice(item.id, nextVal);
                            }
                          }}
                          aria-label={`Editar precio de ${item.name}`}
                          className="w-28 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 font-mono text-sm font-semibold tabular-nums text-slate-900 focus:border-[#C83232] focus:bg-white focus:outline-none"
                        />
                      </label>
                    ) : (
                      <span className="font-mono text-base font-semibold tabular-nums text-slate-900">
                        {formatARS(item.price)}
                      </span>
                    )}

                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.id, -1)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-700 transition-colors hover:bg-slate-200"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[24px] text-center font-mono text-xs font-semibold tabular-nums text-slate-900">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartQty(item.id, 1)}
                          aria-label={`Sumar una unidad de ${item.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white transition-colors hover:bg-slate-800"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#C83232] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#A62626] whitespace-nowrap shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Agregar
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
