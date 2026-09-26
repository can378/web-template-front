import { hasMenuPath } from '../services/menu-state.js'

export function createMenuGuard(store) {
  return async (to, from) => {
    if (!to.meta.menuRequired) return true
    const loaded = await (from?.name === 'menu-unavailable' ? store.refresh() : store.ensureLoaded())
    if (!loaded || !hasMenuPath(store.state.menus, to.path)) {
      return { name: 'menu-unavailable', query: { from: to.path } }
    }
    return true
  }
}
