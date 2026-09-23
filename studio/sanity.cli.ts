import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '3cabmdy3',
    dataset: 'production',
  },
  // Dirección del panel publicado: https://agroclima-consultores.sanity.studio
  studioHost: 'agroclima-consultores',
  deployment: {
    appId: 'r5796dtc5dtxsfcnse4wkug9',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
