// ==========================================
// 星空背景の生成
// ==========================================
function createStars() {
    const starsContainer = document.getElementById('starsBackground');
    const numberOfStars = 200;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // ランダムな位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // ランダムなサイズ（1-3px）
        const size = Math.random() * 2 + 1;

        // ランダムなアニメーション遅延
        const delay = Math.random() * 3;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }
}

// ==========================================
// ナビゲーションバーのスクロール効果
// ==========================================
// (統合スクロールハンドラに移動)

// ==========================================
// スムーススクロール
// ==========================================
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // モバイルメニューを閉じる
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

// ==========================================
// モバイルメニューのトグル
// ==========================================
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // メニュー外をクリックしたら閉じる
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ==========================================
// スクロールアニメーション（Intersection Observer）
// ==========================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // ギャラリーアイテムを監視
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // ストーリーカードを監視
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // 特徴カードを監視
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// ==========================================
// パララックス効果
// ==========================================
// (統合スクロールハンドラに移動)

// ==========================================
// マウスフォロー効果（猫の足跡）
// ==========================================
function setupMouseEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorCircle = null;
    let pawPrintTimer = null;

    // カーソル用のカスタム要素を作成
    const createCursorCircle = () => {
        cursorCircle = document.createElement('div');
        cursorCircle.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(155, 89, 182, 0.6), transparent);
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(cursorCircle);
    };

    // 猫の足跡を生成
    const createPawPrint = (x, y) => {
        const pawPrint = document.createElement('div');
        pawPrint.innerHTML = '🐾';
        pawPrint.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 20px;
            pointer-events: none;
            z-index: 9998;
            animation: pawPrintFade 2s ease-out forwards;
            transform: rotate(${Math.random() * 40 - 20}deg);
        `;
        document.body.appendChild(pawPrint);

        setTimeout(() => pawPrint.remove(), 2000);
    };

    // CSSアニメーション追加

    // マウス移動時
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorCircle) {
            cursorCircle.style.left = `${mouseX - 10}px`;
            cursorCircle.style.top = `${mouseY - 10}px`;
            cursorCircle.style.display = 'block';
        }

        // 足跡を残す（一定間隔で）
        if (!pawPrintTimer) {
            pawPrintTimer = setTimeout(() => {
                if (Math.random() > 0.7) {
                    createPawPrint(mouseX, mouseY);
                }
                pawPrintTimer = null;
            }, 200);
        }
    });

    // ホバー可能な要素にエフェクトを追加
    const hoverElements = document.querySelectorAll('a, button, .gallery-card, .story-card, .feature-card');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (cursorCircle) {
                cursorCircle.style.transform = 'scale(2)';
                cursorCircle.style.background = 'radial-gradient(circle, rgba(52, 152, 219, 0.6), transparent)';
            }
        });

        element.addEventListener('mouseleave', () => {
            if (cursorCircle) {
                cursorCircle.style.transform = 'scale(1)';
                cursorCircle.style.background = 'radial-gradient(circle, rgba(155, 89, 182, 0.6), transparent)';
            }
        });
    });

    // デスクトップのみ有効
    if (window.innerWidth > 768) {
        createCursorCircle();
    }
}

// ==========================================
// 流れ星エフェクト
// ==========================================
function createShootingStar() {
    const starsContainer = document.getElementById('starsBackground');
    const shootingStar = document.createElement('div');

    shootingStar.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
        animation: shooting 1.5s linear;
    `;

    // ランダムな開始位置
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;

    shootingStar.style.left = `${startX}%`;
    shootingStar.style.top = `${startY}%`;

    starsContainer.appendChild(shootingStar);

    // アニメーション終了後に要素を削除
    setTimeout(() => {
        shootingStar.remove();
    }, 1500);
}

// ランダムな間隔で流れ星を生成
function startShootingStars() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30%の確率で流れ星
            createShootingStar();
        }
    }, 3000);
}

// ==========================================
// ページ読み込みアニメーション
// ==========================================
function setupPageLoadAnimation() {
    // ページが完全に読み込まれたら実行
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// ==========================================
// スクロールプログレスバー
// ==========================================
// (統合スクロールハンドラに移動)
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #9b59b6, #3498db);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
}

