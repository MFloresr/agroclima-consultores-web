<script lang="ts">
  import { alertaDeEjemplo, fincasEjemplo, fincaPorDefecto, hora, num, obtenerDatos, type DatosEstacion } from '../../lib/clima';
  import GraficoLinea from './GraficoLinea.svelte';

  const iconos = {
    temperatura: 'M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z',
    humedad: 'M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z',
    lluvia: 'M7 14a4 4 0 0 1 .5-8A5.5 5.5 0 0 1 18 7a3.5 3.5 0 0 1-.5 7zM8 18l-1 2M12 18l-1 2M16 18l-1 2',
    viento: 'M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8',
    alerta: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
    info: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18M12 8v5M12 16v.5',
  };
  const sol =
    'M100 62a38 38 0 1 0 0 76a38 38 0 1 0 0-76M100 18v18M100 164v18M18 100h18M164 100h18M42 42l13 13M145 145l13 13M42 158l13-13M145 55l13-13';
  const luna = 'M130 146A56 56 0 1 1 112 46A51 51 0 0 0 130 146z';

  let fincaId = $state(fincaPorDefecto);
  let datos = $state<DatosEstacion | null>(null);

  $effect(() => {
    const id = fincaId;
    obtenerDatos(id).then((d) => {
      if (id === fincaId) datos = d;
    });
  });

  // Todo lo que se puede saber antes de cargar los datos se pinta desde el principio,
  // y el resto reserva su espacio, para que la página no "salte" al cargar.
  const finca = $derived(fincasEjemplo.find((f) => f.id === fincaId) ?? fincasEjemplo[0]);
  const alerta = $derived(datos?.alerta ?? alertaDeEjemplo(new Date().getMonth()));
  const huecosPrevision = Array.from({ length: 8 }, (_, i) => ({ t: -1 - i, temp: 0, esNoche: false, probLluvia: 0 }));

  const temperatura = $derived(datos?.ultimas24h.map((p) => ({ t: p.t, v: p.temp })) ?? []);
  const humedad = $derived(datos?.ultimas24h.map((p) => ({ t: p.t, v: p.hum })) ?? []);
  const rangoTemp = $derived.by(() => {
    if (!datos) return { min: 0, max: 30 };
    const v = datos.ultimas24h.map((p) => p.temp);
    return { min: Math.floor(Math.min(...v) / 5) * 5 - 5, max: Math.ceil(Math.max(...v) / 5) * 5 + 5 };
  });
</script>

