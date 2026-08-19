/* ============================================================
   SCRIPT.JS — Contact form + Hero typed text
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Typed text effect (hero page) ── */
  const typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    const phrases = [
      'Full-Stack Developer',
      'Information Systems Student',
      'Web Developer',
      'Problem Solver',
    ];
    let phraseIdx = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    function type() {
      if (paused) return;
      const current = phrases[phraseIdx];

      if (!deleting) {
        typedTarget.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          paused = true;
          setTimeout(function () { paused = false; deleting = true; setTimeout(type, 60); }, 1800);
          return;
        }
        setTimeout(type, 70);
      } else {
        typedTarget.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting  = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      }
    }
    setTimeout(type, 800);
  }

  /* ── Contact form ── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

/* ── Form handler ── */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form      = e.target;
  const submitBtn = form.querySelector('.submit-btn');
  const origHTML  = submitBtn.innerHTML;

  const data = {
    name:    document.getElementById('name')?.value.trim()    || '',
    email:   document.getElementById('email')?.value.trim()   || '',
    subject: document.getElementById('subject')?.value.trim() || '',
    message: document.getElementById('message')?.value.trim() || '',
  };

  const err = validateForm(data);
  if (err) { showNotification(err, 'error'); return; }

  setLoadingState(submitBtn, true);

  try {
    await sendViaFormSubmit(data);
    showNotification("Message sent! I'll get back to you soon.", 'success');
    form.reset();
  } catch (error) {
    console.error(error);
    showNotification('Failed to send. Please email me directly.', 'error');
  } finally {
    setLoadingState(submitBtn, false, origHTML);
  }
}

function validateForm(d) {
  if (d.name.length < 2)            return 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please enter a valid email address.';
  if (d.subject.length < 3)         return 'Please enter a subject (min 3 characters).';
  if (d.message.length < 10)        return 'Please enter a message (min 10 characters).';
  return null;
}

function setLoadingState(btn, loading, original = '') {
  if (loading) {
    btn.disabled   = true;
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  } else {
    btn.disabled   = false;
    btn.innerHTML  = original;
  }
}

async function sendViaFormSubmit(data) {
  const form = document.createElement('form');
  form.style.display = 'none';
  form.method        = 'POST';
  form.action        = 'https://formsubmit.co/yonatandagnachew5@gmail.com';
  form.target        = '_blank';

  const fields = {
    name:     data.name,
    email:    data.email,
    subject:  data.subject,
    message:  data.message,
    _subject: `Portfolio Contact: ${data.subject}`,
    _template:'table',
    _captcha: 'false',
  };

  for (const [k, v] of Object.entries(fields)) {
    const inp  = document.createElement('input');
    inp.type   = 'hidden';
    inp.name   = k;
    inp.value  = v;
    form.appendChild(inp);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
  await new Promise(r => setTimeout(r, 900));
}

function showNotification(msg, type) {
  document.querySelector('.form-notification')?.remove();

  const el       = document.createElement('div');
  el.className   = `form-notification ${type}`;
  const icon     = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  el.innerHTML   = `<i class="fas ${icon}"></i> ${msg}`;

  const form = document.querySelector('.contact-form');
  form.insertBefore(el, form.firstChild);

  setTimeout(function () {
    el.style.transition = 'opacity 0.3s';
    el.style.opacity    = '0';
    setTimeout(function () { el.remove(); }, 300);
  }, 5000);
}
