const button = document.querySelector('#install');
const status = document.querySelector('#install-status');
let promptEvent;

if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
  status.textContent = 'ホーム画面からアプリ表示で開いています。';
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  promptEvent = event;
  button.hidden = false;
});

button.addEventListener('click', async () => {
  const event = promptEvent;
  if (!event) return;
  promptEvent = undefined;
  button.hidden = true;
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === 'accepted') status.textContent = 'ホーム画面から Mellow Nail を開けます。';
  } catch {
    status.textContent = 'ブラウザのメニューから追加をお試しください。';
  }
});

window.addEventListener('appinstalled', () => {
  button.hidden = true;
  status.textContent = 'ホーム画面から Mellow Nail を開けます。';
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa-demo/sw.js', { scope: '/pwa-demo/' }).catch(() => {
    status.textContent = 'この環境ではブラウザのメニューから追加をお試しください。';
  });
}

