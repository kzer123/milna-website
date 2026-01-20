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
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

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
function setupParallax() {
    const moonContainer = document.querySelector('.moon-container');
    
    if (moonContainer) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            moonContainer.style.transform = `translateY(${rate}px)`;
        });
    }
}

// ==========================================
// マウスフォロー効果（星の輝き）
// ==========================================
function setupMouseEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorCircle = null;
    
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
    
    // マウス移動時
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorCircle) {
            cursorCircle.style.left = `${mouseX - 10}px`;
            cursorCircle.style.top = `${mouseY - 10}px`;
            cursorCircle.style.display = 'block';
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
    
    // アニメーションを追加
    const style = document.createElement('style');
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
    `;
    document.head.appendChild(style);
    
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
function setupScrollProgress() {
    const progressBar = document.createElement('div');
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
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ==========================================
// アクティブセクションのハイライト
// ==========================================
function setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// 初期化
// ==========================================
function init() {
    // 星空を生成
    createStars();
    
    // 各機能を初期化
    handleNavbarScroll();
    setupSmoothScroll();
    setupMobileMenu();
    setupScrollAnimations();
    setupParallax();
    setupMouseEffect();
    startShootingStars();
    setupPageLoadAnimation();
    setupScrollProgress();
    setupActiveSection();
    
    console.log('🌟 ミルナのWebサイトへようこそ！ 🌙');
}

// DOMが読み込まれたら初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}