document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. NAVBAR — scroll effect + hamburger
  -------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* --------------------------------------------------
     2. SCROLL REVEAL — IntersectionObserver
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.reveal, .cat-card, .how__step, .why__card, .testi__card, .g-card, .ig__tile'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    // Stagger gallery cards automatically if no data-delay
    if (el.classList.contains('g-card') && !el.dataset.delay) {
      el.dataset.delay = i * 80;
    }
    revealObserver.observe(el);
  });

  /* --------------------------------------------------
     3. SECTION HEADER REVEAL
  -------------------------------------------------- */
  document.querySelectorAll('.section-header').forEach(header => {
    header.classList.add('reveal');
    revealObserver.observe(header);
  });

  /* --------------------------------------------------
     4. ORDER FORM — submission handler
  -------------------------------------------------- */
  const orderForm    = document.getElementById('orderForm');
  const orderSuccess = document.getElementById('orderSuccess');

  if (orderForm) {
    // Set min date to 2 days from today
    const deliveryInput = document.getElementById('deliveryDate');
    if (deliveryInput) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 2);
      deliveryInput.min = minDate.toISOString().split('T')[0];
    }

    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      const required = orderForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.classList.add('error');
          field.style.borderColor = 'var(--rose)';
          valid = false;
        }
      });

      if (!valid) {
        const firstError = orderForm.querySelector('.error');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Simulate submission
      const submitBtn = orderForm.querySelector('[type="submit"]');
      submitBtn.innerHTML = '<span>✨ Sending your order…</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        orderForm.style.opacity    = '0';
        orderForm.style.transition = 'opacity 0.4s ease';
        setTimeout(() => {
          orderForm.style.display = 'none';
          orderSuccess.classList.add('show');
          orderSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400);
      }, 1200);
    });

    // Remove error styling on input
    orderForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.classList.remove('error');
      });
    });
  }

  /* --------------------------------------------------
     5. CONTACT FORM — submission handler
  -------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.innerHTML        = '✅ Message Sent!';
      btn.style.background = '#4caf50';
      btn.disabled         = true;

      setTimeout(() => {
        btn.innerHTML        = 'Send Message 💌';
        btn.style.background = '';
        btn.disabled         = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* --------------------------------------------------
     6. FILE UPLOAD — preview filename + drag & drop
  -------------------------------------------------- */
  const refImageInput  = document.getElementById('refImage');
  const filePreview    = document.getElementById('filePreview');
  const fileUploadArea = document.getElementById('fileUploadArea');

  if (refImageInput && filePreview) {
    refImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          filePreview.innerHTML = `
            <img src="${ev.target.result}" alt="Preview"
              style="max-height:80px;border-radius:8px;margin-top:0.5rem;display:inline-block;width:auto;" />
            <span style="display:block;margin-top:0.25rem;">${file.name}</span>
          `;
        };
        reader.readAsDataURL(file);
      } else {
        filePreview.textContent = `📎 ${file.name}`;
      }
    });

    // Drag & drop
    const uploadUI = fileUploadArea.querySelector('.file-upload__ui');

    fileUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadUI.style.borderColor = 'var(--rose)';
      uploadUI.style.background  = 'var(--cream-dark)';
    });

    fileUploadArea.addEventListener('dragleave', () => {
      uploadUI.style.borderColor = '';
      uploadUI.style.background  = '';
    });

    fileUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadUI.style.borderColor = '';
      uploadUI.style.background  = '';
      const dt = e.dataTransfer;
      if (dt.files.length) {
        refImageInput.files = dt.files;
        refImageInput.dispatchEvent(new Event('change'));
      }
    });
  }

  /* --------------------------------------------------
     7. SMOOTH ACTIVE NAV LINK on scroll
  -------------------------------------------------- */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.style.color = 'var(--rose)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* --------------------------------------------------
     8. HERO FLOATING BADGES — subtle parallax (pointer only)
  -------------------------------------------------- */
  const floats = document.querySelectorAll('.hero__float');

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      floats.forEach((f, i) => {
        const strength = (i + 1) * 4;
        f.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
    });
  }

  /* --------------------------------------------------
     9. CATEGORY CARDS — staggered delay assignment
  -------------------------------------------------- */
  document.querySelectorAll('.cat-card').forEach((card, i) => {
    if (!card.dataset.delay) card.dataset.delay = i * 100;
  });

  /* --------------------------------------------------
     10. MARQUEE — pause on hover
  -------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* --------------------------------------------------
     11. SCROLL-TO-TOP on logo click
  -------------------------------------------------- */
  document.querySelector('.nav__logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});