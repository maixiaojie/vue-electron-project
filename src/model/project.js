import store from '@/plugin/storage'

const key = 'project'

export default class ProjectModal {
    getAll() {
        let res = store.get(key)
        try {
            res = JSON.parse(res)
        } catch (e) {
            res = []
        }

        return Array.isArray(res) ? res : []
    }

    add(data) {
        let all = this.getAll()
        all.push(data)
        store.set(key, JSON.stringify(all));
    }
}