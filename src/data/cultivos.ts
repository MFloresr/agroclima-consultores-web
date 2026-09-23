// Tipos de cultivo del formulario. Compartido por el formulario (cliente) y la validación (servidor).

/** Cultivos que se pueden elegir en el formulario; la base de datos acepta exactamente estos valores. */
export const CULTIVOS = ['Frutal', 'Viñedo', 'Cereal', 'Olivo', 'Otros'] as const;
