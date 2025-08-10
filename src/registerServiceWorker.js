// Simple PWA service worker registration
export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(registration => {
          console.log("ServiceWorker registered: ", registration);
        })
        .catch(error => {
          console.error("ServiceWorker registration failed: ", error);
        });
    });
  }
}