// ==========================================
// アクティブセクションのハイライト
// ==========================================
// (統合スクロールハンドラに移動)

// ==========================================
// 浮遊する音符エフェクト（createDancingNotesに統合済み）
// ==========================================

// ==========================================
// インタラクティブな星座描画
// ==========================================
function setupConstellationDrawing() {
    let constellationPoints = [];
    let canvas = null;
    let ctx = null;

    // キャンバスを作成
    const createCanvas = () => {
        canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
    };

    createCanvas();

    // ダブルクリックで星座のポイントを追加
    document.addEventListener('dblclick', (e) => {
        const point = { x: e.clientX, y: e.clientY };
        constellationPoints.push(point);

        // 星を描画
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // グロー効果
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffd700';
        ctx.fill();
        ctx.shadowBlur = 0;

        // 前のポイントと線で結ぶ
        if (constellationPoints.length > 1) {
            const prevPoint = constellationPoints[constellationPoints.length - 2];
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }

        // キラキラエフェクト
        createSparkle(point.x, point.y);

        // 5つ以上のポイントでリセット
        if (constellationPoints.length >= 5) {
            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                constellationPoints = [];
            }, 3000);
        }
    });

    // リサイズ対応
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// キラキラエフェクト
function createSparkle(x, y) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 15px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleExplosion 0.8s ease-out forwards;
        `;
        sparkle.style.setProperty('--angle', `${i * 45}deg`);
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 800);
    }
}

// ==========================================
// アニメーションミルナキャラクター
// ==========================================
function createAnimatedMiluna() {
    const miluna = document.createElement('div');
    miluna.innerHTML = '🐱';
    miluna.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: -60px;
        font-size: 50px;
        z-index: 10000;
        cursor: pointer;
        transition: transform 0.3s ease;
        animation: milunaWalk 20s linear infinite;
    `;

    // クリックイベント
    miluna.addEventListener('click', () => {
        miluna.style.transform = 'scale(1.3) rotate(360deg)';
        createHearts(miluna);
        setTimeout(() => {
            miluna.style.transform = 'scale(1)';
        }, 300);
    });

    document.body.appendChild(miluna);
}

// ハートエフェクト
function createHearts(element) {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💜';
            const rect = element.getBoundingClientRect();
            heart.style.cssText = `
                position: fixed;
                left: ${rect.left + 25}px;
                top: ${rect.top}px;
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                animation: heartFloat 1.5s ease-out forwards;
            `;
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 1500);
        }, i * 100);
    }
}

// ==========================================
// イースターエッグ: 秘密のコマンド
// ==========================================
function setupEasterEggs() {
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activatePartyMode();
            konamiCode = [];
        }
    });

    // "miluna"と入力でイースターエッグ
    let typedText = '';
    document.addEventListener('keypress', (e) => {
        typedText += e.key;
        typedText = typedText.slice(-6);

        if (typedText === 'miluna') {
            createRainbowEffect();
            typedText = '';
        }
    });
}

// パーティーモード
function activatePartyMode() {
    const message = document.createElement('div');
    message.textContent = '🎉 PARTY MODE ACTIVATED! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
        z-index: 10001;
        animation: partyPulse 0.5s ease-in-out 6;
        pointer-events: none;
    `;
    document.body.appendChild(message);

    // カラフルな紙吹雪
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 50);
    }

    setTimeout(() => message.remove(), 3000);
}

// 紙吹雪
function createConfetti() {
    const confetti = document.createElement('div');
    const colors = ['#9b59b6', '#3498db', '#e74c3c', '#f39c12', '#2ecc71'];
    confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${Math.random() * 100}%;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        z-index: 10000;
        animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
}

// 虹エフェクト
function createRainbowEffect() {
    const rainbow = document.createElement('div');
    rainbow.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, 
            rgba(255, 0, 0, 0.3),
            rgba(255, 127, 0, 0.3),
            rgba(255, 255, 0, 0.3),
            rgba(0, 255, 0, 0.3),
            rgba(0, 0, 255, 0.3),
            rgba(75, 0, 130, 0.3),
            rgba(148, 0, 211, 0.3)
        );
        pointer-events: none;
        z-index: 10001;
        animation: rainbowPulse 2s ease-in-out;
    `;
    document.body.appendChild(rainbow);

    setTimeout(() => rainbow.remove(), 2000);
}

