"use strict";

(() => {
  const section = document.querySelector("#proof");
  if (!section || section.dataset.processEnhanced === "true") return;
  section.dataset.processEnhanced = "true";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const steps = [
    {
      number: "01",
      title: "Discover",
      copy: "Initial exploration of opportunities and data.",
      icon: `<svg viewBox="0 0 120 120" role="img" aria-label="Compass icon"><circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" stroke-width="9"/><path d="M60 18l11 31 31 11-31 11-11 31-11-31-31-11 31-11z" fill="currentColor"/><circle cx="60" cy="60" r="8" fill="#FAF1EC"/></svg>`
    },
    {
      number: "02",
      title: "Analyze",
      copy: "Deep dive into processes, systems, and requirements.",
      icon: `<svg viewBox="0 0 120 120" role="img" aria-label="Analytics icon"><path d="M18 86V58h16v28H18zm24 0V40h16v46H42zm24 0V26h16v60H66z" fill="currentColor"/><circle cx="75" cy="69" r="19" fill="#FAF1EC" stroke="#C8A56A" stroke-width="8"/><path d="M89 84l16 16" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg>`
    },
    {
      number: "03",
      title: "Design & Improve",
      copy: "Iterative design of AI-integrated solutions.",
      icon: `<svg viewBox="0 0 120 120" role="img" aria-label="Design gears icon"><g fill="currentColor"><path d="M52 42l5 4 7-1 3 7 7 3-1 7 4 5-4 5 1 7-7 3-3 7-7-1-5 4-5-4-7 1-3-7-7-3 1-7-4-5 4-5-1-7 7-3 3-7 7 1z"/><circle cx="52" cy="67" r="12" fill="#FAF1EC"/></g><g fill="#C8A56A"><path d="M82 18l4 4 6-1 3 6 6 3-1 6 4 4-4 4 1 6-6 3-3 6-6-1-4 4-4-4-6 1-3-6-6-3 1-6-4-4 4-4-1-6 6-3 3-6 6 1z"/><circle cx="82" cy="40" r="8" fill="#FAF1EC"/></g></svg>`
    },
    {
      number: "04",
      title: "Deploy",
      copy: "Seamless rollout and integration into operations.",
      icon: `<svg viewBox="0 0 120 120" role="img" aria-label="Rocket icon"><path d="M72 18c17 2 28 13 30 30L68 82 38 52 72 18z" fill="currentColor"/><circle cx="76" cy="44" r="9" fill="#FAF1EC"/><path d="M42 58l-16 5-10 20 22-7 9-13-5-5zm20 20l-5 16-20 10 7-22 13-9 5 5z" fill="#C8A56A"/><path d="M38 82c-9 3-16 10-19 19 9-2 17-6 23-13l-4-6z" fill="#C8A56A"/></svg>`
    },
    {
      number: "05",
      title: "Optimize",
      copy: "Continuous monitoring and performance tuning.",
      icon: `<svg viewBox="0 0 120 120" role="img" aria-label="Optimize cycle icon"><path d="M93 48C88 31 73 20 56 20 39 20 24 31 19 47l14 4c3-10 12-17 23-17 10 0 19 6 23 15l-13-1 18 20 18-20-9 0zM27 72c5 17 20 28 37 28 17 0 32-11 37-27l-14-4c-3 10-12 17-23 17-10 0-19-6-23-15l13 1-18-20-18 20h9z" fill="currentColor"/></svg>`
    }
  ];

  const stepMarkup = steps.map((step, index) => `
    <li class="process-step" data-process-step style="--step-index:${index}">
      <div class="process-step__visual">
        <button class="process-step__orb" type="button" aria-label="${step.number} ${step.title}: ${step.copy}">
          <span class="process-step__halo" aria-hidden="true"></span>
          <span class="process-step__icon" aria-hidden="true">${step.icon}</span>
        </button>
        ${index < steps.length - 1 ? `<div class="process-connector" aria-hidden="true"><span class="process-connector__line"></span><span class="process-connector__flow"></span><span class="process-connector__arrow">›</span></div>` : ""}
      </div>
      <div class="process-step__content">
        <h3><span>${step.number}</span> ${step.title}</h3>
        <p>${step.copy}</p>
      </div>
    </li>`).join("");

  section.className = "section process-section";
  section.innerHTML = `
    <div class="container process-section__inner">
      <div class="process-section__intro reveal is-visible">
        <div class="section-label"><span>How I Work</span><i></i></div>
        <h2 id="proof-title">Practical AI. Built around real operations.</h2>
        <p>I focus on solutions that fit existing teams, workflows, systems, governance requirements, and adoption realities—not isolated AI experiments.</p>
      </div>
      <ol class="process-timeline" aria-label="Five-step AI consulting process">
        ${stepMarkup}
      </ol>
    </div>`;

  if (!document.querySelector("#how-i-work-styles")) {
    const style = document.createElement("style");
    style.id = "how-i-work-styles";
    style.textContent = `
      .process-section{position:relative;overflow:hidden;background:linear-gradient(180deg,#FFFDFC 0%,#FAF1EC 100%)}
      .process-section::before{content:"";position:absolute;inset:auto -10% -45% auto;width:48vw;height:48vw;border-radius:50%;background:radial-gradient(circle,rgba(200,165,106,.10),transparent 68%);pointer-events:none}
      .process-section__inner{position:relative;z-index:1}
      .process-section__intro{max-width:1120px;margin-bottom:clamp(62px,8vw,112px)}
      .process-section__intro .section-label{margin-bottom:18px}
      .process-section__intro h2{margin:0;max-width:1050px;color:#251D1D;font-family:Georgia,'Times New Roman',serif;font-size:clamp(2.7rem,5.2vw,5.35rem);font-weight:500;line-height:.98;letter-spacing:-.045em;text-wrap:balance}
      .process-section__intro>p{max-width:1040px;margin:22px 0 0;color:#493B37;font-size:clamp(1rem,1.45vw,1.2rem);line-height:1.65}
      .process-timeline{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:clamp(12px,2vw,28px);margin:0;padding:0;list-style:none}
      .process-step{position:relative;min-width:0;text-align:center;opacity:0;transform:translateY(34px);transition:opacity .65s ease calc(var(--step-index)*90ms),transform .7s cubic-bezier(.2,.75,.2,1) calc(var(--step-index)*90ms)}
      .process-section.is-inview .process-step{opacity:1;transform:translateY(0)}
      .process-step__visual{position:relative;display:flex;align-items:center;justify-content:center;min-height:clamp(168px,15vw,228px)}
      .process-step__orb{position:relative;z-index:2;display:grid;place-items:center;width:clamp(150px,14.2vw,224px);aspect-ratio:1;padding:0;border:1.5px solid rgba(47,36,32,.68);border-radius:50%;background:rgba(255,253,252,.78);box-shadow:0 18px 50px rgba(78,9,17,.05);color:#762630;cursor:pointer;isolation:isolate;transition:transform .42s cubic-bezier(.18,.8,.22,1),box-shadow .4s ease,border-color .3s ease,background .3s ease}
      .process-step__orb::before{content:"";position:absolute;inset:8px;border:1px solid transparent;border-radius:inherit;transition:border-color .3s ease,transform .4s ease}
      .process-step__orb:hover,.process-step__orb:focus-visible{transform:translateY(-10px) scale(1.075);border-color:#762630;background:#fff;box-shadow:0 28px 70px rgba(78,9,17,.18)}
      .process-step__orb:hover::before,.process-step__orb:focus-visible::before{border-color:rgba(200,165,106,.5);transform:scale(.96)}
      .process-step__orb:focus-visible{outline:3px solid rgba(118,38,48,.28);outline-offset:5px}
      .process-step__halo{position:absolute;inset:-10px;border-radius:inherit;border:1px solid rgba(200,165,106,.18);opacity:0;transform:scale(.9);transition:opacity .35s ease,transform .45s ease}
      .process-step__orb:hover .process-step__halo,.process-step__orb:focus-visible .process-step__halo{opacity:1;transform:scale(1.08)}
      .process-step__icon{display:grid;place-items:center;width:48%;height:48%;transform:translateZ(0);transition:transform .45s cubic-bezier(.18,.8,.22,1),filter .35s ease}
      .process-step__icon svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 8px 14px rgba(78,9,17,.10))}
      .process-step__orb:hover .process-step__icon,.process-step__orb:focus-visible .process-step__icon{transform:scale(1.14) rotate(-3deg);filter:drop-shadow(0 12px 18px rgba(78,9,17,.18))}
      .process-step:nth-child(2) .process-step__orb:hover .process-step__icon{transform:scale(1.14) rotate(3deg)}
      .process-step:nth-child(3) .process-step__orb:hover .process-step__icon{animation:processGearPulse 1.1s ease-in-out infinite alternate}
      .process-step:nth-child(4) .process-step__orb:hover .process-step__icon{animation:processRocket 1s ease-in-out infinite alternate}
      .process-step:nth-child(5) .process-step__orb:hover .process-step__icon{animation:processSpin 2.6s linear infinite}
      .process-step__content{padding-top:18px}
      .process-step__content h3{margin:0;color:#2F2420;font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.1rem,1.55vw,1.55rem);font-weight:500;line-height:1.2}
      .process-step__content h3 span{color:#C8A56A;font-weight:700}
      .process-step__content p{max-width:230px;margin:10px auto 0;color:#5E4C45;font-size:clamp(.84rem,1vw,.98rem);line-height:1.5}
      .process-connector{position:absolute;z-index:1;top:50%;left:calc(50% + clamp(75px,7.1vw,112px));right:calc(-50% + clamp(75px,7.1vw,112px));height:22px;transform:translateY(-50%);pointer-events:none}
      .process-connector__line{position:absolute;left:0;right:0;top:50%;height:1px;background:linear-gradient(90deg,rgba(47,36,32,.36),rgba(47,36,32,.58));transform:translateY(-50%)}
      .process-connector__arrow{position:absolute;right:-2px;top:50%;color:#493B37;font-size:2.15rem;font-weight:300;line-height:1;transform:translateY(-54%)}
      .process-connector__flow{position:absolute;top:50%;left:0;width:46px;height:3px;border-radius:999px;background:linear-gradient(90deg,transparent,#C8A56A,#762630,transparent);filter:drop-shadow(0 0 5px rgba(118,38,48,.24));transform:translateY(-50%);animation:processFlow 2.15s cubic-bezier(.4,0,.2,1) infinite}
      .process-step:hover .process-connector__flow,.process-step:focus-within .process-connector__flow{animation-duration:1s}
      .process-step.is-pointer-active .process-step__orb{transform:translateY(-8px) scale(1.055) rotateX(var(--tilt-y,0deg)) rotateY(var(--tilt-x,0deg))}
      @keyframes processFlow{0%{left:-12%;opacity:0}15%{opacity:1}75%{opacity:1}100%{left:88%;opacity:0}}
      @keyframes processGearPulse{from{transform:scale(1.08) rotate(-4deg)}to{transform:scale(1.17) rotate(4deg)}}
      @keyframes processRocket{from{transform:translate(-3px,4px) scale(1.1) rotate(-4deg)}to{transform:translate(5px,-6px) scale(1.16) rotate(-1deg)}}
      @keyframes processSpin{to{transform:scale(1.12) rotate(360deg)}}
      @media(max-width:1180px){.process-timeline{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:54px}.process-step:nth-child(3) .process-connector,.process-step:nth-child(5) .process-connector{display:none}.process-step__visual{min-height:190px}}
      @media(max-width:760px){.process-section__intro{margin-bottom:48px}.process-section__intro h2{font-size:clamp(2.5rem,12vw,4.1rem)}.process-timeline{grid-template-columns:1fr;gap:0}.process-step{display:grid;grid-template-columns:116px minmax(0,1fr);gap:22px;align-items:center;text-align:left;padding:16px 0 40px}.process-step__visual{min-height:116px}.process-step__orb{width:112px}.process-step__content{padding:0}.process-step__content p{max-width:none;margin-left:0}.process-connector{display:block!important;top:auto;left:55px;right:auto;bottom:-5px;width:2px;height:34px;transform:none}.process-connector__line{left:0;right:auto;top:0;width:1px;height:100%;transform:none}.process-connector__arrow{right:auto;left:-8px;top:auto;bottom:-15px;transform:rotate(90deg);font-size:1.7rem}.process-connector__flow{top:0;left:-1px;width:3px;height:16px;transform:none;animation:processFlowVertical 1.8s ease-in-out infinite}.process-step:last-child{padding-bottom:0}}
      @keyframes processFlowVertical{0%{top:-10%;opacity:0}20%{opacity:1}80%{opacity:1}100%{top:88%;opacity:0}}
      @media(prefers-reduced-motion:reduce){.process-step{opacity:1;transform:none;transition:none}.process-step__orb,.process-step__icon,.process-step__halo{transition:none!important}.process-connector__flow,.process-step__icon{animation:none!important}.process-step.is-pointer-active .process-step__orb{transform:none}}
    `;
    document.head.appendChild(style);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add("is-inview");
        currentObserver.unobserve(section);
      });
    }, { threshold: 0.18 });
    observer.observe(section);
  } else {
    section.classList.add("is-inview");
  }

  if (!reduceMotion) {
    section.querySelectorAll("[data-process-step]").forEach((step) => {
      const orb = step.querySelector(".process-step__orb");
      if (!orb) return;

      orb.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const rect = orb.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        step.style.setProperty("--tilt-x", `${x * 7}deg`);
        step.style.setProperty("--tilt-y", `${y * -7}deg`);
        step.classList.add("is-pointer-active");
      });

      orb.addEventListener("pointerleave", () => {
        step.classList.remove("is-pointer-active");
        step.style.removeProperty("--tilt-x");
        step.style.removeProperty("--tilt-y");
      });
    });
  }
})();
