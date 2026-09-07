// ==========================================================================
// MILUNA — site behaviour
// Header shrink, smooth scroll, reveal-on-scroll, gallery + lightbox,
// events list, and a handful of quiet easter eggs.
// ==========================================================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        const href = link.getAttribute('href');
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;
        const path = href.slice(0, hashIndex);
        const hash = href.slice(hashIndex);
        if (hash === '#') return;
        const samePage = path === '' || path === location.pathname.split('/').pop() || (path === '' && true);
        if (!samePage) return;

        link.addEventListener('click', (e) => {
            const target = document.querySelector(hash);
            if (!target) return;
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;
            window.scrollTo({ top, behavior: 'smooth' });

            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle?.classList.remove('active');
            }
        });
    });
}

function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (!navToggle || !navMenu) return;

    const toggle = () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', isActive);
        navToggle.setAttribute('aria-expanded', String(isActive));
    };

    navToggle.addEventListener('click', toggle);
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
        }
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function setupHeaderScroll() {
    const navbar = document.querySelector('.navbar');
    const scrollCue = document.getElementById('scrollCue');
    const heroPhoto = document.querySelector('.hero-photo img');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const y = window.pageYOffset;
            if (navbar) navbar.classList.toggle('scrolled', y > 40);
            if (scrollCue) scrollCue.classList.toggle('hidden', y > 80);
            if (heroPhoto) heroPhoto.style.transform = `translateY(${y * 0.12}px) scale(1.04)`;
            ticking = false;
        });
    });
}

function setupRevealAnimations() {
    const targets = document.querySelectorAll(
        '.about-photo, .about-copy, .world-entry, .world-photo, .diary-grid figure, .contact-title, .contact-row, .day-row, .event-row, .gal-item, .gal-spread'
    );
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => observer.observe(el));
}

// ==========================================================================
// Lightbox
// ==========================================================================

let lightbox, lightboxImage, lightboxTitle, lightboxDesc;
let currentImageIndex = 0;
let galleryImages = [];

function setupLightbox() {
    lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightboxImage = document.getElementById('lightboxImage');
    lightboxTitle = document.getElementById('lightboxTitle');
    lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const cards = document.querySelectorAll('[data-lightbox="gallery"]');
    galleryImages = Array.from(cards);

    cards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            openLightbox(card);
        });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', showPrevImage);
    lightboxNext?.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPrevImage();
        else if (e.key === 'ArrowRight') showNextImage();
    });
}

function openLightbox(card) {
    resetZoom();
    lightboxImage.src = card.dataset.img;
    lightboxTitle.textContent = card.dataset.title || '';
    lightboxDesc.textContent = card.dataset.desc || '';

    lightbox.classList.add('active');
    document.body.dataset.scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
}

function closeLightbox() {
    lightbox.classList.remove('active');
    const scrollY = document.body.dataset.scrollY || 0;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY, 10));
    resetZoom();
}

function showPrevImage() {
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(galleryImages[currentImageIndex]);
}

