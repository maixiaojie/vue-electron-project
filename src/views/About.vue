<template>
  <div class="about">
    <div class="tools">
      <a-dropdown placement="bottomCenter">
        <a-button>选择shell</a-button>
        <a-menu slot="overlay">
          <a-menu-item :key="sh" v-for="sh in shells">
            <a>{{sh}}</a>
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
      shells: ['zsh', 'bash', 'dash', 'ksh', 'csh', 'tcsh', 'sh']
    }
  },
  mounted() {
    this.initTerm()
    window.addEventListener('resize', this.onResize)
  },
  methods: {
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
#terminal {
  // width: 100%;
  padding: 20px;
  background: rgb(0, 43, 54);
}
</style>
