<template>
  <div class="home">
    <a-row>
      <a-button style="margin-right: 5px;" @click="addProject" type="dashed" icon="plus">
        添加项目
      </a-button>
      <a-button @click="getProjects" type="dashed" icon="redo">
        刷新列表
      </a-button>
    </a-row>
    <a-row style="margin-top: 20px;">
      <a-table :columns="columns" :data-source="data" rowKey="dir">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> 项目名称</span>
        <span slot="action" slot-scope="row">
          <a @click="openProjectInFinder(row)">在finder中打开</a>
          <a-divider type="vertical"></a-divider>
          <a @click="openProjectVSC(row)">在vscode中打开</a>
          <a-divider type="vertical"></a-divider>
          <!-- <a>打开项目</a> -->
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import fileMixins from '@/mixins/file.js'
import ProjectModal from '@/model/project'
// @ is an alias to /src
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '路径',
    dataIndex: 'dir',
    key: 'dir'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = []
export default {
  name: 'Home',
  components: {},
  mixins: [fileMixins],
  data() {
    return {
      columns,
      data
    }
  },
  mounted() {
    this.pm = new ProjectModal()
    this.getProjects()
  },
  methods: {
    getProjects() {
      const res = this.pm.getAll() || []
      this.data = res
    },
    async openProjectVSC(info) {
      await this.$ipcRenderer.callMain('openInVSC', info.dir)
    },
    openProjectInFinder(info) {
      this.$electron.shell.openPath(info.dir)
    },
    addProject() {
      this.$remote.dialog
        .showOpenDialog({
          properties: ['openDirectory']
        })
        .then(async res => {
          if (res.canceled) {
            this.$message.info('已取消')
          } else {
            const file_path = res.filePaths[0]
            let isa = await this.$ipcRenderer.callMain('is_a_nodejs_project', file_path)
            if (isa) {
              this.pm.add(isa)
              this.getProjects()
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
