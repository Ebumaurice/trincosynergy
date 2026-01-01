document.addEventListener("DOMContentLoaded", () => {
    // ===========================
    //  Footer Current Year
    // ===========================
    const currentYear = new Date().getFullYear();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = currentYear;


    // =========================
    //  Scroll fade-up animation
    // ==========================
    const featuredCards = document.querySelectorAll('.featured-card');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    featuredCards.forEach(card => observer.observe(card));


    const archCards = document.querySelectorAll('.arch-card');

    const archObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });

    archCards.forEach(card => archObserver.observe(card));


    // ===========================
    //  FAQ Animation Section
    // ==========================

    const faqSection = document.querySelector(".faq-section");
    const faqItems = document.querySelectorAll(".faq-item");

    // Intersection Observer for FAQ section
    const faqObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                faqSection.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (faqSection) faqObserver.observe(faqSection);

    // FAQ toggle functionality
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all items
            faqItems.forEach(i => i.classList.remove("active"));

            // Open clicked item if it was not active
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });



    /* ===========================
           ARCHITECTURAL LIGHTBOX
        ============================ */
    const lightbox = document.getElementById("archLightbox");
    const mainImg = document.getElementById("lightboxMain");
    const caption = document.getElementById("lightboxCaption");
    const thumbs = document.getElementById("lightboxThumbs");
    const closeBtn = document.querySelector(".lightbox-close");

    let images = [];
    let index = 0;

    document.querySelectorAll(".arch-card").forEach(card => {
        card.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();

            images = [...card.querySelectorAll(".arch-gallery img")];
            if (!images.length) return;

            openLightbox(0);
        });
    });

    function openLightbox(i) {
        index = i;
        thumbs.innerHTML = "";
        updateMain();

        images.forEach((img, idx) => {
            const t = document.createElement("img");
            t.src = img.src;
            if (idx === index) t.classList.add("active");
            t.addEventListener("click", () => openLightbox(idx));
            thumbs.appendChild(t);
        });

        lightbox.classList.add("show");
    }

    function updateMain() {
        const img = images[index];
        mainImg.src = img.src;
        caption.textContent = img.dataset.caption || "";

        thumbs.querySelectorAll("img").forEach((t, i) => {
            t.classList.toggle("active", i === index);
        });
    }

    closeBtn?.addEventListener("click", () => lightbox.classList.remove("show"));

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("show")) return;

        if (e.key === "Escape") lightbox.classList.remove("show");
        if (e.key === "ArrowRight") index++;
        if (e.key === "ArrowLeft") index--;

        index = (index + images.length) % images.length;
        updateMain();
    });

    /* Swipe support */
    let startX = 0;
    mainImg.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    mainImg.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) index++;
        if (endX - startX > 50) index--;
        index = (index + images.length) % images.length;
        updateMain();
    });

    /* ===========================
   LIGHTBOX ARROW CONTROLS
=========================== */
    const prevBtn = document.querySelector(".lightbox-nav.prev");
    const nextBtn = document.querySelector(".lightbox-nav.next");

    prevBtn.addEventListener("click", e => {
        e.stopPropagation();
        index = (index - 1 + images.length) % images.length;
        updateMain();
    });

    nextBtn.addEventListener("click", e => {
        e.stopPropagation();
        index = (index + 1) % images.length;
        updateMain();
    });




    // ===========================
    //  Animate contact section on scroll
    // ==========================

    const contactLeft = document.querySelector('.contact-left');
    const contactRight = document.querySelector('.contact-right');

    function revealOnScroll() {
        const triggerBottom = window.innerHeight * 0.85;

        [contactLeft, contactRight].forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll); // Trigger on page load


    // ===========================
    //  Nigeria Map with Radar
    // ===========================
    const mapEl = document.getElementById('map');
    if (mapEl) {
        const map = L.map('map', {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            zoomAnimation: false,
            fadeAnimation: false,
            markerZoomAnimation: false
        }).setView([7.5, 7.0], 6);

        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/NGA.geo.json')
            .then(res => res.json())
            .then(data => {
                const nigeriaLayer = L.geoJSON(data, {
                    style: { fillColor: "#222742", fillOpacity: 1, color: "#222742", weight: 0 }
                }).addTo(map);

                const bounds = nigeriaLayer.getBounds();
                setTimeout(() => {
                    map.invalidateSize();
                    map.fitBounds(bounds, { padding: [5, 5], animate: false });
                    map.setZoom(map.getZoom() + 0.2);
                }, 150);

                // Radar cities
                const radarCities = [
                    { name: "Enugu", coords: [6.4550, 7.4986] },
                    { name: "Aba", coords: [5.1063, 7.3662] },
                    { name: "Owerri", coords: [5.4858, 7.0357] },
                    { name: "Onitsha", coords: [6.1477, 6.7890] }
                ];

                radarCities.forEach(city => {
                    L.circleMarker(city.coords, {
                        radius: 6, color: '#d4b100', fillColor: '#d4b100', fillOpacity: 1, weight: 2
                    }).addTo(map);

                    const pulse = L.circleMarker(city.coords, {
                        radius: 9, color: '#d4b100', fillColor: '#d4b100', fillOpacity: 0.6, weight: 0
                    }).addTo(map);

                    function animatePulse() {
                        let radius = 9, opacity = 0.9;
                        function expand() {
                            radius += 0.18; opacity -= 0.006;
                            pulse.setRadius(radius); pulse.setStyle({ fillOpacity: opacity });
                            if (radius >= 15 || opacity <= 0) { radius = 5; opacity = 0.4; setTimeout(expand, Math.random() * 700); }
                            else requestAnimationFrame(expand);
                        }
                        expand();
                    }
                    animatePulse();
                });

                setTimeout(() => {
                    map.invalidateSize();
                    map.setView([9.0, 8.3], map.getZoom());
                }, 250);
            })
            .catch(err => console.error('Error loading Nigeria map:', err));
    }

    //map content counter
    const counters = document.querySelectorAll('.map-content h2');

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const symbol = counter.getAttribute('data-symbol') || ''; // default empty
        const duration = 3000; // total animation time in ms
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            counter.textContent = current + symbol;
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target + symbol; // ensure exact final value
        }

        requestAnimationFrame(update);
    });

    const toggleBtn = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    toggleBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

}); // End DOMContentLoaded
