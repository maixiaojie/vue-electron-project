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

    setTag(dir, tag) {
        let all = this.getAll()
        const index = all.findIndex(e => e.dir === dir)
        const target = all.filter(e => e.dir === dir)[0]
        target.tag = tag
        all.splice(index, 1, target)
        store.set(key, JSON.stringify(all));
    }

    has(dir) {
        let all = this.getAll();
        const target = all.filter(e => e.dir === dir)
        if (target.length > 0) {
            return true
        }
        return false
    }

    add(data) {
        let all = this.getAll()
        if (this.has(data.dir)) {
            return {
                code: -1,
                msg: '项目已经存在'
            }
        }
        all.unshift(data)
        store.set(key, JSON.stringify(all));
        return {
            code: 1,
            msg: '添加成功'
        }
    }

    remove(dir) {
        let all = this.getAll();
        const index = all.findIndex(e => e.dir === dir)
        all.splice(index, 1)
        store.set(key, JSON.stringify(all));
        return {
            code: 1,
            msg: '删除成功'
        }
    }

    removeAll() {
        const all = []
        store.set(key, JSON.stringify(all));
    }
}