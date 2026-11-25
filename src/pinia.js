import { createPinia } from 'pinia';

const pinia = createPinia();

/**
 * Stores created since the application started, so their state can be dropped when another account signs in.
 * @type {Set<import('pinia').Store>}
 */
const activeStores = new Set();

pinia.use(({ store }) => {
  activeStores.add(store);
});

/**
 * Disposes every store except the given ones and removes their state.
 * The next use of a disposed store creates it again with its initial state.
 * @param {string[]} [keptStoreIds=[]] - Identifiers of the stores to keep.
 * @returns {void}
 */
export function disposeStores(keptStoreIds = []) {
  for (const store of activeStores) {
    if (keptStoreIds.includes(store.$id)) continue;
    store.$dispose();
    delete pinia.state.value[store.$id];
    activeStores.delete(store);
  }
}

export default pinia;
