import html2canvas from 'html2canvas-pro';

document.addEventListener('DOMContentLoaded', () => {  
    const hiddenCard = document.getElementById('profile-card-hidden');
    const imgEl = document.getElementById('profile-card-img');
    const username = imgEl.dataset.username;
    const storageKey = `profile-card-${username}`;
    const lastUpdated = imgEl.dataset.lastUpdated;
    const skeletonEl = document.getElementById('profile-card-skeleton');
    const shareButtonsEl = document.getElementById('profile-card-share-buttons');

    const cachedData = localStorage.getItem(storageKey);
    if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (parsed.lastUpdated === lastUpdated) {
            imgEl.src = parsed.dataURL;
            setupDownloads(parsed.dataURL);
            return;
        }
    }

    function loadImages(element) {
        const images = element.querySelectorAll('img');
        return Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            });
        }));
    };

    function setupDownloads(dataURL) {
        imgEl.src = dataURL;
        imgEl.classList.remove('hidden');
        shareButtonsEl.classList.remove('hidden');
        skeletonEl.classList.add('hidden');

        document.getElementById('download-1200x400').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'profile-card-1200x400.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        document.getElementById('download-600x200').addEventListener('click', () => {
            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = 600;
            smallCanvas.height = 200;
            const ctx = smallCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 600, 200);
            const link = document.createElement('a');
            link.download = 'profile-card-600x200.png';
            link.href = smallCanvas.toDataURL('image/png');
            link.click();
        });
    }

    hiddenCard.style.position = 'absolute';
    hiddenCard.style.left = '-9999px';
    hiddenCard.style.top = '-9999px';
    hiddenCard.classList.remove('hidden');

    loadImages(hiddenCard).then(() => {
        html2canvas(hiddenCard, {
            scale: 1,
            width: 1200,
            height: 400,
            useCORS: true,
            allowTaint: true,
            logging: true
        }).then(canvas => {
            const dataURL = canvas.toDataURL('image/png');
            setupDownloads(dataURL);
            localStorage.setItem(storageKey, JSON.stringify({ dataURL, lastUpdated }));
        }).catch(error => {
            console.error('html2canvas error:', error);
            skeletonEl.innerHTML = '<p class="text-error text-center">Error loading card</p>';
            shareButtonsEl.classList.add('hidden');
        }).finally(() => {
            hiddenCard.classList.add('hidden');
            hiddenCard.style.position = '';
            hiddenCard.style.left = '';
            hiddenCard.style.top = '';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('input[name="profile_tabs"]');
    const storageKey = 'profileLastTab';

    const lastTab = localStorage.getItem(storageKey);
    if (lastTab) {
        const matchingTab = Array.from(tabs).find(tab => tab.value === lastTab);
        if (matchingTab) matchingTab.checked = true;
    }

    tabs.forEach(tab => {
        tab.addEventListener('change', () => {
            localStorage.setItem(storageKey, tab.value);
        });
    });
});