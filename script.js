// Mobil menyu
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#nav-menu');

if (toggle) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
}

// Daxili linklər üçün yumşaq skrol
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      menu?.classList.remove('show');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Reveal on scroll + auto-stagger
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

document.querySelectorAll('.grid').forEach(grid => {
  const kids = grid.querySelectorAll('.reveal');
  kids.forEach((el, i) => { el.style.transitionDelay = `${i * 90}ms`; });
});

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Yuxarı dön
const backTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) backTop.classList.add('show');
  else backTop.classList.remove('show');
});

// Footer il
document.querySelector('#year').textContent = new Date().getFullYear();

// Əlaqə formu (Formspree/EmailJS)
const form = document.querySelector('#contactForm');
const formNote = document.querySelector('#formNote');

const SUBMIT_MODE = "formspree"; // "formspree" | "emailjs" | "demo"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeolwjjy";
const EMAILJS_SERVICE_ID = "service_xxxxx";
const EMAILJS_TEMPLATE_ID = "template_xxxxx";
const EMAILJS_PUBLIC_KEY = "public_xxxxx";

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const errors = [];

    if (!data.name || data.name.trim().length < 2) errors.push('Zəhmət olmasa adınızı daxil edin.');
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) errors.push('Zəhmət olmasa düzgün email daxil edin.');
    if (!data.message || data.message.trim().length < 8) errors.push('Zəhmət olmasa qısa mesaj yazın.');
    if (!form.querySelector('input[name="consent"]').checked) errors.push('Zəhmət olmasa razılığı təsdiq edin.');

    if (errors.length) {
      formNote.textContent = errors[0];
      formNote.style.color = '#b4232a';
      return;
    }

    try {
      if (SUBMIT_MODE === "formspree") {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });
        if (!res.ok) throw new Error("Formspree cavabı uğursuz oldu");
        form.reset();
        formNote.textContent = 'Təşəkkürlər! Sorğunuz qeydə alındı və tezliklə əlaqə saxlanılacaq.';
        formNote.style.color = '#15803d';
      } else if (SUBMIT_MODE === "emailjs") {
        // emailjs.init(EMAILJS_PUBLIC_KEY);
        const payload = { from_name: data.name, reply_to: data.email, message: data.message };
        // eslint-disable-next-line no-undef
        const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
        if (!res.status || res.status !== 200) throw new Error("EmailJS göndərişi alınmadı");
        form.reset();
        formNote.textContent = 'Mesajınız göndərildi. Təşəkkür edirik!';
        formNote.style.color = '#15803d';
      } else {
        console.log("DEMO FORM DATA:", data);
        form.reset();
        formNote.textContent = 'Demo rejim: məlumat konsola yazıldı.';
        formNote.style.color = '#15803d';
      }
    } catch (err) {
      console.error(err);
      formNote.textContent = 'Üzr istəyirik, göndəriş zamanı xəta baş verdi. Zəhmət olmasa bir daha yoxlayın.';
      formNote.style.color = '#b4232a';
    }
  });
}

