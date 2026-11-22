import { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { MenuItem, RESTAURANT_INFO } from '../data/restaurantData';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

type OrderModality = 'local' | 'takeaway' | 'delivery';

interface CartDrawerProps {
  isOpen: boolean;
  entries: CartEntry[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  entries,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [modality, setModality] = useState<OrderModality>('local');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [generatedOrder, setGeneratedOrder] = useState<{
    text: string;
    waUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const total = entries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  const formatARS = (val: number) => `$ ${val.toLocaleString('es-AR')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entries.length === 0 || !customerName.trim()) return;
    if (modality === 'local' && !tableNumber.trim()) return;
    if (modality === 'delivery' && !deliveryAddress.trim()) return;

    const lines = entries
      .map(
        (entry) =>
          `• ${entry.quantity}x ${entry.item.name} — ${formatARS(
            entry.item.price * entry.quantity
          )}`
      )
      .join('\n');

    const modalityLabel =
      modality === 'local'
        ? `Consumo en el local · Mesa: ${tableNumber.trim()}`
        : modality === 'takeaway'
        ? 'Para llevar (Take Away en Av. San Martín 232)'
        : `Delivery · Dirección: ${deliveryAddress.trim()}`;

    const message = [
      `Hola *${RESTAURANT_INFO.name}*! Quiero confirmar mi pedido:`,
      ``,
      `*Nombre:* ${customerName.trim()}`,
      `*Modalidad:* ${modalityLabel}`,
      notes.trim() ? `*Notas:* ${notes.trim()}` : null,
      ``,
      `*Detalle del pedido:*`,
      lines,
      ``,
      `*Total estimado:* ${formatARS(total)}`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const waUrl = `https://wa.me/${
      RESTAURANT_INFO.whatsappNumber
    }?text=${encodeURIComponent(message)}`;

    setGeneratedOrder({ text: message, waUrl });

    // Trigger external WhatsApp link cleanly via anchor element
    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopy = async () => {
    if (!generatedOrder) return;
    try {
      await navigator.clipboard.writeText(generatedOrder.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compra"
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white text-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tu Pedido</h2>
            <p className="text-xs text-slate-500">
              {entries.reduce((s, e) => s + e.quantity, 0)} productos seleccionados
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {entries.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base font-semibold text-slate-900">
                Tu carrito está vacío
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Agregá platos de nuestra carta para armar tu pedido y enviarlo por WhatsApp.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 min-h-[40px] rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Ir a la Carta
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-4">
                {entries.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#C83232]">
                        {item.category}
                      </p>
                      <h3 className="font-sans text-sm font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs tabular-nums text-slate-600">
                        {formatARS(item.price)} c/u · Subtotal{' '}
                        <strong className="text-slate-900">
                          {formatARS(item.price * quantity)}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label={`Disminuir ${item.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[24px] text-center font-mono text-xs font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label={`Aumentar ${item.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Eliminar ${item.name}`}
                        className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-[#C83232]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form id="cart-checkout-form" onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Nombre completo *
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Martín González"
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700">
                    Modalidad de entrega *
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'local', label: 'En el local' },
                        { id: 'takeaway', label: 'Para llevar' },
                        { id: 'delivery', label: 'Delivery' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setModality(opt.id)}
                        className={`min-h-[40px] rounded-lg border px-2 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                          modality === opt.id
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {modality === 'local' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Número de mesa en el salón *
                      <input
                        type="text"
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="Ej: Mesa 4 (Ventana)"
                        className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </label>
                  </div>
                )}

                {modality === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Dirección de entrega en Ushuaia *
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Calle, altura, piso / hotel"
                        className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                      />
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Observaciones (opcional)
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Punto de cocción, sin TACC, cubiertos..."
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    />
                  </label>
                </div>
              </form>

              {/* Confirmation / WhatsApp Fallback Box */}
              {generatedOrder && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
                  <p className="font-semibold">
                    Pedido listo para enviar a WhatsApp ({RESTAURANT_INFO.phoneDisplay})
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={generatedOrder.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#16A34A] px-3.5 py-1.5 font-semibold text-white hover:bg-[#15803D]"
                    >
                      Abrir WhatsApp
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-semibold text-emerald-900 hover:bg-emerald-100"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copiar detalle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Footer Total & Primary WhatsApp Action */}
        {entries.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Total del pedido
              </span>
              <span className="font-mono text-lg font-semibold tabular-nums text-slate-900">
                {formatARS(total)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClearCart}
                className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Vaciar
              </button>
              <button
                type="submit"
                form="cart-checkout-form"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#D1495B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B8384A]"
              >
                <MessageCircle className="h-4 w-4" />
                Continuar por WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
