import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDialog } from 'vuetify/components'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components: {
    ...components,
    VDialog
  },
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#d32f2f',
          secondary: '#b71c1c',
          accent: '#f44336',
          error: '#d32f2f',
          warning: '#ff9800',
          info: '#2196f3',
          success: '#4caf50',
        },
      },
    },
  },
})
