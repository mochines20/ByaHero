(() => {
  const form = document.getElementById("projectForm");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const successCard = document.getElementById("successCard");
  const summaryBox = document.getElementById("summaryBox");
  const newEntryBtn = document.getElementById("newEntryBtn");
  const complexity = document.getElementById("complexity");
  const complexityOut = document.getElementById("complexityOut");

  const dropZone = document.getElementById("dropZone");
  const attachmentsInput = document.getElementById("attachments");
  const attachmentsError = document.getElementById("attachmentsError");
  const fileList = document.getElementById("fileList");

  const featureTagInput = document.getElementById("featureTagInput");
  const tagList = document.getElementById("tagList");

  const textareas = [
    ["vision", "visionCount", 280],
    ["painPoints", "painPointsCount", 400],
    ["integrations", "integrationsCount", 240],
    ["inspiration", "inspirationCount", 220],
    ["uniqueAngle", "uniqueAngleCount", 320],
    ["notes", "notesCount", 300],
  ];

  const requiredFields = [
    "projectName",
    "email",
    "role",
    "vision",
    "userGroup",
    "ageRange",
    "mvpPriority",
    "techStack",
    "designVibe",
    "monetization",
    "budget",
    "timeline",
    "painPoints",
    "uniqueAngle",
  ];

  const errorMap = {
    projectName: "Project name is required.",
    email: "Enter a valid email address.",
    role: "Please select your role.",
    vision: "Vision statement is required.",
    userGroup: "Target user group is required.",
    ageRange: "Please choose an age range.",
    mvpPriority: "Pick an MVP priority.",
    techStack: "Tech stack is required.",
    designVibe: "Design vibe is required.",
    monetization: "Select monetization strategy.",
    budget: "Enter a valid numeric budget in PHP.",
    timeline: "Pick a target timeline.",
    painPoints: "List at least one major pain point.",
    uniqueAngle: "Unique angle is required.",
    features: "Select at least 3 core features.",
    platform: "Select one platform target.",
  };

  const state = {
    files: [],
    tags: [],
  };

  function escapeHtml(str) {
    return str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setError(name, message) {
    const errorEl = document.getElementById(`${name}Error`);
    const field = document.getElementById(name);

    if (!errorEl) return;
    errorEl.textContent = message || "";

    if (field) {
      const wrapper = field.closest(".field") || field.parentElement;
      if (wrapper) {
        wrapper.classList.toggle("error-state", Boolean(message));
      }
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function setGroupError(id, hasError) {
    const errorEl = document.getElementById(`${id}Error`);
    if (!errorEl) return;
    errorEl.textContent = hasError ? errorMap[id] : "";
  }

  function updateTextareaCounter(id, outId, max) {
    const el = document.getElementById(id);
    const out = document.getElementById(outId);
    if (!el || !out) return;
    out.textContent = `${el.value.length}/${max}`;
  }

  function validateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;

    const value = el.value.trim();
    let valid = true;

    if (el.hasAttribute("required") && !value) {
      valid = false;
    }

    if (id === "email" && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    if (id === "budget" && value) {
      valid = /^[0-9]+$/.test(value);
    }

    setError(id, valid ? "" : errorMap[id]);
    return valid;
  }

  function validateFeatures() {
    const checked = form.querySelectorAll('input[name="features"]:checked').length;
    const ok = checked >= 3;
    setGroupError("features", !ok);
    return ok;
  }

  function validatePlatform() {
    const chosen = form.querySelector('input[name="platform"]:checked');
    const ok = Boolean(chosen);
    setGroupError("platform", !ok);
    return ok;
  }

  function updateLegacySelectedStates() {
    if (CSS.supports("selector(:has(*))")) return;

    const chips = form.querySelectorAll(".chip");
    chips.forEach((chip) => {
      const input = chip.querySelector("input[type='checkbox']");
      chip.classList.toggle("is-selected", Boolean(input && input.checked));
    });

    const radios = form.querySelectorAll(".radio");
    radios.forEach((radio) => {
      const input = radio.querySelector("input[type='radio']");
      radio.classList.toggle("is-selected", Boolean(input && input.checked));
    });
  }

  function completionScore() {
    let completed = 0;
    const total = requiredFields.length + 2;

    requiredFields.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.value.trim()) completed += 1;
    });

    if (form.querySelectorAll('input[name="features"]:checked').length >= 3) completed += 1;
    if (form.querySelector('input[name="platform"]:checked')) completed += 1;

    return Math.round((completed / total) * 100);
  }

  function updateProgress() {
    const pct = completionScore();
    progressBar.style.width = `${pct}%`;
    progressText.textContent = `${pct}%`;
    const progressEl = progressBar.parentElement;
    if (progressEl) {
      progressEl.setAttribute("aria-valuenow", String(pct));
    }
  }

  function renderFiles() {
    fileList.innerHTML = "";
    state.files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      fileList.appendChild(li);
    });
  }

  function addFiles(fileLikeList) {
    attachmentsError.textContent = "";
    const incoming = Array.from(fileLikeList || []);
    const tooLarge = incoming.find((f) => f.size > 10 * 1024 * 1024);

    if (tooLarge) {
      attachmentsError.textContent = `"${tooLarge.name}" exceeds 10MB.`;
      return;
    }

    const merged = [...state.files];
    incoming.forEach((f) => {
      const exists = merged.some((m) => m.name === f.name && m.size === f.size);
      if (!exists) merged.push(f);
    });

    state.files = merged;
    renderFiles();
  }

  function parseTags(raw) {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function renderTags() {
    tagList.innerHTML = "";
    state.tags.forEach((tag) => {
      const wrapper = document.createElement("span");
      wrapper.className = "tag";
      wrapper.innerHTML = `${escapeHtml(tag)} <button type="button" aria-label="Remove ${escapeHtml(tag)}">×</button>`;
      const btn = wrapper.querySelector("button");
      btn?.addEventListener("click", () => {
        state.tags = state.tags.filter((t) => t !== tag);
        renderTags();
      });
      tagList.appendChild(wrapper);
    });
  }

  function addTagInput(value) {
    const tags = parseTags(value);
    tags.forEach((tag) => {
      const normalized = tag.toLowerCase();
      if (!state.tags.some((t) => t.toLowerCase() === normalized) && state.tags.length < 15) {
        state.tags.push(tag);
      }
    });
    renderTags();
  }

  function gatherData() {
    const features = Array.from(form.querySelectorAll('input[name="features"]:checked')).map((x) => x.value);
    const platform = form.querySelector('input[name="platform"]:checked')?.value || "";

    return {
      projectName: form.projectName.value.trim(),
      email: form.email.value.trim(),
      role: form.role.value,
      vision: form.vision.value.trim(),
      userGroup: form.userGroup.value.trim(),
      ageRange: form.ageRange.value,
      painPoints: form.painPoints.value.trim(),
      features,
      mvpPriority: form.mvpPriority.value,
      customTags: [...state.tags],
      platform,
      techStack: form.techStack.value.trim(),
      designVibe: form.designVibe.value,
      complexity: form.complexity.value,
      integrations: form.integrations.value.trim(),
      monetization: form.monetization.value,
      budget: form.budget.value.trim(),
      timeline: form.timeline.value,
      competitors: form.competitors.value.trim(),
      inspiration: form.inspiration.value.trim(),
      uniqueAngle: form.uniqueAngle.value.trim(),
      notes: form.notes.value.trim(),
      attachments: state.files.map((f) => f.name),
    };
  }

  function createSummary(data) {
    const lines = [
      `Title: ${data.projectName}`,
      `Tagline: Bawat commuter, bayani ng sariling byahe.`,
      `Contact: ${data.email} (${data.role})`,
      `User Group: ${data.userGroup} | Age: ${data.ageRange}`,
      `Core Features: ${data.features.join(", ") || "N/A"}`,
      `Custom Tags: ${data.customTags.join(", ") || "N/A"}`,
      `MVP Priority: ${data.mvpPriority}`,
      `Platform: ${data.platform}`,
      `Tech Stack: ${data.techStack}`,
      `Design Vibe: ${data.designVibe}`,
      `Complexity: ${data.complexity}/5`,
      `Integrations: ${data.integrations || "N/A"}`,
      `Monetization: ${data.monetization}`,
      `Budget (PHP): ${data.budget}`,
      `Timeline: ${data.timeline}`,
      `Competitors: ${data.competitors || "N/A"}`,
      `Vision: ${data.vision}`,
      `Pain Points: ${data.painPoints}`,
      `Unique Angle: ${data.uniqueAngle}`,
      `Inspiration: ${data.inspiration || "N/A"}`,
      `Notes: ${data.notes || "N/A"}`,
      `Files: ${data.attachments.join(", ") || "None"}`,
    ];

    return lines.join("\n");
  }

  function validateAll() {
    let ok = true;

    requiredFields.forEach((id) => {
      const valid = validateField(id);
      if (!valid) ok = false;
    });

    if (!validateFeatures()) ok = false;
    if (!validatePlatform()) ok = false;

    return ok;
  }

  function resetState() {
    state.files = [];
    state.tags = [];
    renderFiles();
    renderTags();
    attachmentsError.textContent = "";
    Object.keys(errorMap).forEach((id) => {
      const errorEl = document.getElementById(`${id}Error`);
      if (errorEl) errorEl.textContent = "";
    });

    requiredFields.forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      const wrapper = field.closest(".field") || field.parentElement;
      wrapper?.classList.remove("error-state");
      field.removeAttribute("aria-invalid");
    });

    textareas.forEach(([id, outId, max]) => updateTextareaCounter(id, outId, max));
    complexityOut.textContent = complexity.value;
    updateLegacySelectedStates();
    updateProgress();
  }

  textareas.forEach(([id, outId, max]) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      updateTextareaCounter(id, outId, max);
      validateField(id);
      updateProgress();
    });

    updateTextareaCounter(id, outId, max);
  });

  requiredFields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const eventName = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, () => {
      validateField(id);
      updateProgress();
    });

    el.addEventListener("blur", () => validateField(id));
  });

  form.querySelectorAll('input[name="features"]').forEach((input) => {
    input.addEventListener("change", () => {
      validateFeatures();
      updateLegacySelectedStates();
      updateProgress();
    });
  });

  form.querySelectorAll('input[name="platform"]').forEach((input) => {
    input.addEventListener("change", () => {
      validatePlatform();
      updateLegacySelectedStates();
      updateProgress();
    });
  });

  complexity.addEventListener("input", () => {
    complexityOut.textContent = complexity.value;
  });

  featureTagInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTagInput(featureTagInput.value);
      featureTagInput.value = "";
    }
  });

  featureTagInput.addEventListener("blur", () => {
    if (featureTagInput.value.trim()) {
      addTagInput(featureTagInput.value);
      featureTagInput.value = "";
    }
  });

  dropZone.addEventListener("click", () => attachmentsInput.click());
  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      attachmentsInput.click();
    }
  });

  ["dragenter", "dragover"].forEach((type) => {
    dropZone.addEventListener(type, (e) => {
      e.preventDefault();
      dropZone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((type) => {
    dropZone.addEventListener(type, (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragging");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (!dt) return;
    addFiles(dt.files);
  });

  attachmentsInput.addEventListener("change", () => {
    addFiles(attachmentsInput.files);
    attachmentsInput.value = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = validateAll();
    if (!isValid) {
      const firstError = form.querySelector(".error:not(:empty)");
      if (firstError) {
        const targetId = firstError.id.replace("Error", "");
        const target = document.getElementById(targetId);
        target?.focus();
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    setTimeout(() => {
      const data = gatherData();
      const summary = createSummary(data);
      summaryBox.textContent = summary;

      form.classList.add("hidden");
      successCard.classList.remove("hidden");
      successCard.scrollIntoView({ behavior: "smooth", block: "start" });

      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }, 600);
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    resetState();
  });

  newEntryBtn.addEventListener("click", () => {
    successCard.classList.add("hidden");
    form.classList.remove("hidden");
    form.reset();
    resetState();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateLegacySelectedStates();
  updateProgress();
})();
