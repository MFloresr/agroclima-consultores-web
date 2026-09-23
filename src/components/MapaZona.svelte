<script lang="ts">
  // Mapa de la zona que cubre AgroClima (OpenStreetMap + Leaflet).
  // Leaflet se carga solo en el navegador y cuando el mapa entra en pantalla (client:visible).
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let contenedor: HTMLDivElement;

  // Contorno aproximado de Segrià, Pla d'Urgell y Noguera
  const zona: [number, number][] = [
    [42.05, 0.72], [41.98, 0.98], [41.9, 1.1], [41.74, 1.03], [41.62, 1.02],
    [41.55, 0.92], [41.47, 0.75], [41.38, 0.55], [41.42, 0.36], [41.6, 0.34],
    [41.76, 0.4], [41.9, 0.55],
  ];

  const localidades: { nombre: string; lat: number; lon: number; principal?: boolean }[] = [
    { nombre: 'Lleida', lat: 41.6176, lon: 0.62, principal: true },
    { nombre: 'Alcarràs', lat: 41.563, lon: 0.525 },
    { nombre: 'Mollerussa', lat: 41.631, lon: 0.895 },
    { nombre: 'Balaguer', lat: 41.79, lon: 0.81 },
    { nombre: 'Almacelles', lat: 41.731, lon: 0.439 },
    { nombre: 'Artesa de Segre', lat: 41.895, lon: 1.048 },
  ];

  onMount(() => {
    let mapa: import('leaflet').Map | undefined;
    import('leaflet').then((L) => {
      mapa = L.map(contenedor, { scrollWheelZoom: false, attributionControl: true }).setView([41.7, 0.72], 9);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa);
      L.polygon(zona, { color: '#2F5D3A', weight: 2, dashArray: '6 6', fillColor: '#2F5D3A', fillOpacity: 0.12 })
        .addTo(mapa)
        .bindTooltip("Zona aproximada: Segrià, Pla d'Urgell y Noguera");
      for (const l of localidades) {
        L.circleMarker([l.lat, l.lon], {
          radius: l.principal ? 8 : 5,
          color: '#fff',
          weight: 2,
          fillColor: l.principal ? '#B4531A' : '#2F5D3A',
          fillOpacity: 1,
        })
          .addTo(mapa)
          .bindTooltip(l.nombre, { permanent: l.principal, direction: 'right' });
      }
    });
    return () => mapa?.remove();
  });
</script>

<div class="mapa" bind:this={contenedor} role="region" aria-label="Mapa de la zona que cubrimos: Segrià, Pla d'Urgell y Noguera, en Lleida"></div>

<style>
  .mapa {
    width: 100%;
    height: 360px;
    border-radius: 22px;
    border: 1px solid var(--linea);
    background: #eef2e6;
    z-index: 0;
  }
</style>
