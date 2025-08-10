// lightweight registration; keep in src so it's built/transpiled
export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registered", reg.scope))
        .catch((err) => console.warn("SW registration failed", err));
    });
  }
}
