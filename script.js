/**
 * Караоке-Клуб «Харизма» — Interactive Controller (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Header & Back to Top
     ========================================================================== */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. Mobile Menu
     ========================================================================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     3. Hall Tabs Switching
     ========================================================================== */
  const hallTabButtons = document.querySelectorAll('.hall-tab-nav-btn');
  const hallPanes = document.querySelectorAll('.hall-content-pane');

  hallTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.hall;

      hallTabButtons.forEach(b => b.classList.remove('active'));
      hallPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. Hall Gallery Slider with images from images/ folder
     ========================================================================== */
  const hallPhotos = [
    'images/Rectangle 7.png',
    'images/Rectangle 10.png',
    'images/Rectangle 11.png',
    'images/Rectangle 12.png',
    'images/Rectangle 13.png',
    'images/Rectangle 14.png'
  ];
  let currentPhotoIndex = 0;
  const totalPhotosCount = 17;

  const activeHallImg = document.getElementById('active-hall-img');
  const photoCounter = document.getElementById('photo-counter');
  const prevPhotoBtn = document.getElementById('prevPhotoBtn');
  const nextPhotoBtn = document.getElementById('nextPhotoBtn');
  const thumbItems = document.querySelectorAll('#thumbsStrip .thumb-item');

  function setGalleryPhoto(index) {
    currentPhotoIndex = index;
    if (activeHallImg) {
      activeHallImg.src = hallPhotos[currentPhotoIndex];
    }
    if (photoCounter) {
      photoCounter.textContent = `${currentPhotoIndex + 1} из ${totalPhotosCount}`;
    }
    thumbItems.forEach((th, idx) => {
      th.classList.toggle('active', idx === currentPhotoIndex);
    });
  }

  if (nextPhotoBtn && prevPhotoBtn) {
    nextPhotoBtn.addEventListener('click', () => {
      let nextIdx = (currentPhotoIndex + 1) % hallPhotos.length;
      setGalleryPhoto(nextIdx);
    });

    prevPhotoBtn.addEventListener('click', () => {
      let prevIdx = (currentPhotoIndex - 1 + hallPhotos.length) % hallPhotos.length;
      setGalleryPhoto(prevIdx);
    });
  }

  thumbItems.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      setGalleryPhoto(idx);
    });
  });

  /* ==========================================================================
     5. Interactive Price Calculator
     ========================================================================== */
  const calcGuestsRange = document.getElementById('calcGuestsRange');
  const calcHoursRange = document.getElementById('calcHoursRange');
  const calcGuestsValue = document.getElementById('calcGuestsValue');
  const calcHoursValue = document.getElementById('calcHoursValue');
  const calcBirthdayToggle = document.getElementById('calcBirthdayToggle');

  const recGuests = document.getElementById('recGuests');
  const recHours = document.getElementById('recHours');
  const recTotalPrice = document.getElementById('recTotalPrice');
  const recPerPerson = document.getElementById('recPerPerson');
  const recDiscountRow = document.getElementById('recDiscountRow');

  const hallRates = {
    hall1: 350,
    hall2: 350,
    hall3: 300,
    hall5: 450
  };

  const hallRadios = document.querySelectorAll('input[name="calcHallOpt"]');

  function updateCalculator() {
    if (!calcGuestsRange || !calcHoursRange) return;

    const guests = parseInt(calcGuestsRange.value, 10);
    const hours = parseInt(calcHoursRange.value, 10);
    const isBirthday = calcBirthdayToggle.checked;

    let selectedRate = 350;
    hallRadios.forEach(radio => {
      const card = radio.closest('.calc-radio-card');
      if (card) {
        card.classList.toggle('active', radio.checked);
      }
      if (radio.checked) {
        selectedRate = hallRates[radio.value] || 350;
      }
    });

    let baseSum = guests * hours * selectedRate;
    let finalSum = baseSum;

    if (isBirthday) {
      finalSum = Math.round(baseSum * 0.85); // 15% discount
      if (recDiscountRow) recDiscountRow.style.display = 'flex';
    } else {
      if (recDiscountRow) recDiscountRow.style.display = 'none';
    }

    const guestsText = guests === 1 ? '1 человек' : (guests < 5 ? `${guests} человека` : `${guests} человек`);
    const hoursText = hours === 1 ? '1 час' : (hours < 5 ? `${hours} часа` : `${hours} часов`);

    calcGuestsValue.textContent = guestsText;
    calcHoursValue.textContent = hoursText;

    if (recGuests) recGuests.textContent = guestsText;
    if (recHours) recHours.textContent = hoursText;
    if (recTotalPrice) recTotalPrice.textContent = `${finalSum.toLocaleString('ru-RU')} ₽`;
    if (recPerPerson) recPerPerson.textContent = `${selectedRate} ₽`;
  }

  if (calcGuestsRange && calcHoursRange) {
    calcGuestsRange.addEventListener('input', updateCalculator);
    calcHoursRange.addEventListener('input', updateCalculator);
    calcBirthdayToggle.addEventListener('change', updateCalculator);

    hallRadios.forEach(r => {
      r.addEventListener('change', updateCalculator);
    });

    updateCalculator();
  }

  /* ==========================================================================
     6. Step-by-Step Interactive Guide & Phone Simulation
     ========================================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const botChatMessages = document.getElementById('botChatMessages');

  const botResponses = {
    1: [
      { type: 'bot', text: 'Привет! Я бот караоке-клуба «Харизма» (м. Лубянка). 🎤' },
      { type: 'bot', text: '🥂 У нас нет депозита и нет пробкового сбора! Чем могу помочь?' },
      { type: 'user', text: 'Забронировать зал' }
    ],
    2: [
      { type: 'bot', text: 'Укажите количество человек в вашей компании:' },
      { type: 'options', list: ['1–4 чел', '5–10 чел', 'до 20 чел'] },
      { type: 'user', text: 'Нас будет 6 человек' }
    ],
    3: [
      { type: 'bot', text: 'На сколько часов хотите забронировать зал?' },
      { type: 'options', list: ['2 часа', '3 часа', '5+ часов'] },
      { type: 'user', text: '3 часа' }
    ],
    4: [
      { type: 'bot', text: '📅 Выберите желаемую дату посещения:' },
      { type: 'options', list: ['Сегодня', 'Завтра', 'В эту субботу'] },
      { type: 'user', text: 'В субботу' }
    ],
    5: [
      { type: 'bot', text: '⏰ Выберите время старта брони:' },
      { type: 'options', list: ['18:00', '20:30', '23:00', 'Круглосуточно'] },
      { type: 'bot', text: '✅ Зал Hall №1 забронирован! Ждем вас в гости!' }
    ]
  };

  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      const stepIdx = item.dataset.stepIndex;

      timelineItems.forEach(t => t.classList.remove('active'));
      item.classList.add('active');

      if (botChatMessages && botResponses[stepIdx]) {
        botChatMessages.innerHTML = '';
        botResponses[stepIdx].forEach(msg => {
          if (msg.type === 'options') {
            const wrap = document.createElement('div');
            wrap.className = 'tg-inline-buttons';
            msg.list.forEach((label, i) => {
              const span = document.createElement('span');
              span.textContent = label;
              if (i === 1) span.className = 'active';
              wrap.appendChild(span);
            });
            botChatMessages.appendChild(wrap);
          } else {
            const div = document.createElement('div');
            div.className = `tg-bubble ${msg.type}`;
            if (msg.text.includes('✅')) div.classList.add('highlight-bubble');
            div.textContent = msg.text;
            botChatMessages.appendChild(div);
          }
        });
      }
    });
  });

  /* ==========================================================================
     7. FAQ Accordion
     ========================================================================== */
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const trigger = card.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isAlreadyOpen = card.classList.contains('open');

      faqCards.forEach(c => {
        c.classList.remove('open');
        c.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyOpen) {
        card.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     8. Modal Booking Window
     ========================================================================== */
  const modal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const bookingModalForm = document.getElementById('bookingModalForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const successDismissBtn = document.getElementById('successDismissBtn');
  const mHallSelect = document.getElementById('mHall');
  const mDateInput = document.getElementById('mDate');

  if (mDateInput) {
    const today = new Date().toISOString().split('T')[0];
    mDateInput.min = today;
    mDateInput.value = today;
  }

  function showModal(hallName = null) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (hallName && mHallSelect) {
      for (let opt of mHallSelect.options) {
        if (opt.value.includes(hallName) || opt.text.includes(hallName)) {
          opt.selected = true;
          break;
        }
      }
    }

    if (bookingModalForm && modalSuccessState) {
      bookingModalForm.style.display = 'flex';
      modalSuccessState.style.display = 'none';
    }
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const hallName = btn.dataset.hallName || null;
      showModal(hallName);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideModal);
  if (successDismissBtn) successDismissBtn.addEventListener('click', hideModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      hideModal();
    }
  });

  if (bookingModalForm) {
    bookingModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingModalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;

      setTimeout(() => {
        bookingModalForm.style.display = 'none';
        modalSuccessState.style.display = 'block';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        bookingModalForm.reset();
      }, 600);
    });
  }

});
