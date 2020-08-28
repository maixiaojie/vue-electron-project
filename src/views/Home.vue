<template>
  <div class="home">
    <a-row>
      <a-button style="margin-right: 5px;" @click="addProject" type="dashed" icon="plus">
        添加项目
      </a-button>
      <a-button style="margin-right: 5px;" @click="getProjects" type="dashed" icon="redo">
        刷新列表
      </a-button>
      <a-button @click="removeProjects" type="dashed" icon="delete">
        清空列表
      </a-button>
    </a-row>
    <a-row style="margin-top: 20px;">
      <a-table :columns="columns" :data-source="data" rowKey="dir">
        <a slot="name" slot-scope="text, row">
          <a-popover placement="right">
            <template slot="content">
              <p>项目目录：{{ row.name }}</p>
              <p>添加时间：{{ fmt(row.ts) }}</p>
              <p>
                版本：
                <a-tag color="orange">
                  {{ row.version }}
                </a-tag>
              </p>
            </template>
            {{ text }}
          </a-popover>
        </a>
        <span slot="customTitle"><a-icon type="smile-o" /> 项目名称</span>
        <span slot="action" slot-scope="row">
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()"> 打开 </a>
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a @click="openProjectInFinder(row)"><a-icon type="smile" theme="twoTone" /> open in Finder</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a @click="openProjectVSC(row)"
                  ><a-icon type="heart" theme="twoTone" two-tone-color="#eb2f96" /> open in VSCode</a
                >
              </a-menu-item>
              <a-menu-item key="2">
                <a @click="openProjectInTerminal(row)"><a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" /> open in Terminal</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm
            title="确定要从列表中删除吗"
            ok-text="确定"
            cancel-text="不删了"
            @confirm="confirmDel(row)"
            @cancel="cancelDel"
          >
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/index.js'
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
    width: 120,
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
    fmt(ts) {
      return dateFormat('YYYY-mm-dd HH:MM', new Date(ts))
    },
    getProjects() {
      const res = this.pm.getAll() || []
      console.log(res)
      this.data = res
    },
    removeProjects() {
      const that = this
      this.$confirm({
        title: '确定要清空这个列表吗?',
        content: '该操作不可逆',
        okText: '确定',
        okType: 'danger',
        cancelText: '算了',
        onOk() {
          that.pm.removeAll()
          that.getProjects()
        },
        onCancel() {}
      })
    },
    add_project(isa) {
      const { code, msg } = this.pm.add(isa)
      if (code > 0) {
        this.getProjects()
        return this.$message.info(msg)
      }
      this.$message.warning(msg)
    },
    cancelDel() {},
    confirmDel(info) {
      const { code, msg } = this.pm.remove(info.dir)
      if (code > 0) {
        this.getProjects()
        return this.$message.info(msg)
      }
      this.$message.warning(msg)
    },
    async openProjectVSC(info) {
      await this.$ipcRenderer.callMain('openInVSC', info.dir)
    },
    async openProjectInTerminal(info) {
      await this.$ipcRenderer.callMain('openInTerminal', info.dir)
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
              return this.add_project(isa)
            }
            return this.$message.warn('请选择正确的项目')
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>
