import { ipcMain } from 'electron-better-ipc'

const fs = require('fs')
const jsonfile = require('jsonfile')

const get_pkg_info = (dir) => {
    const file_name = 'package.json';
    const file_path = `${dir}/${file_name}`
    if (fs.existsSync(file_path)) {
        const pkg = jsonfile.readFileSync(file_path)
        return {
            dir,
            path: file_path,
            name: pkg.name || '',
            version: pkg.version || 0,
            ts: new Date().getTime()
        }
    }
    return false
}
const is_a_nodejs_project = (dir) => {
    if (fs.existsSync(dir)) {
        return get_pkg_info(dir)
    }
    return false
}
const listen_start = () => {
    ipcMain.answerRenderer('is_a_nodejs_project', arg => {
        return new Promise((resolve) => {
            resolve(is_a_nodejs_project(arg))
        })
    })
}

export default listen_start