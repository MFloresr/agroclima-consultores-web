import {defineConfig} from 'sanity'
import {structureTool, type StructureResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HomeIcon} from '@sanity/icons/Home'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {StarIcon} from '@sanity/icons/Star'
import {UserIcon} from '@sanity/icons/User'
import {schemaTypes, UNICOS} from './schemaTypes'

// Menú del panel, en el orden en que Jordi lo usará
const estructura: StructureResolver = (S) =>
  S.list()
    .title('Contenido de la web')
    .items([
      S.listItem().title('Portada').icon(HomeIcon).child(S.document().schemaType('portada').documentId('portada')),
      S.documentTypeListItem('servicio').title('Servicios').icon(BulbOutlineIcon),
      S.documentTypeListItem('caso').title('Casos de éxito').icon(StarIcon),
      S.listItem().title('Sobre AgroClima').icon(UserIcon).child(S.document().schemaType('sobre').documentId('sobre')),
      S.documentTypeListItem('articulo').title('Blog').icon(DocumentTextIcon),
      S.divider(),
      S.listItem().title('Datos de contacto').icon(CogIcon).child(S.document().schemaType('ajustes').documentId('ajustes')),
    ])

const esUnico = (tipo: string) => (UNICOS as readonly string[]).includes(tipo)

export default defineConfig({
  name: 'default',
  title: 'AgroClima Consultores',

  projectId: '3cabmdy3',
  dataset: 'production',

  plugins: [structureTool({structure: estructura}), visionTool()],

  schema: {
    types: schemaTypes,
    // Los documentos únicos no aparecen en el botón "Crear"
    templates: (plantillas) => plantillas.filter(({schemaType}) => !esUnico(schemaType)),
  },

  document: {
    // Ni duplicar ni borrar los documentos únicos
    actions: (acciones, {schemaType}) =>
      esUnico(schemaType)
        ? acciones.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : acciones,
  },
})
