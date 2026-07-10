document.addEventListener('DOMContentLoaded', () => {
    // 1. MODO OSCURO (Con memoria)
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');

    // Comprobar si hay una preferencia guardada
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Cambiar icono y guardar preferencia
        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. CAMBIO DE IDIOMA (Sin recargar la página)
    const langEsBtn = document.getElementById('lang-es');
    const langEnBtn = document.getElementById('lang-en');
    const translatableElements = document.querySelectorAll('[data-en]');

    langEsBtn.addEventListener('click', () => {
        switchLanguage('es');
    });

    langEnBtn.addEventListener('click', () => {
        switchLanguage('en');
    });

    function switchLanguage(lang) {
        if (lang === 'en') {
            langEnBtn.classList.add('active');
            langEsBtn.classList.remove('active');
            translatableElements.forEach(el => {
                el.setAttribute('data-es', el.textContent); // Guardar original
                el.textContent = el.getAttribute('data-en');
            });
        } else {
            langEsBtn.classList.add('active');
            langEnBtn.classList.remove('active');
            translatableElements.forEach(el => {
                el.textContent = el.getAttribute('data-es'); // Restaurar original
            });
        }
    }

    // 3. NAV BAR (Sticky, Con indicador, Se ilumina al hacer scroll)
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar Efecto
        if (window.scrollY > 50) {
            navbar.style.background = getComputedStyle(body).getPropertyValue('--bg-cream') + 'F2'; // Acentuar blur
        } else {
            navbar.style.background = getComputedStyle(body).getPropertyValue('--bg-cream') + 'EB'; // Blur por defecto
        }

        // Scroll Spy (Indicador de sección activa)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - navbar.clientHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // 4. BACK TO TOP (Mostrar/Ocultar y animación)
        const backToTopBtn = document.getElementById('back-to-top');
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Acción para volver arriba
    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // 5. ANIMACIONES AL HACER SCROLL (Fade, Slide, Zoom, Float)
    // Solo activamos el estado "oculto" (pre-reveal) AQUÍ, después de que el
    // script cargó correctamente. Si este archivo nunca llega a ejecutarse,
    // el CSS deja .reveal visible por defecto y la página nunca se ve en blanco.
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        revealElements.forEach(el => el.classList.add('pre-reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }


    // 6. PROYECTOS GALERÍA (Lógica para cambiar capturas)
    const projectCards = document.querySelectorAll('.project-detailed-card');

    projectCards.forEach(card => {
        const images = card.querySelectorAll('.project-gallery img');
        const prevBtn = card.querySelector('.gallery-prev');
        const nextBtn = card.querySelector('.gallery-next');
        let currentImgIndex = 0;

        if (images.length > 1 && prevBtn && nextBtn) { // Mostrar controles solo si hay más de una imagen
            prevBtn.addEventListener('click', () => {
                images[currentImgIndex].classList.add('hidden');
                currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
                images[currentImgIndex].classList.remove('hidden');
            });

            nextBtn.addEventListener('click', () => {
                images[currentImgIndex].classList.add('hidden');
                currentImgIndex = (currentImgIndex + 1) % images.length;
                images[currentImgIndex].classList.remove('hidden');
            });
        }
    });

    // 7. LIGHTBOX (Ver captura a tamaño completo)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Vista completa del proyecto';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // evita el scroll de fondo mientras está abierto
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-zoom').forEach(zoomBtn => {
        zoomBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const gallery = zoomBtn.closest('.project-gallery');
            const activeImg = gallery.querySelector('img:not(.hidden)');
            if (activeImg) openLightbox(activeImg.src, activeImg.alt);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox(); // clic en el fondo oscuro, no en la imagen
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

});
// 8. LOADER (se oculta solo cuando TODO terminó de cargar: imágenes, stats de GitHub, etc.)
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    loader.classList.add('loader-hidden');
    document.documentElement.classList.remove('is-loading');

    // Quita el loader del DOM una vez termina la transición de opacidad
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
});