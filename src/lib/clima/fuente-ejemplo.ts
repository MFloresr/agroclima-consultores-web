// Fuente de datos de EJEMPLO. Genera valores verosímiles para Lleida según la época del año,
// la hora y la finca. Es determinista: la misma finca y hora dan siempre los mismos valores.

import { fincasEjemplo } from './fincas';
import type { Alerta, FuenteDatos, HoraPrevision, NivelRiesgo, PuntoHorario } from './tipos';

const HORA = 3_600_000;

// Valores medios aproximados de Lleida por mes: máxima, mínima, humedad máx. y mín. (%)
const NORMALES = [
  { max: 10.5, min: -1, hMax: 97, hMin: 62 },
  { max: 13.5, min: 0, hMax: 95, hMin: 50 },
  { max: 18, min: 2.5, hMax: 92, hMin: 40 },
  { max: 20.5, min: 5.5, hMax: 90, hMin: 38 },
  { max: 25, min: 10, hMax: 88, hMin: 36 },
  { max: 30, min: 14, hMax: 85, hMin: 30 },
  { max: 33, min: 17, hMax: 82, hMin: 27 },
  { max: 32.5, min: 16.5, hMax: 84, hMin: 29 },
  { max: 27.5, min: 13, hMax: 90, hMin: 36 },
  { max: 21, min: 8.5, hMax: 94, hMin: 45 },
  { max: 14, min: 3, hMax: 97, hMin: 58 },
  { max: 9.5, min: -0.5, hMax: 98, hMin: 66 },
];

// Hora aproximada de salida y puesta de sol en Lleida (hora local) por mes
const SOL = [
  [8.3, 17.8], [8.0, 18.4], [7.4, 19.3], [7.5, 20.6], [7.0, 21.1], [6.8, 21.5],
  [7.0, 21.4], [7.4, 20.9], [7.9, 20.0], [8.2, 19.0], [7.9, 17.6], [8.3, 17.5],
];

// Diferencias de microclima respecto a Alcarràs
const MICROCLIMA: Record<string, { dT: number; dH: number }> = {
  alcarras: { dT: 0, dH: 0 },
  mollerussa: { dT: -0.6, dH: 4 },
  balaguer: { dT: -0.3, dH: -2 },
};

const DIRECCIONES = [
  { grados: 270, nombre: 'Oeste (ponent)' },
  { grados: 315, nombre: 'Noroeste (mestral)' },
  { grados: 225, nombre: 'Suroeste (garbí)' },
  { grados: 90, nombre: 'Este (llevant)' },
];