<div class="panel">
  <div class="cabecera-panel">
    <div class="titulos">
      <p class="antetitulo">Ejemplo de datos climáticos</p>
      <h1>{finca.nombre}</h1>
      <p class="sub">
        {finca.comarca} · {finca.cultivo} · Actualizado hoy a las {datos ? hora(datos.actualizado) : '--:--'}
      </p>
    </div>
    <p class="aviso-ejemplo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d={iconos.info}></path></svg>
      Datos de ejemplo: la versión final mostrará los de la estación de cada finca
    </p>
  </div>

  <div class="fincas" role="group" aria-label="Finca de ejemplo">
    {#each fincasEjemplo as finca (finca.id)}
      <button type="button" aria-pressed={finca.id === fincaId} onclick={() => (fincaId = finca.id)}>
        {finca.etiqueta}
      </button>
    {/each}
  </div>

  <div class="kpis" aria-live="polite">
    <div class="tarjeta kpi">
      <p class="cap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={iconos.temperatura}></path></svg>Temperatura</p>
      <p class="grande">{datos ? num(datos.actual.temp) : '–'} <span>°C</span></p>
      <p class="detalle">
        {#if datos}
          Mín. <strong>{num(datos.hoy.min)}</strong> ({hora(datos.hoy.horaMin)}) · Máx. <strong>{num(datos.hoy.max)}</strong> ({hora(datos.hoy.horaMax)})
        {:else}&nbsp;{/if}
      </p>
    </div>
    <div class="tarjeta kpi">
      <p class="cap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={iconos.humedad}></path></svg>Humedad relativa</p>
      <p class="grande">{datos?.actual.hum ?? '–'} <span>%</span></p>
      <p class="detalle">
        {#if datos}Máx. <strong>{datos.hoy.humMax} %</strong> ({hora(datos.hoy.horaHumMax)}){:else}&nbsp;{/if}
      </p>
    </div>
    <div class="tarjeta kpi">
      <p class="cap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={iconos.lluvia}></path></svg>Lluvia acumulada</p>
      <p class="grande">{datos ? num(datos.hoy.lluvia) : '–'} <span>mm hoy</span></p>
      <p class="detalle">
        {#if datos}<strong>{num(datos.lluvia7d)} mm</strong> en los últimos 7 días{:else}&nbsp;{/if}
      </p>
    </div>
    <div class="tarjeta kpi viento">
      <div>
        <p class="cap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={iconos.viento}></path></svg>Viento</p>
        <p class="grande">{datos?.actual.viento ?? '–'} <span>km/h</span></p>
        <p class="detalle">
          {#if datos}{datos.actual.direccionNombre} · racha <strong>{datos.actual.racha}</strong>{:else}&nbsp;{/if}
        </p>
      </div>
      <svg class="brujula" width="84" height="84" viewBox="0 0 84 84" role="img" aria-label={`Dirección del viento: ${datos?.actual.direccionNombre ?? ''}`}>
        <circle cx="42" cy="42" r="38" fill="#F6F1E7" stroke="#E5DDCD" stroke-width="2"></circle>
        <text x="42" y="15" text-anchor="middle">N</text>
        <text x="42" y="78" text-anchor="middle">S</text>
        <text x="9" y="46" text-anchor="middle">O</text>
        <text x="75" y="46" text-anchor="middle">E</text>
        <g transform={`rotate(${datos?.actual.direccionGrados ?? 0} 42 42)`}>
          <path d="M42 18v44M34 52l8 10 8-10" stroke="#2E6E8E" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>
    </div>
  </div>

  <div class="alerta">
      <span class="icono-alerta"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={iconos.alerta}></path></svg></span>
      <div>
        <p class="titulo-alerta">Ejemplo de alerta · {alerta.titulo}</p>
        <p>{alerta.texto}</p>
      </div>
      <span class="canal">Así llegaría por WhatsApp y email</span>
    </div>

  <div class="graficos">
    <section class="tarjeta bloque">
      <div class="cabecera-bloque"><h2>Temperatura</h2><span>Últimas 24 horas · °C</span></div>
      {#if datos}
        <GraficoLinea titulo="Temperatura" unidad="°C" color="#B4531A" relleno="rgba(180, 83, 26, 0.12)" puntos={temperatura} min={rangoTemp.min} max={rangoTemp.max} />
      {:else}
        <div class="hueco"></div>
      {/if}
    </section>
    <section class="tarjeta bloque">
      <div class="cabecera-bloque"><h2>Humedad relativa</h2><span>Últimas 24 horas · %</span></div>
      {#if datos}
        <GraficoLinea titulo="Humedad" unidad="%" color="#2E6E8E" relleno="rgba(46, 110, 142, 0.12)" puntos={humedad} min={0} max={100} />
      {:else}
        <div class="hueco"></div>
      {/if}
    </section>
  </div>

  <div class="inferior">
    <section class="tarjeta bloque">
      <div class="cabecera-bloque"><h2>Previsión próximas horas</h2></div>
      <ol class="horas">
        {#each datos?.prevision ?? huecosPrevision as h (h.t)}
          <li>
            <span class="hora">{h.t < 0 ? '--:--' : hora(h.t)}</span>
            <svg width="30" height="30" viewBox="0 0 200 200" fill="none" stroke="#1E2A22" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={h.esNoche ? luna : sol}></path></svg>
            <span class="temp">{h.t < 0 ? '–' : h.temp}°</span>
            <span class="solo-lectores">{h.esNoche ? 'Despejado, noche' : 'Soleado'}</span>
          </li>
        {/each}
      </ol>
    </section>
    <section class="tarjeta bloque">
      <div class="cabecera-bloque"><h2>Indicadores agronómicos de hoy</h2></div>
      <dl class="agro">
        <div><dt>Evapotranspiración (ET0)</dt><dd>{datos ? `${num(datos.agro.et0)} mm` : '–'}</dd><dd class="ayuda">Agua que pierde el cultivo hoy</dd></div>
        <div><dt>Punto de rocío</dt><dd>{datos ? `${num(datos.agro.puntoRocio)} °C` : '–'}</dd><dd class="ayuda">Riesgo de condensación</dd></div>
        <div><dt>Horas de hoja húmeda</dt><dd>{datos ? `${datos.agro.horasHojaHumeda} h` : '–'}</dd><dd class="ayuda">Últimas 24 horas</dd></div>
        <div><dt>Riesgo de mildiu</dt><dd>{datos?.agro.riesgoMildiu ?? '–'}</dd><dd class="ayuda">Modelo orientativo</dd></div>
      </dl>
    </section>
  </div>
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .cabecera-panel {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    flex-wrap: wrap;
  }
  .titulos {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  h1 {
    font-size: clamp(30px, 4vw, 44px);
  }
  .sub {
    color: var(--suave);
  }
  .aviso-ejemplo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 14px;
    background: var(--naranja-claro);
    color: var(--naranja-texto);
    font-size: 14px;
    font-weight: 600;
  }
  .aviso-ejemplo svg {
    flex-shrink: 0;
  }
  .fincas {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 2px;
  }
  .fincas button {
    flex-shrink: 0;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 22px;
    border: 1.5px solid var(--borde-campo);
    background: var(--blanco);
    color: var(--tinta);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .fincas button[aria-pressed='true'] {
    background: var(--verde);
    border-color: var(--verde);
    color: var(--blanco);
  }
  .kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .kpi {
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .kpi.viento {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .kpi.viento > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--suave);
  }
  .grande {
    font-family: var(--f-titulo);
    font-weight: 600;
    font-size: 48px;
    line-height: 1;
  }
  .grande span {
    font-size: 22px;
  }
  .detalle {
    font-size: 14px;
    color: var(--tinta-2);
  }
  .brujula {
    flex-shrink: 0;
  }
  .brujula text {
    font-size: 11px;
    font-weight: 700;
    fill: var(--suave);
  }
  .alerta {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 24px;
    border-radius: 18px;
    background: var(--aviso-fondo);
    border: 1.5px solid var(--aviso-borde);
  }
  .icono-alerta {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--sol);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .alerta > div {
    flex-grow: 1;
  }
  .titulo-alerta {
    font-weight: 700;
  }
  .canal {
    font-size: 13px;
    font-weight: 600;
    color: var(--suave);
  }
  .graficos {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .bloque {
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
  }
  .cabecera-bloque {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
  }
  .cabecera-bloque h2 {
    font-family: var(--f-texto);
    font-size: 17px;
    font-weight: 700;
  }
  .cabecera-bloque span {
    font-size: 14px;
    color: var(--suave);
  }
  .hueco {
    height: 256px;
    border-radius: 12px;
    background: var(--arena);
  }
  .inferior {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 16px;
  }
  .horas {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(8, minmax(64px, 1fr));
    gap: 8px;
    overflow-x: auto;
  }
  .horas li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
    border-radius: 16px;
    background: var(--arena);
  }
  .hora {
    font-size: 14px;
    color: var(--suave);
  }
  .temp {
    font-family: var(--f-titulo);
    font-weight: 600;
    font-size: 20px;
  }
  .agro {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .agro > div {
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--arena);
  }
  .agro dt {
    font-size: 13px;
    font-weight: 600;
    color: var(--suave);
  }
  .agro dd {
    margin: 4px 0 0;
    font-family: var(--f-titulo);
    font-weight: 600;
    font-size: 24px;
  }
  .agro dd.ayuda {
    font-family: var(--f-texto);
    font-weight: 400;
    font-size: 12px;
    color: var(--suave);
  }

  @media (max-width: 1100px) {
    .kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .inferior,
    .graficos {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 600px) {
    .kpis {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .kpi {
      padding: 14px 16px;
    }
    .kpi:first-child,
    .kpi.viento {
      grid-column: span 2;
    }
    .grande {
      font-size: 32px;
    }
    .kpi:first-child .grande {
      font-size: 56px;
    }
    .alerta {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 16px;
    }
    .bloque {
      padding: 16px;
    }
    .horas {
      display: flex;
    }
    .horas li {
      min-width: 64px;
    }
  }
</style>