function showNextImage() {
    if (!galleryImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    openLightbox(galleryImages[currentImageIndex]);
}

// pinch-zoom (mobile Safari friendly)
let zoomScale = 1, zoomTX = 0, zoomTY = 0;

function resetZoom() {
    zoomScale = 1; zoomTX = 0; zoomTY = 0;
    if (lightboxImage) {
        lightboxImage.style.transform = 'scale(1) translate(0, 0)';
        lightboxImage.style.transformOrigin = 'center center';
    }
}

function setupLightboxPinchZoom() {
    const container = document.querySelector('.lightbox-image-container');
    const img = document.getElementById('lightboxImage');
    if (!container || !img) return;

    let startDistance = 0, startScale = 1, lastTap = 0;
    let panStartX = 0, panStartY = 0, startTX = 0, startTY = 0;

    const distance = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            startDistance = distance(e.touches);
            startScale = zoomScale;
        } else if (e.touches.length === 1 && zoomScale > 1) {
            panStartX = e.touches[0].clientX;
            panStartY = e.touches[0].clientY;
            startTX = zoomTX; startTY = zoomTY;
        }

        if (e.touches.length === 1) {
            const now = Date.now();
            if (now - lastTap < 300) {
                e.preventDefault();
                if (zoomScale > 1) {
                    resetZoom();
                } else {
                    const rect = img.getBoundingClientRect();
                    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
                    zoomScale = 2.5;
                    img.style.transformOrigin = `${x}% ${y}%`;
                    img.style.transform = `scale(${zoomScale})`;
                }
            }
            lastTap = now;
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const scale = (distance(e.touches) / startDistance) * startScale;
            zoomScale = Math.min(Math.max(scale, 1), 5);
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            const rect = img.getBoundingClientRect();
            const x = ((cx - rect.left) / rect.width) * 100;
            const y = ((cy - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
            img.style.transform = `scale(${zoomScale}) translate(${zoomTX}px, ${zoomTY}px)`;
        } else if (e.touches.length === 1 && zoomScale > 1) {
            e.preventDefault();
            const dx = e.touches[0].clientX - panStartX;
            const dy = e.touches[0].clientY - panStartY;
            zoomTX = startTX + dx / zoomScale;
            zoomTY = startTY + dy / zoomScale;
            img.style.transform = `scale(${zoomScale}) translate(${zoomTX}px, ${zoomTY}px)`;
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        if (zoomScale <= 1) resetZoom();
    });
}

// ==========================================================================
// Gallery filter (works across grid blocks and spread plates)
// ==========================================================================

function setupGalleryFilter() {
    const buttons = document.querySelectorAll('.gal-filter button');
    if (!buttons.length) return;
    const items = document.querySelectorAll('.gal-item[data-category], .gal-spread[data-category]');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            items.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('is-hidden', !match);
            });

            const visibleCards = document.querySelectorAll(
                '.gal-item:not(.is-hidden) [data-lightbox="gallery"], .gal-spread:not(.is-hidden) [data-lightbox="gallery"]'
            );
            galleryImages = Array.from(visibleCards);
        });
    });
}

// ==========================================================================
// Events
// ==========================================================================

const EVENT_TYPE_LABELS = { fursuit: 'フルスーツ', online: 'オンライン', music: '音楽', other: 'その他' };

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderEventRows(events) {
    const list = document.getElementById('eventsList');
    if (!list) return;

    if (events.length === 0) {
        list.innerHTML = `<div class="events-empty">該当するイベントがありません。</div>`;
        return;
    }

    list.innerHTML = events.map(ev => {
        const photoHtml = ev.photo
            ? `<div class="event-photo"><img src="${ev.photo}" alt="${ev.name}" loading="lazy"></div>`
            : `<div class="event-photo empty">NO PHOTO</div>`;
        const typeLabel = EVENT_TYPE_LABELS[ev.type] || ev.type;
        const commentHtml = ev.comment ? `<p class="event-comment">${ev.comment}</p>` : '';

        return `
            <div class="event-row reveal" data-type="${ev.type}">
                ${photoHtml}
                <div>
                    <div class="event-name">${ev.name}</div>
                    <div class="event-meta">
                        ${ev.date ? `<span>${formatDate(ev.date)}</span>` : ''}
                        ${ev.location ? `<span>${ev.location}</span>` : ''}
                    </div>
                    ${commentHtml}
                </div>
                <div class="event-type">${typeLabel}</div>
            </div>`;
    }).join('');

    setupRevealAnimations();
}

async function setupEvents() {
    const list = document.getElementById('eventsList');
    if (!list) return;

    const fallbackEvents = [
        { id: 1, name: "ケモコン2025", date: "2025-11-23", location: "静岡県・時之栖", type: "fursuit", comment: "たくさんのケモノ仲間と再会。ステージも最高でした。", photo: "" },
        { id: 2, name: "ケモノデイズ", date: "2025-09-14", location: "大阪", type: "fursuit", comment: "関西のケモ勢と初めて交流。最高の一日でした。", photo: "img/バイオ前線/IMG_0239.webp" },
        { id: 3, name: "ホテル時之栖 イルミネーション", date: "2025-12-20", location: "静岡県・時之栖", type: "other", comment: "幻想的なイルミネーションの中で撮影。夜景が綺麗すぎた。", photo: "img/シイヴ/LINE_ALBUM_ミルちゃんphotos_260221_1.webp" },
        { id: 5, name: "海辺フォトウォーク", date: "2026-02-21", location: "湘南海岸", type: "other", comment: "青空と海をバックに思う存分撮影。yoshiさんありがとう。", photo: "img/yoshi/LINE_ALBUM_yoshl撮影分②_260221_8.webp" },
        { id: 6, name: "カフェ撮影会", date: "2025-10-05", location: "東京・表参道", type: "other", comment: "おしゃれなカフェでリラックスショット。またやりたい。", photo: "img/たちつてお/73A00047_Original.webp" }
    ];

    let allEvents;
    try {
        const res = await fetch('data/events.json');
        if (!res.ok) throw new Error('fetch failed');
        allEvents = await res.json();
    } catch {
        allEvents = fallbackEvents;
    }

    allEvents.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    renderEventRows(allEvents);

    document.querySelectorAll('.events-filter button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.events-filter button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            renderEventRows(filter === 'all' ? allEvents : allEvents.filter(ev => ev.type === filter));
        });
    });
}

