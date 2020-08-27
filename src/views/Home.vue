<template>
  <div class="home">
    <a-row>
      <a-button @click="addProject" type="dashed" icon="plus">
        添加项目
      </a-button>
    </a-row>
    <a-row style="margin-top: 20px;">
      <a-table :columns="columns" :data-source="data">
        <a slot="name" slot-scope="text">{{ text }}</a>
        <span slot="customTitle"><a-icon type="smile-o" /> 项目名称</span>
        <span slot="action">
          <a>打开项目</a>
          <a-divider type="vertical"></a-divider>
          <a>打开项目</a>
        </span>
      </a-table>
    </a-row>
  </div>
</template>

<script>
import fileMixins from '@/mixins/file.js'
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
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    path: '/vs/saa/a'
  },
  {
    key: '2',
    name: 'Jim Green',
    path: '/vs/saa/a'
  },
  {
    key: '3',
    name: 'Joe Black',
    path: '/vs/saa/a'
  }
]
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
  methods: {
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
            const isa = await this.$ipcRenderer.callMain('is_a_nodejs_project', file_path)
            console.log(isa)
          }
        })
    }
  }
}
</script>
