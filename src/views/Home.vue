<template>
  <div class="home">
    <a-row>
      <a-button style="margin-right: 5px;" @click="addProject" type="dashed" icon="plus">
        添加项目
      </a-button>
      <a-button style="margin-right: 5px;" @click="refreshProjects" type="dashed" icon="redo">
        刷新列表
      </a-button>
      <a-button @click="removeProjects" type="dashed" icon="delete">
        清空列表
      </a-button>
    </a-row>
    <a-row style="margin-top: 20px;">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="{ pageSize: 20 }"
        :scroll="{ y: 300 }"
        rowKey="dir"
        @change="handleTableChange"
      >
        <a slot="name" slot-scope="text, row">
          <a-popover placement="right">
            <template slot="content">
              <p>项目名称：{{ row.name }}</p>
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
        <span slot="tag" slot-scope="row">
          <template v-if="row.tag">
            <a-tag color="red" closable @close="closeTag(row)">
              {{ row.tag }}
            </a-tag>
          </template>
          <template v-else>
            <a-button size="small" @click="setTag(row)">设置标签</a-button>
          </template>
        </span>
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
                <a @click="openProjectInTerminal(row)"
                  ><a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" /> open in Terminal</a
                >
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
    <a-modal v-model="setTagShow" title="设置标签" @ok="handleSetTag">
      <a-input v-model="tag" placeholder="请输入标签，多个标签用、隔开"> </a-input>
    </a-modal>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/index.js'
import fileMixins from '@/mixins/file.js'
import ProjectModal from '@/model/project'
// @ is an alias to /src

const data = []
export default {
  name: 'Home',
  components: {},
  mixins: [fileMixins],
  data() {
    return {
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Tag',
          key: 'tag',
          scopedSlots: { customRender: 'tag' },
          filteredValue: null,
          filters: [],
          onFilter: (value, record) => (record.tag || '').indexOf(value) > -1
        },
        {
          title: '项目路径',
          dataIndex: 'dir',
          key: 'dir'
        },

        {
          title: '操作',
          key: 'action',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      data,
      setTagShow: false,
      setTagActiveKey: '',
      tag: ''
    }
  },
  created() {
    this.pm = new ProjectModal()
    this.refreshProjects()
  },
  mounted() {},
  methods: {
    fmt(ts) {
      return dateFormat('YYYY-mm-dd HH:MM', new Date(ts))
    },
    closeTag(row) {
      this.pm.setTag(row.dir, '')
      this.refreshProjects()
    },
    setTag(row) {
      this.setTagActiveKey = row.dir
      this.setTagShow = true
    },
    handleSetTag() {
      this.pm.setTag(this.setTagActiveKey, this.tag)
      this.setTagShow = false
      this.refreshProjects()
      this.tag = ''
    },
    setTagFilters(data) {
      const tags = Array.from(
        new Set(
          data
            .map(e => {
              return (e.tag && e.tag.split('、')) || []
            })
            .flat()
        )
      )
      let tag_filters = tags.map(e => {
        return { text: e, value: e }
      })
      this.columns[1].filters = tag_filters
    },
    handleTableChange(page, filters) {
      this.columns[1].filteredValue = filters.tag
    },
    refreshProjects() {
      this.columns[1].filteredValue = null
      this.getProjects()
    },
    getProjects() {
      const res = this.pm.getAll() || []
      this.setTagFilters(res)
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
          that.refreshProjects()
        },
        onCancel() {}
      })
    },
    add_project(isa) {
      const { code, msg } = this.pm.add(isa)
      if (code > 0) {
        this.refreshProjects()
        return this.$message.info(msg)
      }
      this.$message.warning(msg)
    },
    cancelDel() {},
    confirmDel(info) {
      const { code, msg } = this.pm.remove(info.dir)
      if (code > 0) {
        this.refreshProjects()
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
