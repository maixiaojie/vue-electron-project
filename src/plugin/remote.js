import { is_app } from '@/utils/env.js'

export const getRemote = () => {
    try {
        return is_app ? window.require('electron').remote : {}
    } catch (e) {
        console.log(e)
    }
}
export const getElectron = () => {
    try {
        return is_app ? window.require('electron') : {}
    } catch (e) {
        console.log(e)
    }
}
export const getIpcRenderer = () => {
    try {
        return window.require('electron-better-ipc').ipcRenderer;
        // return is_app ? window.require('electron').ipcRenderer : {}
    } catch (e) {
        console.log(e)
    }
}