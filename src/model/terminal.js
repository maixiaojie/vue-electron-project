import store from '@/plugin/storage'

const key = 'shell_type'

export default class ShellTypeModal {
    set(val) {
        store.set(key, val)
    }

    get() {
        return store.get(key) || ''
    }
}