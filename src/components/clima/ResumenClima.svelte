<script lang="ts">
  // Resumen del panel para la home: 4 datos y un gráfico ligero en SVG (sin librerías).
  import { fincaPorDefecto, num, obtenerDatos, type DatosEstacion } from '../../lib/clima';

  let datos = $state<DatosEstacion | null>(null);

  $effect(() => {
    obtenerDatos(fincaPorDefecto).then((d) => (datos = d));
  });

  const ANCHO = 600;
  const ALTO = 140;

  const linea = $derived.by(() => {
    if (!datos) return { trazo: '', area: '' };
    const v = datos.ultimas24h.map((p) => p.temp);
    const min = Math.min(...v) - 2;
    const max = Math.max(...v) + 2;
    const puntos = v.map((valor, i) => {
      const x = (i * ANCHO) / (v.length - 1);
      const y = ALTO - ((valor - min) / (max - min)) * ALTO;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const trazo = `M${puntos.join(' L')}`;
    return { trazo, area: `${trazo} L${ANCHO},${ALTO} L0,${ALTO} Z` };
  });
</script>

<div class="resumen">
  <dl class="kpis">
    <div>
      <dt>Temperatura</dt>
      <dd>{datos ? `${num(datos.actual.temp)} °C` : '–'}</dd>
      <dd class="sub">{datos ? `mín. ${num(datos.hoy.min)} · máx. ${num(datos.hoy.max)}` : ''}</dd>
    </div>
    <div>
      <dt>Humedad</dt>
      <dd>{datos ? `${datos.actual.hum} %` : '–'}</dd>
      <dd class="sub">{datos ? `máx. ${datos.hoy.humMax} % hoy` : ''}</dd>
    </div>
    <div>
      <dt>Lluvia</dt>
      <dd>{datos ? `${num(datos.hoy.lluvia)} mm` : '–'}</dd>
      <dd class="sub">{datos ? `${num(datos.lluvia7d)} mm en 7 días` : ''}</dd>
    </div>
    <div>
      <dt>Viento</dt>
      <dd>{datos ? `${datos.actual.viento} km/h` : '–'}</dd>
      <dd class="sub">{datos ? `${datos.actual.direccionNombre.split(' ')[0]} · racha ${datos.actual.racha}` : ''}</dd>
    </div>
  </dl>
  <div class="grafico">
    <p class="titulo">Temperatura · últimas 24 h</p>
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none" role="img" aria-label="Evolución de la temperatura en las últimas 24 horas">
      <path d={linea.area} fill="rgba(180, 83, 26, 0.14)"></path>
      <path d={linea.trazo} fill="none" stroke="#B4531A" stroke-width="2.5" vector-effect="non-scaling-stroke"></path>
    </svg>
    <div class="ejes"><span>Hace 24 h</span><span>Hace 12 h</span><span>Ahora</span></div>
  </div>
</div>

<style>
  .resumen {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    border-radius: 24px;
    background: var(--arena);
    color: var(--tinta);
  }
  .kpis {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .kpis > div {
    padding: 16px;
    border-radius: 16px;
    background: var(--blanco);
    border: 1px solid var(--linea);
  }
  dt {
    font-size: 13px;
    font-weight: 600;
    color: var(--suave);
  }
  dd {
    margin: 6px 0 0;
    font-family: var(--f-titulo);
    font-weight: 600;
    font-size: 26px;
    line-height: 1.1;
  }
  dd.sub {
    font-family: var(--f-texto);
    font-weight: 400;
    font-size: 13px;
    color: var(--suave);
  }
  .grafico {
    padding: 16px 18px 10px;
    border-radius: 16px;
    background: var(--blanco);
    border: 1px solid var(--linea);
  }
  .titulo {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  svg {
    width: 100%;
    height: 120px;
    display: block;
  }
  .ejes {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--suave);
    margin-top: 6px;
  }
  @media (max-width: 700px) {
    .resumen {
      padding: 14px;
    }
    .kpis {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    dd {
      font-size: 24px;
    }
  }
</style>
