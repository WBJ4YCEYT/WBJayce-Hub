```javascript
const audio = document.getElementById('bgMusic');
const dragPlayer = document.getElementById('dragPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.getElementById('progressBar');
const progressTrack = document.getElementById('progressTrack');
const playerStatus = document.getElementById('playerStatus');
const volumeSlider = document.getElementById('volumeSlider');
const resizeHandle = document.getElementById('resizeHandle');

// --- 🎧 AUDIO MANAGEMENT ---
function playAudioEngine() {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerStatus.innerText = 'PLAYING';
        }).catch(() => {});
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#dragPlayer') || e.target.closest('.card') || e.target.closest('.socials-sidebar')) return;
    playAudioEngine();
}, { once: true });

playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerStatus.innerText = 'PLAYING';
        }).catch(() => {});
    } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playerStatus.innerText = 'PAUSED';
    }
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    }
});

progressTrack.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.duration) {
        audio.currentTime = (e.offsetX / progressTrack.clientWidth) * audio.duration;
    }
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// --- 🖐️ DRAG & RESIZE ENGINE ---
let isDragging = false, isResizing = false;
let startX, startY, startWidth, startHeight, startLeft, startTop;

dragPlayer.addEventListener('mousedown', (e) => {
    if (e.target.closest('#playBtn') || e.target.closest('#progressTrack') || e.target.closest('#volumeSlider') || e.target.closest('#resizeHandle')) return;
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    startLeft = dragPlayer.offsetLeft; startTop = dragPlayer.offsetTop;
    dragPlayer.style.transition = 'none';
});

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX; startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(dragPlayer).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(dragPlayer).height, 10);
    dragPlayer.style.transition = 'none';
    e.preventDefault(); e.stopPropagation();
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        let nx = startLeft + (e.clientX - startX);
        let ny = startTop + (e.clientY - startY);
        dragPlayer.style.left = Math.max(0, Math.min(nx, window.innerWidth - dragPlayer.clientWidth)) + 'px';
        dragPlayer.style.top = Math.max(0, Math.min(ny, window.innerHeight - dragPlayer.clientHeight)) + 'px';
        dragPlayer.style.bottom = 'auto';
    }
    if (isResizing) {
        dragPlayer.style.width = Math.max(300, startWidth + (e.clientX - startX)) + 'px';
        dragPlayer.style.height = Math.max(120, startHeight + (e.clientY - startY)) + 'px';
    }
});

document.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });

// VR CONTROLLER AND TOUCH EVENT HANDLERS
dragPlayer.addEventListener('touchstart', (e) => {
    if (e.target.closest('#playBtn') || e.target.closest('#progressTrack') || e.target.closest('#volumeSlider') || e.target.closest('#resizeHandle')) return;
    isDragging = true;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    startLeft = dragPlayer.offsetLeft; startTop = dragPlayer.offsetTop;
    dragPlayer.style.transition = 'none';
}, { passive: true });

resizeHandle.addEventListener('touchstart', (e) => {
    isResizing = true;
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(dragPlayer).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(dragPlayer).height, 10);
    dragPlayer.style.transition = 'none';
    e.stopPropagation();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging && !isResizing) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    if (isDragging) {
        let nx = startLeft + (clientX - startX);
        let ny = startTop + (clientY - startY);
        dragPlayer.style.left = Math.max(0, Math.min(nx, window.innerWidth - dragPlayer.clientWidth)) + 'px';
        dragPlayer.style.top = Math.max(0, Math.min(ny, window.innerHeight - dragPlayer.clientHeight)) + 'px';
        dragPlayer.style.bottom = 'auto';
    }
    if (isResizing) {
        dragPlayer.style.width = Math.max(300, startWidth + (clientX - startX)) + 'px';
        dragPlayer.style.height = Math.max(120, startHeight + (clientY - startY)) + 'px';
    }
}, { passive: false });

document.addEventListener('touchend', () => { isDragging = false; isResizing = false; });

// --- ✨ STARS TRAIL TRAFFIC ---
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.15) return;
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.innerHTML = '★';
    star.style.left = e.clientX + 'px';
    star.style.top = e.clientY + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
});

document.addEventListener('touchmove', (e) => {
    if (Math.random() > 0.15) return;
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.innerHTML = '★';
    star.style.left = e.touches[0].clientX + 'px';
    star.style.top = e.touches[0].clientY + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
});
