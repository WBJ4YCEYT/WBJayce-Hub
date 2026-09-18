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

// --- 🎧 AUDIO ENGINE LOGIC ---
function playAudioEngine() {
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerStatus.innerText = 'PLAYING';
        }).catch((err) => {
            console.log("Audio failed to auto-start:", err);
        });
    }
}

// Fixed: Only trigger autoplay on background page clicks, NOT when clicking player controls
document.addEventListener('click', (e) => {
    if (e.target.closest('#dragPlayer')) return;
    playAudioEngine();
}, { once: true });

// Fixed toggle action loop
playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (audio.paused) {
        audio.play().then(() => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerStatus.innerText = 'PLAYING';
        }).catch(err => console.log(err));
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

function onStartDrag(e) {
    if (e.target.closest('#playBtn') || e.target.closest('#progressTrack') || e.target.closest('#volumeSlider') || e.target.closest('#resizeHandle')) return;
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    startX = clientX; startY = clientY;
    startLeft = dragPlayer.offsetLeft; startTop = dragPlayer.offsetTop;
    dragPlayer.style.transition = 'none';
}

function onStartResize(e) {
    isResizing = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    startX = clientX; startY = clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(dragPlayer).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(dragPlayer).height, 10);
    dragPlayer.style.transition = 'none';
    e.preventDefault();
    e.stopPropagation();
}

function onMove(e) {
    if (!isDragging && !isResizing) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (isDragging) {
        let nx = startLeft + (clientX - startX);
        let ny = startTop + (clientY - startY);
        dragPlayer.style.left = Math.max(0, Math.min(nx, window.innerWidth - dragPlayer.clientWidth)) + 'px';
        dragPlayer.style.top = Math.max(0, Math.min(ny, window.innerHeight - dragPlayer.clientHeight)) + 'px';
        dragPlayer.style.bottom = 'auto';
    }
    if (isResizing) {
        dragPlayer.style.width = Math.max(280, startWidth + (clientX - startX)) + 'px';
        dragPlayer.style.height = Math.max(120, startHeight + (clientY - startY)) + 'px';
    }
}

function onEnd() { isDragging = false; isResizing = false; }

dragPlayer.addEventListener('mousedown', onStartDrag);
resizeHandle.addEventListener('mousedown', onStartResize);
document.addEventListener('mousemove', onMove);
document.addEventListener('mouseup', onEnd);

dragPlayer.addEventListener('touchstart', onStartDrag, { passive: true });
resizeHandle.addEventListener('touchstart', onStartResize, { passive: false });
document.addEventListener('touchmove', onMove, { passive: false });
document.addEventListener('touchend', onEnd);

// --- ✨ STARS ENGINE ---
function createStarTrail(clientX, clientY) {
    if (Math.random() > 0.15) return;
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.innerHTML = '★';
    star.style.left = clientX + 'px';
    star.style.top = clientY + 'px';
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 1000);
}

document.addEventListener('mousemove', (e) => createStarTrail(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
        createStarTrail(e.touches[0].clientX, e.touches[0].clientY);
    }
});

