/**
 * ========================================
 * UNIFIED BIRTHDAY EXPERIENCE - MAIN INIT
 * ========================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Unified Birthday Experience Loaded!');
    
    // Initialize Navigation & Music
    initUnifiedExperience();
    
    // Initialize Cake Section
    initCakeSection();
    
    // Initialize Celebration Section
    initCelebrationSection();
});

/**
 * Navigation and Progress Bar
 */
function initUnifiedExperience() {
    initNavigation();
    initMusicControl();
    
    const firstSection = document.querySelector('.page-section');
    if (firstSection) {
        firstSection.style.paddingTop = '70px';
    }
}

function initNavigation() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progressBar');
    const sections = document.querySelectorAll('.page-section');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLinks[index]) navLinks[index].classList.add('active');
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initMusicControl() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    if (!musicToggle || !bgMusic) return;
    
    bgMusic.volume = 0.5;
    
    // Auto-play music on page load
    setTimeout(() => {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            isPlaying = true;
            console.log('🎵 Music started automatically!');
        }).catch(error => {
            console.log('Auto-play blocked by browser. User interaction required.');
            // If autoplay fails, try again on first user interaction
            document.body.addEventListener('click', () => {
                if (!isPlaying) {
                    bgMusic.play().then(() => {
                        musicToggle.classList.add('playing');
                        isPlaying = true;
                    }).catch(e => console.log('Music play failed:', e));
                }
            }, { once: true });
        });
    }, 500);
    
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                isPlaying = true;
            }).catch(error => console.log('Music play failed:', error));
        }
    });
}

/**
 * ========================================
 * CAKE SECTION
 * ========================================
 */
function initCakeSection() {
    initCakeInteractions();
    startAmbientSprinkles();
}

let blownCandles = 0;
const totalCandles = 3;

function initCakeInteractions() {
    const candles = document.querySelectorAll('.candle');
    const candlesLeftDisplay = document.getElementById('candlesLeft');
    const successMessage = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');
    
    if (!candles.length) return;
    
    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('blown')) {
                blowCandle(candle);
                blownCandles++;
                if (candlesLeftDisplay) candlesLeftDisplay.textContent = totalCandles - blownCandles;
                
                createSprinkles(candle);
                
                if (blownCandles === totalCandles) {
                    setTimeout(() => showSuccess(), 800);
                }
            }
        });
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => resetCake());
    }
}

function blowCandle(candle) {
    candle.classList.add('blown');
    
    if (typeof gsap !== 'undefined') {
        gsap.to(candle, {
            y: -10,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
        });
    }
    
    createSmoke(candle);
}

function createSmoke(candle) {
    const rect = candle.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top;
    
    for (let i = 0; i < 5; i++) {
        const smoke = document.createElement('div');
        smoke.style.position = 'fixed';
        smoke.style.left = centerX + 'px';
        smoke.style.top = centerY + 'px';
        smoke.style.width = '8px';
        smoke.style.height = '8px';
        smoke.style.background = 'rgba(150, 150, 150, 0.5)';
        smoke.style.borderRadius = '50%';
        smoke.style.pointerEvents = 'none';
        smoke.style.zIndex = '1000';
        
        document.body.appendChild(smoke);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(smoke, {
                y: -50 - Math.random() * 30,
                x: (Math.random() - 0.5) * 40,
                opacity: 0,
                scale: 2,
                duration: 1 + Math.random() * 0.5,
                ease: 'power2.out',
                onComplete: () => smoke.remove()
            });
        } else {
            setTimeout(() => smoke.remove(), 1500);
        }
    }
}

function showSuccess() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.add('show');
        createMassiveSprinkles();
    }
}

function resetCake() {
    const candles = document.querySelectorAll('.candle');
    const candlesLeftDisplay = document.getElementById('candlesLeft');
    const successMessage = document.getElementById('successMessage');
    
    candles.forEach(candle => candle.classList.remove('blown'));
    blownCandles = 0;
    if (candlesLeftDisplay) candlesLeftDisplay.textContent = totalCandles;
    if (successMessage) successMessage.classList.remove('show');
}

function createSprinkles(sourceElement) {
    const container = document.getElementById('sprinklesContainer');
    if (!container) return;
    
    const rect = sourceElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = ['pink', 'purple', 'blue', 'gold', 'peach'];
    const shapes = ['', 'circle', 'star'];
    
    for (let i = 0; i < 20; i++) {
        const sprinkle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        sprinkle.className = `sprinkle ${color} ${shape}`;
        sprinkle.style.left = centerX + 'px';
        sprinkle.style.top = centerY + 'px';
        
        const spreadX = (Math.random() - 0.5) * 300;
        const duration = 1.5 + Math.random() * 1;
        sprinkle.style.animationDuration = duration + 's';
        
        container.appendChild(sprinkle);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(sprinkle, {
                x: spreadX,
                duration: duration,
                ease: 'power2.out'
            });
        }
        
        setTimeout(() => sprinkle.remove(), duration * 1000);
    }
}

