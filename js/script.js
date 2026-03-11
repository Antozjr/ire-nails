document.addEventListener('DOMContentLoaded', () => {
  // ===================== NAVBAR =====================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-top');
    } else {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.add('navbar-top');
    }
  }

  updateNavbar();
  window.addEventListener('scroll', updateNavbar);

  // Hamburger toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('menu-open');
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('menu-open');
      mobileMenu.classList.add('hidden');
    });
  });

  // ===================== SMOOTH SCROLL =====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===================== BACK TO TOP =====================
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.remove('opacity-0', 'pointer-events-none');
      backToTop.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTop.classList.add('opacity-0', 'pointer-events-none');
      backToTop.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================== REVEAL ON SCROLL =====================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===================== FAQ ACCORDION =====================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-content').classList.add('hidden');
        other.querySelector('.faq-content').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
        content.classList.remove('hidden');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ===================== TESTIMONIAL CAROUSEL =====================
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-slide').length;
  let autoplayInterval;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.style.backgroundColor = i === currentSlide ? '#D4A574' : 'rgba(212, 165, 116, 0.3)';
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetAutoplay();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();

  // ===================== LIGHTBOX =====================
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let lightboxIndex = 0;

  const galleryGradients = [
    'linear-gradient(135deg, #F5E6E0, #E8C9A0, #D4A574)',
    'linear-gradient(135deg, #D4A574, #F5E6E0, #E8C9A0)',
    'linear-gradient(135deg, #E8C9A0, #D4A574, #F5E6E0)',
    'linear-gradient(135deg, #F5E6E0, #D4A574, #B8895A)',
    'linear-gradient(135deg, #B8895A, #E8C9A0, #F5E6E0)',
    'linear-gradient(135deg, #D4A574, #B8895A, #F5E6E0)',
  ];

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxContent.style.background = galleryGradients[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index));
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    lightboxIndex = ((lightboxIndex - 1) + galleryGradients.length) % galleryGradients.length;
    lightboxContent.style.background = galleryGradients[lightboxIndex];
  });

  lightboxNext.addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % galleryGradients.length;
    lightboxContent.style.background = galleryGradients[lightboxIndex];
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });
});
