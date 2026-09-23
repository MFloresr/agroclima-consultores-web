<script lang="ts">
  import { onMount } from 'svelte';
  import uPlot from 'uplot';
  import 'uplot/dist/uPlot.min.css';
  import { hora, num } from '../../lib/clima';

  interface Props {
    titulo: string;
    unidad: string;
    color: string;
    relleno: string;
    puntos: { t: number; v: number }[];
    min: number;
    max: number;
    alto?: number;
  }

  let { titulo, unidad, color, relleno, puntos, min, max, alto = 220 }: Props = $props();

  let contenedor: HTMLDivElement;
  let grafico: uPlot | undefined;

  function datos(): uPlot.AlignedData {
    return [puntos.map((p) => p.t / 1000), puntos.map((p) => p.v)];
  }

  onMount(() => {
    const opciones: uPlot.Options = {
      width: contenedor.clientWidth,
      height: alto,
      padding: [8, 8, 0, 0],
      scales: { x: { time: true }, y: { range: [min, max] } },
      legend: { show: true, live: true },
      cursor: { drag: { x: false, y: false }, points: { size: 8 } },
      series: [
        // Sin el cursor encima, la leyenda muestra el último valor
        { label: 'Hora', value: (_u, v) => (v == null ? 'Ahora' : hora(v * 1000)) },
        {
          label: titulo,
          stroke: color,
          width: 2.5,
          fill: relleno,
          value: (_u, v) => `${num(v ?? puntos[puntos.length - 1]?.v ?? 0)} ${unidad}`,
        },
      ],
      axes: [
        {
          stroke: '#56655A',
          grid: { show: false },
          ticks: { show: false },
          values: (_u, vals) => vals.map((v) => hora(v * 1000)),
          font: '12px "DM Sans Variable", sans-serif',
        },
        {
          stroke: '#56655A',
          grid: { stroke: '#ECE5D7', width: 1 },
          ticks: { show: false },
          size: 40,
          font: '12px "DM Sans Variable", sans-serif',
        },
      ],
    };
    grafico = new uPlot(opciones, datos(), contenedor);

    const observador = new ResizeObserver(() => {
      grafico?.setSize({ width: contenedor.clientWidth, height: alto });
    });
    observador.observe(contenedor);

    return () => {
      observador.disconnect();
      grafico?.destroy();
    };
  });

  $effect(() => {
    // Actualiza el gráfico al cambiar de finca
    const nuevos = datos();
    grafico?.setData(nuevos);
  });

  const resumen = $derived.by(() => {
    const valores = puntos.map((p) => p.v);
    return `${titulo} de las últimas 24 horas: mínima ${num(Math.min(...valores))} ${unidad}, máxima ${num(Math.max(...valores))} ${unidad}.`;
  });
</script>

<div class="grafico" bind:this={contenedor} role="img" aria-label={resumen} style={`min-height: ${alto + 40}px`}></div>

<style>
  .grafico {
    width: 100%;
  }
  .grafico :global(.u-legend) {
    font-size: 13px;
    text-align: left;
    margin-top: 4px;
  }
  .grafico :global(.u-legend .u-marker) {
    display: none;
  }
</style>
