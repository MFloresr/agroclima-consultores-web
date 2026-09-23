// Formato común de los datos de una estación. Cualquier fuente (ejemplo, Pessl/FieldClimate,
// Meteocat...) debe devolver este formato para que el panel no cambie.

export type NivelRiesgo = 'Bajo' | 'Moderado' | 'Alto';

export interface Finca {
  id: string;
  nombre: string;
  etiqueta: string;
  lugar: string;
  comarca: string;
  cultivo: string;
  latitud: number;
}

export interface PuntoHorario {
  /** Marca de tiempo en milisegundos */
  t: number;
  temp: number;
  hum: number;
}

export interface HoraPrevision {
  t: number;
  temp: number;
  esNoche: boolean;
  probLluvia: number;
}

export interface Alerta {
  titulo: string;
  texto: string;
}

export interface DatosEstacion {
  finca: Finca;
  esEjemplo: boolean;
  actualizado: number;
  ultimas24h: PuntoHorario[];
  actual: {
    temp: number;
    hum: number;
    viento: number;
    racha: number;
    direccionGrados: number;
    direccionNombre: string;
  };
  hoy: {
    min: number;
    horaMin: number;
    max: number;
    horaMax: number;
    lluvia: number;
    humMax: number;
    horaHumMax: number;
  };
  lluvia7d: number;
  prevision: HoraPrevision[];
  agro: {
    et0: number;
    puntoRocio: number;
    horasHojaHumeda: number;
    riesgoMildiu: NivelRiesgo;
  };
  alerta: Alerta | null;
}

/** Una fuente de datos: devuelve los datos de una finca en un momento dado. */
export type FuenteDatos = (fincaId: string, ahora?: Date) => Promise<DatosEstacion>;
