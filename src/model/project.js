import store from '@/plugin/storage'

const key = 'project_list'

export default class ProjectModal {
    getAll() {
        let res = store.get(key)
        res = JSON.parse(res)
        return Array.isArray(res) ? res : []
    }

    add(data) {
        let all = this.getAll()
        all.push(data)
        store.set(key, JSON.stringify(all));
    }
}