function createMassiveSprinkles() {
    const container = document.getElementById('sprinklesContainer');
    if (!container) return;
    
    const colors = ['pink', 'purple', 'blue', 'gold', 'peach'];
    const shapes = ['', 'circle', 'star'];
    
    for (let i = 0; i < 150; i++) {
        const sprinkle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        sprinkle.className = `sprinkle ${color} ${shape}`;
        sprinkle.style.left = Math.random() * 100 + '%';
        sprinkle.style.top = '-20px';
        
        const duration = 2 + Math.random() * 2;
        sprinkle.style.animationDuration = duration + 's';
        sprinkle.style.animationDelay = Math.random() * 0.8 + 's';
        
        container.appendChild(sprinkle);
        setTimeout(() => sprinkle.remove(), (duration + 0.8) * 1000);
    }
}

function startAmbientSprinkles() {
    setInterval(() => {
        if (Math.random() > 0.8) {
            const container = document.getElementById('sprinklesContainer');
            if (!container) return;
            
            const colors = ['pink', 'purple', 'blue', 'gold', 'peach'];
            
            for (let i = 0; i < 3; i++) {
                const sprinkle = document.createElement('div');
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                sprinkle.className = `sprinkle ${color}`;
                sprinkle.style.left = Math.random() * 100 + '%';
                sprinkle.style.top = '-20px';
                
                const duration = 2 + Math.random() * 1;
                sprinkle.style.animationDuration = duration + 's';
                
                container.appendChild(sprinkle);
                setTimeout(() => sprinkle.remove(), duration * 1000);
            }
        }
    }, 2000);
}

/**
 * ========================================
 * CELEBRATION SECTION
 * ========================================
 */
function initCelebrationSection() {
    createFloatingHearts();
    initCuteCat();
    initPhotoGallery();
    initScrollAnimations();
    
    setTimeout(() => createConfetti(), 1000);
}

function createFloatingHearts() {
    const container = document.getElementById('heartsBackground');
    if (!container) return;
    
    const hearts = ['💕', '💖', '💗', '💝', '💓', '❤️', '💜', '💙'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (5 + Math.random() * 3) + 's';
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 8000);
    }, 800);
}

function initCuteCat() {
    const cat = document.getElementById('cuteCat');
    if (!cat) return;
    
    let isDancing = false;
    
    cat.addEventListener('click', () => {
        if (!isDancing) {
            cat.classList.add('dancing');
            isDancing = true;
            createConfetti();
            
            const arms = cat.querySelectorAll('.cat-arm');
            const legs = cat.querySelectorAll('.cat-leg');
            const tail = cat.querySelector('.cat-tail');
            
            arms.forEach(arm => arm.style.animationDuration = '0.3s');
            legs.forEach(leg => leg.style.animationDuration = '0.3s');
            if (tail) tail.style.animationDuration = '0.4s';
            
            setTimeout(() => {
                cat.classList.remove('dancing');
                isDancing = false;
                arms.forEach(arm => arm.style.animationDuration = '1.2s');
                legs.forEach(leg => leg.style.animationDuration = '1.2s');
                if (tail) tail.style.animationDuration = '1.5s';
            }, 5000);
        }
    });
}

function initPhotoGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach(item => {
        item.addEventListener('click', () => {
            createConfetti();
            
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    scale: 1.05,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out'
                });
            }
        });
    });
}

function createConfetti() {
    const container = document.getElementById('sprinklesContainer');
    if (!container) return;
    
    const colors = ['#FFB6D9', '#C8A2C8', '#5DADE2', '#D4AF37', '#FFDAB9'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.pointerEvents = 'none';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '9999';
        
        container.appendChild(confetti);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(confetti, {
                y: window.innerHeight + 100,
                x: (Math.random() - 0.5) * 400,
                rotation: Math.random() * 720,
                duration: 3 + Math.random() * 2,
                ease: 'power2.in',
                onComplete: () => confetti.remove()
            });
        } else {
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from('.message-card', {
        scrollTrigger: {
            trigger: '.message-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)'
    });
    
    gsap.from('.photo-item', {
        scrollTrigger: {
            trigger: '.gallery-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
}
