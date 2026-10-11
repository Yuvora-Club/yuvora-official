import { defineConfig } from 'vite'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const r = (...parts) => resolve(root, ...parts)

// Multi-page setup: every HTML file below becomes its own route.
// Clean URLs come from `directory/index.html` files, e.g. `events/index.html` -> `/events/`.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: r('index.html'),
        hubs: r('hubs/index.html'),
        'hub-tech': r('hubs/tech/index.html'),
        'hub-sporting': r('hubs/sporting/index.html'),
        'hub-esports': r('hubs/esports/index.html'),
        'hub-future': r('hubs/future/index.html'),
        events: r('events/index.html'),
        projects: r('projects/index.html'),
        workshops: r('workshops/index.html'),
        team: r('team/index.html'),
        collaborate: r('collaborate/index.html'),
        notfound: r('404.html')
      }
    }
  }
})
