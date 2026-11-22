import { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

const QUICK_HOURS = ['12:30', '13:30', '14:30', '20:00', '21:00', '22:00'];

export default function ReservationSection() {
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('20:30');
  const [email, setEmail] = useState('');
  const [submittedData, setSubmittedData] = useState<{
    waUrl: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !time || guests < 1) return;

    const message = [
      `Hola *${RESTAURANT_INFO.name}*! Solicito una reserva de mesa:`,
      ``,
      `*Nombre:* ${name.trim()}`,
      `*Personas:* ${guests}`,
      `*Fecha:* ${date}`,
      `*Hora:* ${time} hs`,
      email.trim() ? `*Email:* ${email.trim()}` : null,
      ``,
      `Aguardo confirmación. ¡Muchas gracias!`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const waUrl = `https://wa.me/${
      RESTAURANT_INFO.whatsappNumber
    }?text=${encodeURIComponent(message)}`;

    setSubmittedData({ waUrl, message });

    const anchor = document.createElement('a');
    anchor.href = waUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopy = async () => {
    if (!submittedData) return;
    try {
      await navigator.clipboard.writeText(submittedData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <section
      id="reservas"
      className="relative z-20 bg-[#E9F3F7] py-20 text-[#162A3A] sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-10 lg:grid-cols-12">
          {/* Left Narrative & Real Restaurant Details */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#D1495B] uppercase">
                03 · Atención en Salón
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#162A3A] sm:text-4xl">
                Reservá tu Mesa
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4A6070] sm:text-base">
                Asegurá tu lugar con anticipación en el centro de Ushuaia. Confirmamos
                directamente por WhatsApp.
              </p>

              <dl className="mt-7 space-y-3.5 border-t border-[#D3E3EA] pt-6 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-semibold text-[#162A3A]">Almuerzo</dt>
                  <dd className="font-mono text-[#4A6070] tabular-nums">
                    12:00 — 15:30 hs
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-semibold text-[#162A3A]">Cena</dt>
                  <dd className="font-mono text-[#4A6070] tabular-nums">
                    20:00 — 00:00 hs
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="font-semibold text-[#162A3A]">WhatsApp Directo</dt>
                  <dd className="font-mono text-[#162A3A] tabular-nums">
                    {RESTAURANT_INFO.phoneDisplay}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 rounded-2xl border border-[#D3E3EA] bg-white p-6">
              <p className="text-xs font-semibold tracking-wide text-[#D1495B] uppercase">
                Experiencia en el Salón
              </p>
              <h3 className="mt-1.5 font-sans text-base font-semibold text-[#162A3A]">
                Acuario Propio &amp; Bodega Austral
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4A6070]">
                En nuestro salón de Av. San Martín 232 podés elegir tu centolla viva
                del día y maridarla con Pinot Noir o Chardonnay patagónico.
              </p>
            </div>
          </div>

          {/* Right Interactive Reservation Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col justify-between rounded-2xl border border-[#D3E3EA] bg-white p-6 sm:p-8"
            >
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-semibold text-[#162A3A]">
                    Solicitud de Reserva
                  </h3>
                  <p className="mt-1 text-xs text-[#4A6070]">
                    Completá tus datos para coordinar tu mesa por WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#162A3A]">
                    Nombre completo *
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Laura Fernández"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D3E3EA] bg-[#FAF7F6] px-3.5 py-2.5 text-sm text-[#162A3A] focus:border-[#D1495B] focus:bg-white focus:outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#162A3A]">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#4A6070]" />
                        Personas *
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={guests}
                        onChange={(e) =>
                          setGuests(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D3E3EA] bg-[#FAF7F6] px-3.5 py-2.5 font-mono text-sm tabular-nums text-[#162A3A] focus:border-[#D1495B] focus:bg-white focus:outline-none"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#162A3A]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#4A6070]" />
                        Fecha *
                      </span>
                      <input
                        type="date"
                        required
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D3E3EA] bg-[#FAF7F6] px-3.5 py-2.5 font-mono text-sm text-[#162A3A] focus:border-[#D1495B] focus:bg-white focus:outline-none"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#162A3A]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#4A6070]" />
                        Hora *
                      </span>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D3E3EA] bg-[#FAF7F6] px-3.5 py-2.5 font-mono text-sm text-[#162A3A] focus:border-[#D1495B] focus:bg-white focus:outline-none"
                      />
                    </label>
                  </div>
                </div>

                {/* Quick Time Slots */}
                <div>
                  <span className="block text-xs font-medium text-[#4A6070]">
                    Horarios frecuentes:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_HOURS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`min-h-[36px] rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors ${
                          time === slot
                            ? 'border-[#162A3A] bg-[#162A3A] text-white'
                            : 'border-[#D3E3EA] bg-[#FAF7F6] text-[#4A6070] hover:border-[#D1495B] hover:text-[#162A3A]'
                        }`}
                      >
                        {slot} hs
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#162A3A]">
                    Email (opcional)
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#D3E3EA] bg-[#FAF7F6] px-3.5 py-2.5 text-sm text-[#162A3A] focus:border-[#D1495B] focus:bg-white focus:outline-none"
                    />
                  </label>
                </div>

                {submittedData && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
                    <p className="font-semibold">
                      Solicitud generada para {name} ({guests} personas · {date} a las{' '}
                      {time} hs).
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={submittedData.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#16A34A] px-3.5 py-1.5 font-semibold text-white hover:bg-[#15803D]"
                      >
                        Abrir en WhatsApp
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
                            Copiar reserva
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-[#EDF3F6] pt-5">
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#D1495B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B8384A]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar Reserva por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
