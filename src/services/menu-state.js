import { reactive } from 'vue'
import { getMenus } from './menu.js'

export function hasMenuPath(menus, path) {
  return menus.some(menu => menu.path === path || hasMenuPath(menu.children ?? [], path))
}

export function createMenuState(loader = getMenus) {
  const state = reactive({ menus: [], loading: false, loaded: false, error: '' })
  let revision = 0
  let pendingLoad = null
  async function load() {
    const current = ++revision
    state.loaded = false
    state.menus = []
    state.loading = true
    state.error = ''
    try {
      const menus = await loader()
      if (current === revision) {
        state.menus = menus
        state.loaded = true
      }
    } catch (error) {
      if (current === revision) state.error = error.message
    } finally {
      if (current === revision) state.loading = false
    }
    return current === revision && !state.error
  }
  function refresh() {
    pendingLoad = load()
    return pendingLoad
  }
  function ensureLoaded() {
    if (state.loaded) return Promise.resolve(true)
    if (state.loading) return pendingLoad
    return refresh()
  }
  return { state, refresh, ensureLoaded }
}

export const menuState = createMenuState()
