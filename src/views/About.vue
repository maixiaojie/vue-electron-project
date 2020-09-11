<template>
  <div class="about">
    <div class="tools">
      <a-dropdown :trigger="['click']" placement="bottomCenter">
        <a-button>{{ cur_shell }}</a-button>
        <a-menu slot="overlay" @click="handleShellMenuClick">
          <a-menu-item :key="sh" v-for="sh in shells">
            <a>{{ sh }}</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-select v-model="active_index" style="width: 120px">
        <a-select-option v-for="(t, i) in terminals" :key="'options' + i" :value="i">
          terminal {{ i + 1 }}
        </a-select-option>
      </a-select>
    </div>
    <div class="terminals">
      <a-tabs v-model="active_index" @change="terminalChange" :animated="false">
        <a-tab-pane :key="i" v-for="(t, i) in terminals" :tab="'Tab' + i">
          <div class="terminal-item">
            <div :id="'terminal' + i"></div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import ShellTypeModal from '@/model/terminal.js'

const os = window.require('os')
const process = window.require('process')
const pty = window.require('profoundjs-node-pty')

export default {
  data() {
    return {
      model: null,
      term: null,
      pty: null,
      fitAddon: [],
      cur_shell: '',
      shells: ['zsh', 'bash', 'dash', 'ksh', 'csh', 'tcsh', 'sh'],
      terminals: [],
      active_index: 0
    }
  },
  activated() {
    console.log('activated')
    if (this.terminals.length === 0) {
      this.add()
    } else {
      this.add()
    }
  },
  mounted() {
    this.model = new ShellTypeModal()
    // this.initTerm(0)
    window.addEventListener('resize', this.onResize)
  },
  methods: {
    handleShellMenuClick({ key }) {
      this.cur_shell = key
      this.terminals[this.active_index].terminal.write(`${key} \r\n`)
      this.model.set(key)
    },
    terminalChange() {
      this.onResize()
    },
    async add() {
      this.terminals.push({
        pty: null,
        terminal: null,
        fitAddon: null
      })
      const len = this.terminals.length
      const activeKey = len > 0 ? len - 1 : 0
      console.log(activeKey)

      this.active_index = activeKey
      await this.$nextTick(() => {
        this.initTerm(this.active_index)
      })
    },
    async initTerm(i) {
      let origin_shell_type = this.model.get()
      this.cur_shell = origin_shell_type || '选择默认shell'
      this.terminals[i].terminal = new Terminal({
        theme: {
          background: 'rgb(0,43,54)'
        }
      })
      this.terminals[i].fitAddon = new FitAddon()
      this.terminals[i].terminal.loadAddon(this.terminals[i].fitAddon)
      console.log(this.terminals)

      this.terminals[i].terminal.open(document.getElementById('terminal' + i))
      const shell = os.platform() === 'win32' ? 'powershell.exe' : origin_shell_type || this.shells[0]
      this.terminals[i].pty = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 34,
        cwd: process.cwd(),
        env: process.env
      })

      this.terminals[i].terminal.onData(data => {
        this.terminals[i].pty.write(data)
      })
      this.terminals[i].pty.on('data', data => {
        this.terminals[i].terminal.write(data)
      })
      this.onResize()
    },
    onResize() {
      try {
        this.terminals[this.active_index].fitAddon.fit()
      } catch (e) {
        console.log(e)
      }
    }
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
$bgcolor: rgb(0, 43, 54);
$vue: rgb(66, 185, 131);
$mainFontColor: rgba(255, 255, 255, 0.7);

.tools {
  background: $bgcolor;
  padding: 5px 0;
  box-shadow: inset 0px -1px 1px 0px #42b983;
  .ant-btn.ant-dropdown-trigger {
    border: 0;
    outline: none;
    border-radius: 0;
    min-width: 100px;
    color: $mainFontColor;
    background: $bgcolor;
    &[ant-click-animating-without-extra-node]:after {
      border: 0 none;
      opacity: 0;
      animation: none 0 ease 0 1 normal;
    }
    &:hover {
      color: white;
    }
  }
}
.terminals {
  background: $bgcolor;
  .terminal-item {
    padding: 20px;
    background: $bgcolor;
  }
  .ant-tabs-bar {
    display: none;
  }
}
</style>