// ==========================================
// 画像エラーハンドリング
// ==========================================
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            // フォールバック: 猫の絵文字プレースホルダー
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(155, 89, 182, 0.3), rgba(52, 152, 219, 0.3));
                font-size: 5rem;
            `;
            placeholder.textContent = '🐱';

            this.parentElement.style.position = 'relative';
            this.style.display = 'none';
            this.parentElement.appendChild(placeholder);
        });
    });
}

// ==========================================
// ヘルプモーダル
// ==========================================
function setupHelpModal() {
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const helpClose = document.getElementById('helpClose');

    if (helpButton && helpModal && helpClose) {
        helpButton.addEventListener('click', () => {
            helpModal.classList.add('active');
        });

        helpClose.addEventListener('click', () => {
            helpModal.classList.remove('active');
        });

        // モーダル外をクリックで閉じる
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.remove('active');
            }
        });

        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (helpModal.classList.contains('active')) {
                    helpModal.classList.remove('active');
                }
                if (lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            }
        });
    }
}

// ==========================================
// ライトボックス（ギャラリー拡大表示）
// ==========================================
let lightbox;
let lightboxImage;
let lightboxTitle;
let lightboxDesc;
let currentImageIndex = 0;
let galleryImages = [];

function setupLightbox() {
    lightbox = document.getElementById('lightbox');
    lightboxImage = document.getElementById('lightboxImage');
    lightboxTitle = document.getElementById('lightboxTitle');
    lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // ギャラリーカードを収集
    const galleryCards = document.querySelectorAll('.gallery-card[data-lightbox]');
    galleryImages = Array.from(galleryCards);

    // 各ギャラリーカードにクリックイベント
    galleryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(card);
        });
    });

    // 閉じるボタン
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // 前へボタン
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    // 次へボタン
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // 背景クリックで閉じる
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // キーボード操作
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
}

function openLightbox(card) {
    const imgSrc = card.dataset.img;
    const title = card.dataset.title;
    const desc = card.dataset.desc;

    lightboxImage.src = imgSrc;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(galleryImages[currentImageIndex]);
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    openLightbox(galleryImages[currentImageIndex]);
}

// ==========================================
// ギャラリーフィルター
// ==========================================
function setupGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブボタン切り替え
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // フェードアウト
            galleryItems.forEach(item => {
                item.classList.add('fade-out');
            });

            // フェードアウト後に表示/非表示を切り替え
            setTimeout(() => {
                galleryItems.forEach(item => {
                    const category = item.dataset.category;
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden', 'fade-out');
                        // フェードイン
                        requestAnimationFrame(() => {
                            item.classList.add('fade-in');
                        });
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('fade-out', 'fade-in');
                    }
                });

                // ライトボックスの画像リストを更新
                const visibleCards = document.querySelectorAll('.gallery-item:not(.hidden) .gallery-card[data-lightbox]');
                galleryImages = Array.from(visibleCards);
            }, 300);
        });
    });
}

// ==========================================
// 音楽に合わせて踊る音符（強化版）
// ==========================================
function createDancingNotes() {
    const notes = ['♪', '♫', '♬', '♩', '🎵', '🎶'];

    setInterval(() => {
        if (Math.random() > 0.5) {
            const note = document.createElement('div');
            const selectedNote = notes[Math.floor(Math.random() * notes.length)];
            note.textContent = selectedNote;

            const startX = Math.random() * 100;
            const endX = startX + (Math.random() * 40 - 20);

            note.style.cssText = `
                position: fixed;
                left: ${startX}%;
                bottom: -50px;
                font-size: ${Math.random() * 30 + 20}px;
                color: rgba(155, 89, 182, ${Math.random() * 0.5 + 0.4});
                pointer-events: none;
                z-index: 1;
                animation: floatUpDance ${Math.random() * 3 + 4}s ease-out forwards;
            `;
            note.style.setProperty('--end-x', `${endX}%`);

            document.body.appendChild(note);

            setTimeout(() => note.remove(), 7000);
        }
    }, 2000);
}

// ==========================================
// 統合スクロールハンドラ（パフォーマンス最適化）
// ==========================================
function setupUnifiedScrollHandler() {
    const navbar = document.querySelector('.navbar');
    const moonContainer = document.querySelector('.moon-container');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const progressBar = createScrollProgressBar();

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                // ナビバーのスクロール効果
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // パララックス（月）
                if (moonContainer) {
                    moonContainer.style.transform = `translateY(${scrollY * 0.3}px)`;
                }

                // スクロールインジケーター非表示
                if (scrollIndicator) {
                    if (scrollY > 100) {
                        scrollIndicator.classList.add('hidden');
                    } else {
                        scrollIndicator.classList.remove('hidden');
                    }
                }

                // プログレスバー
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (windowHeight > 0) {
                    progressBar.style.width = `${(scrollY / windowHeight) * 100}%`;
                }

                // アクティブセクション
                let current = '';
                sections.forEach(section => {
                    if (scrollY >= section.offsetTop - 100) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ==========================================
// グローバルCSSアニメーション（一括追加）
// ==========================================
function injectGlobalAnimationStyles() {
    const style = document.createElement('style');
    style.setAttribute('data-miluna-animations', 'true');
    style.textContent = `
        @keyframes shooting {
            0% {
                transform: translate(0, 0);
                opacity: 1;
            }
            100% {
                transform: translate(-300px, 300px);
                opacity: 0;
            }
        }
        @keyframes pawPrintFade {
            0% {
                opacity: 0.8;
                transform: scale(0) rotate(0deg);
            }
            50% {
                opacity: 0.6;
            }
            100% {
                opacity: 0;
                transform: scale(1.5) rotate(20deg);
            }
        }
        @keyframes floatUpDance {
            0% {
                transform: translateY(0) rotate(0deg) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: translateY(-10vh) rotate(45deg) scale(1);
            }
            50% {
                transform: translateY(-50vh) rotate(180deg) scale(1.2);
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg) scale(0.8);
                opacity: 0;
            }
        }
        @keyframes heartFloat {
            0% {
                transform: translateY(0) scale(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(1.5);
                opacity: 0;
            }
        }
        @keyframes sparkleExplosion {
            0% {
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) rotate(var(--angle)) translateX(50px) scale(1);
                opacity: 0;
            }
        }
        @keyframes confettiFall {
            to {
                transform: translateY(110vh) rotate(720deg);
            }
        }
        @keyframes rainbowPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.7; }
        }
        @keyframes milunaWalk {
            0% {
                right: -60px;
                transform: scaleX(1);
            }
            25% {
                right: 50%;
                transform: scaleX(1);
            }
            25.1% {
                transform: scaleX(-1);
            }
            50% {
                right: 100%;
                transform: scaleX(-1);
            }
            50.1% {
                right: -60px;
                transform: scaleX(-1);
            }
            75% {
                right: 50%;
                transform: scaleX(-1);
            }
            75.1% {
                transform: scaleX(1);
            }
            100% {
                right: -60px;
                transform: scaleX(1);
            }
        }
        @keyframes partyPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 初期化
// ==========================================
function init() {
    // グローバルCSSアニメーションを一括注入
    injectGlobalAnimationStyles();

    // 星空を生成
    createStars();

    // 各機能を初期化
    setupUnifiedScrollHandler();
    setupSmoothScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupMouseEffect();
    startShootingStars();
    setupPageLoadAnimation();

    // 遊び心のある機能
    createDancingNotes();
    setupConstellationDrawing();
    createAnimatedMiluna();
    setupEasterEggs();
    setupImageErrorHandling();
    setupHelpModal();
    setupLightbox();
    setupGalleryFilter();

    console.log('🌟 ミルナのWebサイトへようこそ！ 🌙');
    console.log('💡 ヒント: 「miluna」とタイプしてみてください！');
    console.log('💡 ヒント: 画面をダブルクリックして星座を描いてみてください！');
    console.log('💡 ヒント: 歩いている猫をクリックしてみてください！');
    console.log('💡 ヒント: ギャラリーの画像をクリックして拡大表示！');
}

// DOMが読み込まれたら初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}