(() => {
  const core = document.createElement('script');
  core.src = 'consultation-form-core.js';
  core.onload = () => {
    const booking = document.createElement('script');
    booking.src = 'contact-booking.js';
    document.head.appendChild(booking);
  };
  document.head.appendChild(core);
})();
