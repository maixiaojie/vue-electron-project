export default {
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        sendIsANodeProject(dir) {
            return this.$ipcRenderer.callMain('is_a_nodejs_project', dir)
        },
    }
}