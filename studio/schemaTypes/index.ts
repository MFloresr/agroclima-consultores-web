import {ajustes} from './ajustes'
import {articulo} from './articulo'
import {caso} from './caso'
import {portada} from './portada'
import {servicio} from './servicio'
import {sobre} from './sobre'

export const schemaTypes = [portada, servicio, caso, sobre, articulo, ajustes]

/** Documentos únicos: solo existe uno de cada y no se pueden crear ni borrar. */
export const UNICOS = ['portada', 'sobre', 'ajustes'] as const
