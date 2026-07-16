/* =========================================================
   TIMELINE RAIL — scrollspy for the main site's signature element
   ========================================================= */
(function () {
  const dots = document.querySelectorAll(".rail-dot");
  if (!dots.length) return;

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const targets = Array.from(dots)
    .map((dot) => document.getElementById(dot.dataset.target))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const dot = document.querySelector(
          `.rail-dot[data-target="${entry.target.id}"]`
        );
        if (!dot) return;
        if (entry.isIntersecting) {
          dots.forEach((d) => d.classList.remove("active"));
          dot.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  targets.forEach((t) => observer.observe(t));
})();

/* =========================================================
   BACKGROUND MUSIC — Rizal_bg (starts off, self-resumes if
   the browser pauses it for any reason other than the user's own click)
   ========================================================= */
const bgMusic = (function () {
  const audio = document.getElementById("site-bg-audio");
  const toggleBtn = document.getElementById("sound-toggle");
  const label = document.getElementById("sound-label");
  const icon = document.getElementById("sound-icon");

  if (!audio || !toggleBtn) return { pauseForQuiz() {}, resumeAfterQuiz() {} };

  audio.volume = 0.55;
  let userPaused = true; // starts off; only true user clicks change this

  function updateUI() {
    const isOn = !audio.paused;
    label.textContent = isOn ? "Music: on" : "Music: off";
    icon.textContent = isOn ? "♫" : "♪";
    toggleBtn.setAttribute("aria-pressed", String(isOn));
  }

  function tryPlay() {
    audio.play().catch(() => {});
  }

  audio.addEventListener("play", updateUI);
  audio.addEventListener("pause", () => {
    updateUI();
    // If the browser paused it on its own (not the user clicking the
    // button), quietly start it right back up.
    if (!userPaused) {
      tryPlay();
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (audio.paused) {
      userPaused = false;
      tryPlay();
    } else {
      userPaused = true;
      audio.pause();
    }
  });

  updateUI();

  return {
    pauseForQuiz() {},
    resumeAfterQuiz() {},
  };
})();
/* =========================================================
   QUIZ ENGINE — "One Day: Maria Clara"
   ========================================================= */
(function () {
  const overlay = document.getElementById("quiz-overlay");
  const card = document.getElementById("quiz-card");
  const timeLabel = document.getElementById("quiz-time");
  const backdrop = document.getElementById("quiz-backdrop");
  const marker = document.getElementById("quiz-daybar-marker");
  const launchBtn = document.getElementById("launch-quiz");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Per-node sets tracking which self-looping choices have been eliminated.
  let removedChoices = {};
  let currentNodeId = 1;
  let historyBlocked = false;

  function resetState() {
    removedChoices = {};
    currentNodeId = 1;
  }

  function bgColorFor(nodeKey) {
    // Reads the CSS custom property already scoped to .quiz-overlay
    return `var(--${nodeKey})`;
  }

  function setStageForNode(node, nodeId) {
    overlay.style.background = bgColorFor(node.bg);
    backdrop.style.backgroundImage = `url('${node.backdrop}')`;
    timeLabel.textContent = node.time;
    const pct = ((nodeId - 1) / (TOTAL_NODES - 1)) * 100;
    marker.style.top = pct + "%";
  }

  function availableChoices(node, nodeId) {
    const removedSet = removedChoices[nodeId] || new Set();
    const active = node.choices
      ? node.choices.filter((_, i) => !removedSet.has(i))
      : [];
    // Determine if the leave choice should appear (all self-looping choices removed)
    if (node.leaveChoice) {
      const loopIndices = node.choices
        .map((c, i) => (c.selfLoop ? i : null))
        .filter((i) => i !== null);
      const allLoopsRemoved = loopIndices.every((i) => removedSet.has(i));
      if (allLoopsRemoved) {
        active.push({ ...node.leaveChoice, isLeaveChoice: true });
      }
    }
    return active;
  }

  function renderNode(nodeId) {
    currentNodeId = nodeId;
    const node = QUIZ_NODES[nodeId];
    setStageForNode(node, nodeId);

    if (node.isEnd) {
      renderEndNode(node);
      return;
    }

    const choices = availableChoices(node, nodeId);

    card.innerHTML = `
      <h3>${node.title}</h3>
      <p class="quiz-narration">${node.narration}</p>
      <p class="quiz-prompt">${node.prompt}</p>
      <div class="quiz-choices"></div>
    `;

    const choiceContainer = card.querySelector(".quiz-choices");
    choices.forEach((choice) => {
      const btn = document.createElement("button");
      btn.className = "quiz-choice-btn";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => handleChoice(nodeId, node, choice));
      choiceContainer.appendChild(btn);
    });
  }

  function handleChoice(nodeId, node, choice) {
    // Show reaction + Continue
    card.innerHTML = `
      <h3>${node.title}</h3>
      <p class="quiz-reaction">${choice.reaction}</p>
      <button class="quiz-continue-btn">Continue</button>
    `;

    card.querySelector(".quiz-continue-btn").addEventListener("click", () => {
      if (choice.isLeaveChoice) {
        renderNode(choice.next);
        return;
      }
      if (choice.selfLoop) {
        // Mark this choice as eliminated and re-render the same node
        const idx = node.choices.indexOf(choice);
        if (!removedChoices[nodeId]) removedChoices[nodeId] = new Set();
        removedChoices[nodeId].add(idx);
        renderNode(nodeId);
      } else {
        renderNode(choice.next);
      }
    });
  }

  function renderEndNode(node) {
    card.innerHTML = `
      <h3>${node.title}</h3>
      <p class="quiz-narration">${node.narration}</p>
      <p class="quiz-footnote">${node.footnote}</p>
      <div class="quiz-end-actions">
        <button class="quiz-continue-btn" id="quiz-begin-again">Begin again</button>
        <button class="quiz-leave-btn" id="quiz-leave">Leave</button>
      </div>
    `;

    card.querySelector("#quiz-begin-again").addEventListener("click", () => {
      resetState();
      renderNode(1);
    });

    card.querySelector("#quiz-leave").addEventListener("click", () => {
      closeQuiz();
    });
  }

  function openQuiz() {
    resetState();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    blockHistoryBack();
    renderNode(1);
  }

  function closeQuiz() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    bgMusic.resumeAfterQuiz();
    const nextSection = document.getElementById("section-8");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }

  // Block browser back-button navigation while the quiz is open
  function blockHistoryBack() {
    if (historyBlocked) return;
    historyBlocked = true;
    history.pushState({ quiz: true }, "");
    window.addEventListener("popstate", onPopState);
  }

  function onPopState() {
    if (overlay.classList.contains("open")) {
      history.pushState({ quiz: true }, "");
    }
  }

  if (launchBtn) {
    launchBtn.addEventListener("click", openQuiz);
  }
})();
