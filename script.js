document.addEventListener('DOMContentLoaded', () => {

  // 1. Countdown
  const countdown = () => {
    const target = new Date('May 2, 2026 13:00:00').getTime();
    const gap = target - Date.now();
    const s=1000,m=s*60,h=m*60,d=h*24;
    const fmt=n=>(n<10?'0':'')+Math.max(0,n);
    const dd=Math.floor(gap/d),hh=Math.floor((gap%d)/h),mm=Math.floor((gap%h)/m),ss=Math.floor((gap%m)/s);
    const heroEl=document.getElementById('hero-countdown');
    if(heroEl) heroEl.innerHTML=`<div class="time-box"><span>${fmt(dd)}</span><label>Days</label></div><div class="time-box"><span>${fmt(hh)}</span><label>Hours</label></div><div class="time-box"><span>${fmt(mm)}</span><label>Mins</label></div><div class="time-box"><span>${fmt(ss)}</span><label>Secs</label></div>`;
    const regEl=document.getElementById('countdown');
    if(regEl) regEl.innerHTML=`<div class="time"><span>${fmt(dd)}</span><label>D</label></div><div class="time"><span>${fmt(hh)}</span><label>H</label></div><div class="time"><span>${fmt(mm)}</span><label>M</label></div><div class="time"><span>${fmt(ss)}</span><label>S</label></div>`;
  };
  countdown(); setInterval(countdown,1000);

  // 2. Mobile nav
  const hamburger=document.getElementById('hamburger');
  const mobileNav=document.getElementById('mobileNav');
  const mobileNavClose=document.getElementById('mobileNavClose');
  hamburger?.addEventListener('click',()=>{mobileNav.classList.add('open');document.body.style.overflow='hidden'});
  mobileNavClose?.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.style.overflow=''});
  document.querySelectorAll('.mobile-nav-link').forEach(l=>l.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.style.overflow=''}));

  // 3. Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const href=link.getAttribute('href');
      if(href==='#') return;
      const target=document.querySelector(href);
      if(target){e.preventDefault();const hh=document.getElementById('header')?.offsetHeight||72;window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-hh-12,behavior:'smooth'})}
    });
  });

  // 4. Active nav
  const sections=document.querySelectorAll('section[id]');
  const navLinks=document.querySelectorAll('.nav-link');
  window.addEventListener('scroll',()=>{
    let current='';
    const hh=document.getElementById('header')?.offsetHeight||72;
    sections.forEach(s=>{if(window.scrollY>=s.offsetTop-hh-80) current=s.id});
    navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+current));
    document.getElementById('header')?.classList.toggle('scrolled',window.scrollY>10);
  },{passive:true});

  // 5. Reveal on scroll
  const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const siblings=entry.target.closest('.features-grid,.bonus-grid')?.querySelectorAll('.reveal,.reveal-left,.reveal-right');
        const idx=siblings?Array.from(siblings).indexOf(entry.target):0;
        setTimeout(()=>entry.target.classList.add('active'),idx*90);
        obs.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el=>obs.observe(el));

  // Trigger hero immediately
  window.addEventListener('load',()=>{
    document.querySelectorAll('.hero .reveal-left,.hero .reveal-right,.hero .reveal').forEach(el=>el.classList.add('active'));
  });

  // 6. FAQ accordion
  document.querySelectorAll('.accordion-item').forEach(item=>{
    item.querySelector('.accordion-header').addEventListener('click',()=>{
      const active=item.classList.contains('is-open');
      document.querySelectorAll('.accordion-item').forEach(i=>i.classList.remove('is-open'));
      if(!active) item.classList.add('is-open');
    });
  });

  // 7. Feature read more
  document.querySelectorAll('.btn-read').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      const card=btn.closest('.feature-card');
      card.classList.toggle('expanded');
      const exp=card.classList.contains('expanded');
      const icon=btn.querySelector('i')?.outerHTML||'';
      btn.innerHTML=(exp?'READ LESS':'READ MORE')+' '+icon;
    });
  });

  // 8. Floating CTA
  const floatingCta=document.getElementById('floatingCta');
  const heroSection=document.getElementById('overview');
  const registerSection=document.getElementById('register');
  if(floatingCta&&heroSection){
    window.addEventListener('scroll',()=>{
      const heroBottom=heroSection.offsetTop+heroSection.offsetHeight;
      const regTop=registerSection?registerSection.offsetTop:Infinity;
      const scrolled=window.scrollY;
      floatingCta.classList.toggle('visible',scrolled>heroBottom-100&&!(scrolled+window.innerHeight>regTop+200));
    },{passive:true});
  }

  // 9. Form submit
  const supabaseUrl = 'https://rbivamtmcadfnemqcvac.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaXZhbXRtY2FkZm5lbXFjdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTU2MjgsImV4cCI6MjA4MTM5MTYyOH0.hZTprt4i3Y896uY_7m-lz-8T01lAArfj7hBIxw1utnc';
  const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const sanitizeInput = (str) => {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  };

  const referralMap = {
    'UEGRAM': 'Instagram',
    'UECHAT': 'WhatsApp',
    'UENEXT': 'LinkedIn',
    'UETOK': 'TikTok',
    'UEFAM': 'alumni "UE family"'
  };

  const regForm = document.getElementById('regForm');
  const submitBtn = document.getElementById('submitBtn');
  const referralModal = document.getElementById('referralModal');
  const btnInputCode = document.getElementById('btnInputCode');
  const btnContinueNoCode = document.getElementById('btnContinueNoCode');
  const refInput = regForm.querySelector('[name="referral_code"]');

  let skipReferralCheck = false;

  const handleRegistration = async () => {
    // Clear previous state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';

    try {
      const formData = new FormData(regForm);
      const payload = {};
      
      formData.forEach((value, key) => {
        payload[key] = sanitizeInput(value || '');
      });

      // Referral mapping
      const refCode = payload.referral_code.toUpperCase().trim();
      payload.referral_source = referralMap[refCode] || (refCode ? 'Other Code' : 'Organic / No Code');

      // Insert into Supabase
      const { error } = await _supabase
        .schema('event')
        .from('webinar')
        .insert([payload]);

      if (error) throw error;

      // Success state
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Pendaftaran Berhasil!';
      submitBtn.style.background = '#2e7d32';
      regForm.reset();
      skipReferralCheck = false;
    } catch (err) {
      console.error('Registration error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      alert('Maaf, terjadi kesalahan saat pendaftaran. Silakan coba lagi atau hubungi kami via WhatsApp.');
    }
  };

  regForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check if referral code is missing and check hasn't been skipped
    if (!refInput.value.trim() && !skipReferralCheck) {
      referralModal.classList.add('open');
      return;
    }

    handleRegistration();
  });

  btnInputCode?.addEventListener('click', () => {
    referralModal.classList.remove('open');
    refInput.focus();
    refInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  btnContinueNoCode?.addEventListener('click', () => {
    referralModal.classList.remove('open');
    skipReferralCheck = true;
    handleRegistration();
  });
});
