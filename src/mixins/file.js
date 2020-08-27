export default {
    data() {
        return {
            is_a_node_project: false
        }
    },
    created() {
        this.onIsANodeProject()
    },
    methods: {
        sendIsANodeProject(dir) {
            return this.$ipcRenderer.callMain('is_a_nodejs_project', dir)
        },
        onIsANodeProject() {
            this.$ipcRenderer.answerMain('is_a_nodejs_project', (event, arg) => {
                console.log(arg)
                this.is_a_node_project = arg
            })
        }
    }
}