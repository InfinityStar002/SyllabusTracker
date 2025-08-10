export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        console.log('SW registered', reg)
      }).catch(console.error)
    })
  }
}