// ==========================================================================
// Easter eggs — quiet, discoverable only.
// 1) sustained cursor movement -> a couple of faint paw prints
// 2) clicking the logo five times -> Miluna walks across the footer once
// 3) double-click -> a small constellation, fading after a few seconds
// 4) typing "miluna" -> a quiet secret message
// ==========================================================================

function setupPawPrintEasterEgg() {
    let moveStart = null;
    let spent = false;

    document.addEventListener('mousemove', (e) => {
        if (!moveStart) moveStart = Date.now();
        if (spent) return;
        if (Date.now() - moveStart > 2600) {
            spent = true;
            const positions = [
                { x: e.clientX - 26, y: e.clientY + 14 },
                { x: e.clientX - 4, y: e.clientY + 34 }
            ];
            positions.forEach((p, i) => {
                setTimeout(() => {
                    const paw = document.createElement('span');
                    paw.className = 'egg-paw';
                    paw.textContent = '🐾';
                    paw.style.left = `${p.x}px`;
                    paw.style.top = `${p.y}px`;
                    paw.style.setProperty('--r', `${(Math.random() * 30 - 15).toFixed(1)}deg`);
                    document.body.appendChild(paw);
                    setTimeout(() => paw.remove(), 2200);
                }, i * 260);
            });
            setTimeout(() => { spent = false; moveStart = null; }, 30000);
        }
    });

    document.addEventListener('mouseleave', () => { moveStart = null; });
}

function setupLogoWalkEasterEgg() {
    const logo = document.querySelector('.nav-logo a');
    if (!logo) return;
    let clicks = 0;
    let timer = null;

    logo.addEventListener('click', (e) => {
        clicks += 1;
        clearTimeout(timer);
        timer = setTimeout(() => { clicks = 0; }, 1600);

        if (clicks >= 5) {
            clicks = 0;
            e.preventDefault();
            const cat = document.createElement('span');
            cat.className = 'egg-walker';
            cat.textContent = '🐈‍⬛';
            document.body.appendChild(cat);
            setTimeout(() => cat.remove(), 6600);
        }
    });
}

function setupConstellationEasterEgg() {
    const canvas = document.createElement('canvas');
    canvas.className = 'egg-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let points = [];
    let clearTimer = null;

    document.addEventListener('dblclick', (e) => {
        points.push({ x: e.clientX, y: e.clientY });

        ctx.fillStyle = '#7CB7D8';
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 2.4, 0, Math.PI * 2);
        ctx.fill();

        if (points.length > 1) {
            const prev = points[points.length - 2];
            ctx.strokeStyle = 'rgba(124, 183, 216, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        }

        clearTimeout(clearTimer);
        clearTimer = setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            points = [];
        }, 4000);
    });
}

function showEggMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'egg-msg';
    msg.textContent = text;
    document.body.appendChild(msg);
    requestAnimationFrame(() => msg.classList.add('is-visible'));
    setTimeout(() => {
        msg.classList.remove('is-visible');
        setTimeout(() => msg.remove(), 600);
    }, 2600);
}

function setupSecretCommand() {
    let typed = '';
    document.addEventListener('keydown', (e) => {
        if (e.key.length !== 1) return;
        typed = (typed + e.key.toLowerCase()).slice(-6);
        if (typed === 'miluna') {
            showEggMessage('✨ you found miluna, somewhere beyond.');
            typed = '';
        }
    });
}

// ==========================================================================
// Init
// ==========================================================================

function init() {
    setupHeaderScroll();
    setupSmoothScroll();
    setupMobileMenu();
    setupRevealAnimations();
    setupLightbox();
    setupLightboxPinchZoom();
    setupGalleryFilter();
    setupEvents();

    setupPawPrintEasterEgg();
    setupLogoWalkEasterEgg();
    setupConstellationEasterEgg();
    setupSecretCommand();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