function aleatorio(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function semilla(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function claveDia(fecha: Date) {
  return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
}

function redondear(valor: number, decimales = 1) {
  const f = 10 ** decimales;
  return Math.round(valor * f) / f;
}

/** Máxima y mínima del día para una finca (con variación diaria determinista). */
function extremosDelDia(fincaId: string, fecha: Date) {
  const n = NORMALES[fecha.getMonth()];
  const r = aleatorio(semilla(`${fincaId}:${claveDia(fecha)}`));
  const m = MICROCLIMA[fincaId] ?? MICROCLIMA.alcarras;
  const variacion = (r() - 0.5) * 4;
  return {
    max: n.max + variacion + m.dT,
    min: n.min + variacion * 0.6 + m.dT - (r() < 0.2 ? 1.5 : 0),
    hMax: Math.min(99, n.hMax + m.dH),
    hMin: Math.max(15, n.hMin + m.dH + (r() - 0.5) * 8),
  };
}

/** Temperatura y humedad a una hora concreta, con el ciclo diario típico. */
function valoresEnHora(fincaId: string, instante: Date) {
  const hora = instante.getHours() + instante.getMinutes() / 60;
  const [salida] = SOL[instante.getMonth()];
  const horaMin = salida;
  const horaMax = 15.5;
  const hoy = extremosDelDia(fincaId, instante);

  let temp: number;
  if (hora >= horaMin && hora <= horaMax) {
    const f = (hora - horaMin) / (horaMax - horaMin);
    temp = hoy.min + (hoy.max - hoy.min) * (1 - Math.cos(Math.PI * f)) / 2;
  } else {
    // Enfriamiento nocturno: de la máxima de hoy (o de ayer) a la mínima siguiente
    const despuesMax = hora > horaMax;
    const referencia = despuesMax ? instante : new Date(instante.getTime() - 24 * HORA);
    const maxRef = extremosDelDia(fincaId, referencia).max;
    const minSiguiente = despuesMax
      ? extremosDelDia(fincaId, new Date(instante.getTime() + 24 * HORA)).min
      : hoy.min;
    const duracion = 24 - horaMax + horaMin;
    const transcurrido = despuesMax ? hora - horaMax : hora + 24 - horaMax;
    const f = transcurrido / duracion;
    temp = maxRef - (maxRef - minSiguiente) * Math.sin((Math.PI / 2) * Math.sqrt(f));
  }

  const r = aleatorio(semilla(`${fincaId}:${instante.getTime()}`));
  temp += (r() - 0.5) * 0.4;
  const f = Math.min(1, Math.max(0, (temp - hoy.min) / Math.max(1, hoy.max - hoy.min)));
  const hum = hoy.hMax - (hoy.hMax - hoy.hMin) * f + (r() - 0.5) * 3;
  return { temp: redondear(temp), hum: Math.round(Math.min(100, Math.max(10, hum))) };
}

function puntoDeRocio(temp: number, hum: number) {
  const a = 17.27;
  const b = 237.7;
  const g = (a * temp) / (b + temp) + Math.log(hum / 100);
  return (b * g) / (a - g);
}

/** Evapotranspiración de referencia (Hargreaves-Samani), en mm/día. */
function et0Hargreaves(fecha: Date, latitud: number, tMax: number, tMin: number) {
  const inicio = new Date(fecha.getFullYear(), 0, 0);
  const j = Math.floor((fecha.getTime() - inicio.getTime()) / (24 * HORA));
  const phi = (latitud * Math.PI) / 180;
  const dr = 1 + 0.033 * Math.cos((2 * Math.PI * j) / 365);
  const delta = 0.409 * Math.sin((2 * Math.PI * j) / 365 - 1.39);
  const ws = Math.acos(-Math.tan(phi) * Math.tan(delta));
  const ra =
    ((24 * 60) / Math.PI) * 0.082 * dr *
    (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
  const tMedia = (tMax + tMin) / 2;
  return 0.0023 * (tMedia + 17.8) * Math.sqrt(Math.max(0, tMax - tMin)) * 0.408 * ra;
}

export function alertaDeEjemplo(mes: number): Alerta {
  if (mes >= 2 && mes <= 4) {
    return {
      titulo: 'Riesgo de helada esta madrugada',
      texto: 'Mínima prevista de −1 °C a las 06:00. Recomendación: activar el riego antihelada desde las 03:30.',
    };
  }
  if (mes >= 5 && mes <= 7) {
    return {
      titulo: 'Viento fuerte mañana por la tarde',
      texto: 'Rachas de hasta 55 km/h de 15:00 a 20:00. Recomendación: adelantar los tratamientos a primera hora.',
    };
  }
  return {
    titulo: 'Lluvia intensa prevista el jueves',
    texto: 'Entre 30 y 40 mm de 16:00 a 22:00. Recomendación: aplazar los tratamientos fitosanitarios previstos.',
  };
}

export const fuenteEjemplo: FuenteDatos = async (fincaId, ahora = new Date()) => {
  const finca = fincasEjemplo.find((f) => f.id === fincaId) ?? fincasEjemplo[0];
  const id = finca.id;
  const horaActual = new Date(ahora);
  horaActual.setMinutes(0, 0, 0);
  const mes = horaActual.getMonth();
  const [salida, puesta] = SOL[mes];

  const ultimas24h: PuntoHorario[] = [];
  for (let i = 23; i >= 0; i--) {
    const t = new Date(horaActual.getTime() - i * HORA);
    ultimas24h.push({ t: t.getTime(), ...valoresEnHora(id, t) });
  }

  // Valores de hoy desde las 00:00
  const deHoy = ultimas24h.filter((p) => new Date(p.t).getDate() === horaActual.getDate());
  const serieHoy = deHoy.length > 0 ? deHoy : ultimas24h.slice(-1);
  const puntoMin = serieHoy.reduce((a, b) => (b.temp < a.temp ? b : a));
  const puntoMax = serieHoy.reduce((a, b) => (b.temp > a.temp ? b : a));
  const puntoHumMax = serieHoy.reduce((a, b) => (b.hum > a.hum ? b : a));

  const r = aleatorio(semilla(`${id}:${claveDia(horaActual)}:viento`));
  const direccion = DIRECCIONES[Math.floor(r() * 3.2) % DIRECCIONES.length];
  const esTarde = horaActual.getHours() >= 13 && horaActual.getHours() <= 19;
  const viento = Math.round(6 + r() * 12 + (esTarde ? 5 : 0));
  const racha = Math.round(viento * (1.6 + r() * 0.5));

  const lluvia7d = redondear(r() < 0.25 ? 0 : r() * 22);
  const lluviaHoy = r() < 0.12 ? redondear(r() * 6) : 0;

  const prevision: HoraPrevision[] = [];
  for (let i = 1; i <= 8; i++) {
    const t = new Date(horaActual.getTime() + i * HORA);
    const h = t.getHours();
    prevision.push({
      t: t.getTime(),
      temp: Math.round(valoresEnHora(id, t).temp),
      esNoche: h < salida || h >= puesta,
      probLluvia: 0,
    });
  }

  const actual = ultimas24h[ultimas24h.length - 1];
  const extremos = extremosDelDia(id, horaActual);
  const horasHojaHumeda = ultimas24h.filter((p) => p.hum >= 90).length;
  const tMedia = ultimas24h.reduce((s, p) => s + p.temp, 0) / ultimas24h.length;
  let riesgoMildiu: NivelRiesgo = 'Bajo';
  if (tMedia >= 10 && tMedia <= 25) {
    if (horasHojaHumeda >= 10) riesgoMildiu = 'Alto';
    else if (horasHojaHumeda >= 4) riesgoMildiu = 'Moderado';
  }

  return {
    finca,
    esEjemplo: true,
    actualizado: horaActual.getTime(),
    ultimas24h,
    actual: {
      temp: actual.temp,
      hum: actual.hum,
      viento,
      racha,
      direccionGrados: direccion.grados,
      direccionNombre: direccion.nombre,
    },
    hoy: {
      min: puntoMin.temp,
      horaMin: puntoMin.t,
      max: puntoMax.temp,
      horaMax: puntoMax.t,
      lluvia: lluviaHoy,
      humMax: puntoHumMax.hum,
      horaHumMax: puntoHumMax.t,
    },
    lluvia7d: Math.max(lluvia7d, lluviaHoy),
    prevision,
    agro: {
      et0: redondear(et0Hargreaves(horaActual, finca.latitud, extremos.max, extremos.min)),
      puntoRocio: redondear(puntoDeRocio(actual.temp, actual.hum)),
      horasHojaHumeda,
      riesgoMildiu,
    },
    alerta: alertaDeEjemplo(mes),
  };
};
