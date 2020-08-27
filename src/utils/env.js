const ua = navigator.userAgent;
export const environment = ua.match(/Electron/) ? 'app' : 'broswer'
export const is_app = () => environment === 'app'