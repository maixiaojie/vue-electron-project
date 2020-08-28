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
    </div>
    <div id="terminal"></div>
  </div>
</template>
<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const os = window.require('os')
const process = window.require('process')
const pty = window.require('profoundjs-node-pty')

export default {
  data() {
    return {
      term: null,
      pty: null,
      fitAddon: null,
      cur_shell: '选择默认shell',
      shells: ['zsh', 'bash', 'dash', 'ksh', 'csh', 'tcsh', 'sh']
    }
  },
  mounted() {
    this.initTerm()
    window.addEventListener('resize', this.onResize)
  },
  methods: {
    handleShellMenuClick({ key }) {
      this.cur_shell = key
      this.pty.write(`${key} \r`)
    },
    initTerm() {
      this.term = new Terminal({
        theme: {
          background: 'rgb(0,43,54)'
        }
      })
      this.fitAddon = new FitAddon()
      this.term.loadAddon(this.fitAddon)
      this.term.open(document.getElementById('terminal'))
      const shell = os.platform() === 'win32' ? 'powershell.exe' : this.shells[0]
      this.pty = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 34,
        cwd: process.cwd(),
        env: process.env
      })

      this.term.onData(data => {
        this.pty.write(data)
      })
      this.pty.on('data', data => {
        this.term.write(data)
      })
    },
    onResize() {
      try {
        this.fitAddon.fit()
      } catch (e) {
        console.log(e)
      }
    }
  },
  beforeDestroy() {
    console.log(1)
  }
}
</script>
<style lang="scss">
$bgcolor: rgb(0, 43, 54);
$vue: rgb(66, 185, 131);
$mainFontColor: rgba(255, 255, 255, 0.7);
#terminal {
  // width: 100%;
  padding: 20px;
  background: $bgcolor;
}
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
</style>
