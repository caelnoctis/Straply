// All features use vanilla JavaScript so the site can run on GitHub Pages.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const pageSections = document.querySelectorAll("main > section[id]");

  setupMobileNavbar(header, navToggle);
  setupSectionNavigation(navLinks, navToggle, pageSections);
  setupScrollReveal();
  renderWasteChart();
  setupVideoSearch();
  setupEcoSearch();
  setupProductButtons();
  setupTeamPhotos();
  setupPhotobooth();
  setupHeroParticles();
  setupHeroCounters();
  setupEcoGame();
});

function setupMobileNavbar(header, navToggle) {
  if (!header || !navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu navigasi");
    }
  });
}

function setupSectionNavigation(links, navToggle, sections) {
  if (!sections.length) return;

  document.body.classList.add("section-mode");

  const showSection = (hash, shouldUpdateHistory = true) => {
    const targetId = hash?.startsWith("#") ? hash.slice(1) : hash;
    const target = document.getElementById(targetId) || document.getElementById("home") || sections[0];

    if (!target || !Array.from(sections).includes(target)) return;

    sections.forEach((section) => {
      const isActive = section === target;
      section.classList.toggle("is-active-section", isActive);

      if (isActive) {
        section.removeAttribute("hidden");
        revealActiveSection(section);
      } else {
        section.setAttribute("hidden", "");
      }
    });

    updateActiveNavigation(target.id);
    document.body.classList.remove("nav-open");

    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Buka menu navigasi");
    }

    window.scrollTo({ top: 0, behavior: shouldUpdateHistory ? "smooth" : "auto" });

    const nextHash = `#${target.id}`;
    if (shouldUpdateHistory && window.location.hash !== nextHash) {
      history.pushState(null, "", nextHash);
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target || !Array.from(sections).includes(target)) return;

      event.preventDefault();
      showSection(href);
    });
  });

  window.addEventListener("popstate", () => {
    showSection(window.location.hash || "#home", false);
  });

  showSection(window.location.hash || "#home", false);
}

function revealActiveSection(section) {
  const revealItems = section.querySelectorAll(".reveal");
  revealItems.forEach((item) => item.classList.add("is-visible"));

  if (section.id === "plastic-facts") {
    document.querySelector(".bar-chart")?.classList.add("is-visible");
  }
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  const chart = document.querySelector(".bar-chart");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    chart?.classList.add("is-visible");
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));

  if (chart) {
    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chart.classList.add("is-visible");
          chartObserver.disconnect();
        }
      });
    }, { threshold: 0.25 });

    chartObserver.observe(chart);
  }
}

function updateActiveNavigation(activeId) {
  const menuLinks = document.querySelectorAll(".nav-links a");

  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

function renderWasteChart() {
  const chart = document.getElementById("wasteChart");
  if (!chart) return;

  const wasteData = [
    { label: "Sisa makanan", value: 40.77, color: "#45a66b" },
    { label: "Plastik", value: 20.52, color: "#63b6d9" },
    { label: "Kayu/ranting", value: 13.13, color: "#f7c948" },
    { label: "Kertas/karton", value: 11.4, color: "#7abf78" },
    { label: "Logam", value: 3.11, color: "#b8a07e" },
    { label: "Kain", value: 2.51, color: "#c9a0dc" },
    { label: "Kaca", value: 2.39, color: "#8ecae6" },
    { label: "Lainnya", value: 6.17, color: "#9fb7c8" }
  ];

  chart.innerHTML = wasteData.map((item) => {
    const height = `${Math.min(item.value * 2, 100)}%`;

    return `
      <div class="chart-bar">
        <span class="bar-label">${item.label}</span>
        <span class="bar-track" aria-hidden="true">
          <span class="bar-fill" style="--bar-height: ${height}; --bar-color: ${item.color};"></span>
        </span>
        <span class="bar-value">${item.value}%</span>
      </div>
    `;
  }).join("");
}

function setupVideoSearch() {
  const input = document.getElementById("videoSearch");
  const cards = document.querySelectorAll(".video-card");
  const resultCount = document.getElementById("videoResultCount");

  if (!input || !cards.length || !resultCount) return;

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const title = card.dataset.title?.toLowerCase() || "";
      const category = card.dataset.category?.toLowerCase() || "";
      const isMatch = title.includes(keyword) || category.includes(keyword);

      card.classList.toggle("is-hidden", !isMatch);
      if (isMatch) visibleCount += 1;
    });

    resultCount.textContent = visibleCount
      ? `${visibleCount} video ditemukan`
      : "Tidak ada video yang cocok";
  });
}

function setupEcoSearch() {
  const form = document.getElementById("ecoSearchForm");
  const input = document.getElementById("ecoQuery");
  const message = document.getElementById("ecoMessage");

  if (!form || !input || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = input.value.trim();

    if (!keyword) {
      message.textContent = "Masukkan kata kunci terlebih dahulu.";
      message.className = "form-message error";
      input.focus();
      return;
    }

    message.textContent = "Mengarahkan ke Ecosia...";
    message.className = "form-message success";

    const url = `https://www.ecosia.org/search?q=${encodeURIComponent(keyword)}`;
    window.location.href = url;
  });
}

function setupProductButtons() {
  const buttons = document.querySelectorAll(".product-btn");
  const notice = document.getElementById("productNotice");

  if (!buttons.length || !notice) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product || "Produk";
      notice.textContent = `${productName} dibuat dari rajutan tangan yang reusable, ringan, dan cocok untuk membawa tumbler tanpa kantong plastik sekali pakai.`;
    });
  });
}

function setupPhotobooth() {
  const video      = document.getElementById("photoboothVideo");
  const cameraStage = document.getElementById("cameraStage") || video?.closest(".camera-stage");
  const cameraOverlay = document.getElementById("cameraOverlay"); // may be null — safe
  const startButton   = document.getElementById("startCameraBtn");
  const captureButton = document.getElementById("capturePhotoBtn");
  const resetButton   = document.getElementById("resetPhotosBtn");
  const downloadButton = document.getElementById("downloadBoothBtn");
  const statusEl   = document.getElementById("photoboothStatus");
  const canvas     = document.getElementById("photoboothCanvas");
  const photoSlots = document.getElementById("photoSlots");

  if (!video || !cameraStage || !startButton || !captureButton || !resetButton || !downloadButton || !statusEl || !canvas || !photoSlots) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  /* ── layouts ── */
  const layouts = {
    "3x1": { label: "Strip 3",  rows: 3, cols: 1, count: 3, width: 900,  height: 1800 },
    "2x2": { label: "Grid 2×2", rows: 2, cols: 2, count: 4, width: 1400, height: 1600 },
    "3x2": { label: "Grid 3×2", rows: 3, cols: 2, count: 6, width: 1400, height: 1900 }
  };

  /* ── themes — keys match HTML radio values: nature / sunset / ocean ── */
  const themes = {
    nature: {
      name: "Nature Vines",
      bg: "#e8f5e9", bg2: "#f1f8e9",
      cardBg: "#ffffff",
      border: "#2e7d32", accent: "#66bb6a", accent2: "#a5d6a7",
      highlight: "#f9fbe7", ink: "#1b5e20", muted: "#388e3c",
      photoFrame: "#c8e6c9"
    },
    sunset: {
      name: "Sunset Craft",
      bg: "#fff8e1", bg2: "#fce4ec",
      cardBg: "#fffde7",
      border: "#e65100", accent: "#ffb300", accent2: "#ff8a65",
      highlight: "#fff9c4", ink: "#bf360c", muted: "#e64a19",
      photoFrame: "#ffe0b2"
    },
    ocean: {
      name: "Ocean Drift",
      bg: "#e0f7fa", bg2: "#e8eaf6",
      cardBg: "#f0fdff",
      border: "#006064", accent: "#0097a7", accent2: "#80deea",
      highlight: "#e0f2f1", ink: "#004d40", muted: "#00838f",
      photoFrame: "#b2ebf2"
    }
  };

  let cameraStream   = null;
  let capturedPhotos = [];

  /* ── helpers ── */
  const getLayout = () => {
    const v = document.querySelector('input[name="boothLayout"]:checked')?.value;
    return layouts[v] || layouts["3x1"];
  };
  const getTheme = () => {
    const v = document.querySelector('input[name="boothFrame"]:checked')?.value;
    return themes[v] || themes.nature;
  };
  const getStickerPacks = () =>
    Array.from(document.querySelectorAll(".sticker-check input:checked"))
      .map(i => i.dataset.sticker).filter(Boolean);

  const setStatus = (msg, type = "") => {
    statusEl.textContent = msg;
    statusEl.className = type ? `photobooth-status ${type}` : "photobooth-status";
  };

  const updateButtons = () => {
    const layout = getLayout();
    captureButton.disabled = !cameraStream || capturedPhotos.length >= layout.count;
    downloadButton.disabled = capturedPhotos.length === 0;
  };

  const updateSlots = () => {
    const layout = getLayout();
    photoSlots.innerHTML = Array.from({ length: layout.count }, (_, i) =>
      `<span class="photo-slot${i < capturedPhotos.length ? " is-filled" : ""}">${i + 1}</span>`
    ).join("");
  };

  /* Set camera stage aspect ratio to exactly match a single photo slot */
  const updateCameraAspectRatio = () => {
    const layout = getLayout();
    const margin = layout.cols === 1 ? 72 : 60;
    const headerHeight = layout.cols === 1 ? 160 : 140;
    const footerHeight = layout.cols === 1 ? 130 : 110;
    const gap = layout.cols === 1 ? 38 : 30;
    const usableWidth = layout.width - margin * 2 - gap * (layout.cols - 1);
    const usableHeight = layout.height - margin * 2 - headerHeight - footerHeight - gap * (layout.rows - 1);
    const cardWidth = usableWidth / layout.cols;
    const cardHeight = usableHeight / layout.rows;
    
    const pad = Math.max(16, cardWidth * 0.048);
    const bottomPad = Math.max(64, cardHeight * 0.18);
    const photoW = cardWidth - pad * 2;
    const photoH = cardHeight - pad - bottomPad;
    
    const photoAR = photoW / photoH;
    cameraStage.style.setProperty("--camera-aspect-ratio", `${photoAR}`);
    
    // Clear any existing grid overlay
    if (cameraOverlay) {
        cameraOverlay.style.backgroundImage = "none";
    }
  };

  const refreshBooth = () => {
    const layout = getLayout();
    if (capturedPhotos.length > layout.count)
      capturedPhotos = capturedPhotos.slice(0, layout.count);
    renderPhotoboothCanvas(ctx, canvas, layout, getTheme(), getStickerPacks(), capturedPhotos);
    updateSlots();
    updateButtons();
    if (cameraStream) updateCameraAspectRatio();
  };

  /* ── camera ── */
  const stopCamera = () => {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
    video.srcObject = null;
    cameraStage.classList.remove("is-camera-on");
    cameraStage.style.removeProperty("--camera-aspect-ratio");
    if (cameraOverlay) cameraOverlay.style.backgroundImage = "none";
    startButton.textContent = "📷 Nyalakan Kamera";
    setStatus("Kamera dimatikan.");
    updateButtons();
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Browser ini belum mendukung kamera.", "error"); return;
    }
    try {
      const portrait = window.innerWidth <= 860 && window.matchMedia("(orientation:portrait)").matches;
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: portrait ? 720 : 1280 }, height: { ideal: portrait ? 1280 : 720 } },
        audio: false
      });
      video.srcObject = cameraStream;
      await video.play();
      cameraStage.classList.add("is-camera-on");
      startButton.textContent = "⏹ Matikan Kamera";
      const layout = getLayout();
      setStatus(`Kamera aktif — foto ${capturedPhotos.length + 1}/${layout.count} siap!`, "success");
      updateButtons();
      updateCameraAspectRatio();
    } catch (err) {
      setStatus("Kamera tidak bisa diakses. Izinkan akses kamera lalu coba lagi.", "error");
      cameraStream = null;
      updateButtons();
    }
  };

  /* ── capture ── */
  const capturePhoto = () => {
    const layout = getLayout();
    if (!cameraStream) { setStatus("Nyalakan kamera dulu!", "error"); return; }
    if (!video.videoWidth || !video.videoHeight) { setStatus("Kamera belum siap, tunggu sebentar.", "error"); return; }
    if (capturedPhotos.length >= layout.count) {
      setStatus("Semua slot terisi. Klik Reset untuk mulai lagi.", "success"); return;
    }

    /* flash */
    cameraStage.style.filter = "brightness(2.5)";
    setTimeout(() => { cameraStage.style.filter = ""; }, 130);

    /* crop video to photo slot aspect ratio so photo exactly matches preview */
    const margin = layout.cols === 1 ? 72 : 60;
    const headerHeight = layout.cols === 1 ? 160 : 140;
    const footerHeight = layout.cols === 1 ? 130 : 110;
    const gap = layout.cols === 1 ? 38 : 30;
    const usableWidth = layout.width - margin * 2 - gap * (layout.cols - 1);
    const usableHeight = layout.height - margin * 2 - headerHeight - footerHeight - gap * (layout.rows - 1);
    const cardWidth = usableWidth / layout.cols;
    const cardHeight = usableHeight / layout.rows;
    const pad = Math.max(16, cardWidth * 0.048);
    const bottomPad = Math.max(64, cardHeight * 0.18);
    const photoAR = (cardWidth - pad * 2) / (cardHeight - pad - bottomPad);

    const vW = video.videoWidth, vH = video.videoHeight;
    let sx = 0, sy = 0, sw = vW, sh = vH;
    if (vW / vH > photoAR) { sw = vH * photoAR; sx = (vW - sw) / 2; }
    else                   { sh = vW / photoAR; sy = (vH - sh) / 2; }

    const shot = document.createElement("canvas");
    shot.width  = Math.round(sw);
    shot.height = Math.round(sh);
    const sctx = shot.getContext("2d");
    if (!sctx) return;
    /* mirror (selfie) */
    sctx.translate(shot.width, 0);
    sctx.scale(-1, 1);
    sctx.drawImage(video, sx, sy, sw, sh, 0, 0, shot.width, shot.height);

    const img = new Image();
    img.onload = () => {
      capturedPhotos.push(img);
      refreshBooth();
      const done = capturedPhotos.length >= layout.count;
      setStatus(
        done ? `✅ ${layout.label} lengkap — klik Download!`
             : `Foto ${capturedPhotos.length + 1}/${layout.count} siap diambil.`,
        done ? "success" : ""
      );
    };
    img.src = shot.toDataURL("image/jpeg", 0.92);
  };

  /* ── events ── */
  startButton.addEventListener("click", () => cameraStream ? stopCamera() : startCamera());
  captureButton.addEventListener("click", capturePhoto);
  resetButton.addEventListener("click", () => {
    capturedPhotos = [];
    refreshBooth();
    const layout = getLayout();
    setStatus(cameraStream ? `Foto 1/${layout.count} siap diambil.` : "Pilih frame & layout, lalu nyalakan kamera.");
  });
  downloadButton.addEventListener("click", () => {
    if (!capturedPhotos.length) return;
    const theme  = getTheme();
    const layout = getLayout();
    const link   = document.createElement("a");
    link.download = `eco-photobooth-${theme.name.toLowerCase().replace(/\s+/g,"-")}-${layout.label}.png`;
    link.href     = canvas.toDataURL("image/png");
    link.click();
    setStatus("🌿 Foto berhasil di-download!", "success");
  });
  document.querySelectorAll('input[name="boothLayout"], input[name="boothFrame"], .sticker-check input')
    .forEach(inp => inp.addEventListener("change", () => {
      refreshBooth();
      const layout = getLayout();
      setStatus(`${capturedPhotos.length}/${layout.count} foto — ${getTheme().name}`);
    }));
  window.addEventListener("resize", () => { if (cameraStream) updateCameraAspectRatio(); });

  /* ── init ── */
  refreshBooth();
}




function renderPhotoboothCanvas(context, canvas, layout, theme, stickerPacks, photos) {
  canvas.width = layout.width;
  canvas.height = layout.height;

  drawBoothBackground(context, canvas.width, canvas.height, theme, layout);

  const margin = layout.cols === 1 ? 72 : 60;
  const headerHeight = layout.cols === 1 ? 160 : 140;
  const footerHeight = layout.cols === 1 ? 130 : 110;
  const gap = layout.cols === 1 ? 38 : 30;
  const usableWidth = canvas.width - margin * 2 - gap * (layout.cols - 1);
  const usableHeight = canvas.height - margin * 2 - headerHeight - footerHeight - gap * (layout.rows - 1);
  const cardWidth = usableWidth / layout.cols;
  const cardHeight = usableHeight / layout.rows;

  drawBoothHeader(context, canvas.width, canvas.height, margin, headerHeight, theme, layout);

  for (let index = 0; index < layout.count; index++) {
    const col = index % layout.cols;
    const row = Math.floor(index / layout.cols);
    const x = margin + col * (cardWidth + gap);
    const y = margin + headerHeight + row * (cardHeight + gap);
    drawPolaroidCard(context, x, y, cardWidth, cardHeight, photos[index], index, theme, layout);
  }

  drawBoothStickers(context, canvas.width, canvas.height, theme, stickerPacks, layout);

  drawBoothBorderArt(context, canvas.width, canvas.height, theme, layout);

  drawBoothFooter(context, canvas.width, canvas.height, margin, theme, layout);
}

function drawBoothBackground(context, width, height, theme, layout) {
  const grad = context.createLinearGradient(0, 0, width * 0.7, height);
  grad.addColorStop(0, theme.bg);
  grad.addColorStop(0.5, "#ffffff");
  grad.addColorStop(1, theme.bg2);
  context.fillStyle = grad;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.18;
  const dotSpacing = layout.cols === 1 ? 80 : 90;
  const dotSize = layout.cols === 1 ? 7 : 8;
  for (let y = 30; y < height; y += dotSpacing) {
    for (let x = 30; x < width; x += dotSpacing) {
      context.fillStyle = (x + y) % (dotSpacing * 2) === 0 ? theme.accent : theme.accent2;
      context.beginPath();
      context.arc(x, y, dotSize, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

/* --- HEADER --- */
function drawBoothHeader(context, width, height, margin, headerHeight, theme, layout) {
  const cx = width / 2;
  const titleY = margin + 52;
  const subY = margin + 102;
  const fs1 = layout.cols === 1 ? 52 : 58;
  const fs2 = layout.cols === 1 ? 26 : 28;

  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(0,0,0,0.08)";
  context.shadowBlur = 12;
  context.shadowOffsetY = 4;
  context.fillStyle = theme.ink;
  context.font = `900 ${fs1}px 'Outfit', 'Inter', Arial, sans-serif`;
  context.fillText("Cup Holder Strap", cx, titleY);
  context.shadowBlur = 0;
  context.fillStyle = theme.muted;
  context.font = `700 ${fs2}px 'Inter', Arial, sans-serif`;
  context.fillText(`${theme.name} - ${layout.label}`, cx, subY);
  context.restore();

  context.save();
  const lineW = width * 0.38;
  const lineY = margin + 132;
  const lineGrad = context.createLinearGradient(cx - lineW / 2, 0, cx + lineW / 2, 0);
  lineGrad.addColorStop(0, "transparent");
  lineGrad.addColorStop(0.3, theme.accent);
  lineGrad.addColorStop(0.7, theme.accent2);
  lineGrad.addColorStop(1, "transparent");
  context.strokeStyle = lineGrad;
  context.lineWidth = 5;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(cx - lineW / 2, lineY);
  context.lineTo(cx + lineW / 2, lineY);
  context.stroke();
  context.restore();
}

/* --- POLAROID CARD --- */
function drawPolaroidCard(context, x, y, width, height, photo, index, theme, layout) {
  const pad = Math.max(16, width * 0.048);
  const bottomPad = Math.max(64, height * 0.18);
  const photoX = x + pad;
  const photoY = y + pad;
  const photoW = width - pad * 2;
  const photoH = height - pad - bottomPad;
  const cardRadius = Math.min(20, width * 0.05);
  const photoRadius = Math.min(14, photoW * 0.04);

  // Card drop shadow
  context.save();
  context.shadowColor = "rgba(0,0,0,0.18)";
  context.shadowBlur = 32;
  context.shadowOffsetY = 14;
  context.shadowOffsetX = 4;
  context.fillStyle = theme.cardBg;
  roundedRectPath(context, x, y, width, height, cardRadius);
  context.fill();
  context.restore();

  // Card face
  context.save();
  context.fillStyle = theme.cardBg;
  roundedRectPath(context, x, y, width, height, cardRadius);
  context.fill();
  // Top accent stripe
  context.fillStyle = theme.accent;
  roundedRectPath(context, x, y, width, 8, cardRadius);
  context.fill();
  context.restore();

  // Photo area — COVER mode (fills slot completely)
  context.save();
  roundedRectPath(context, photoX, photoY, photoW, photoH, photoRadius);
  context.clip();

  if (photo) {
    drawImageCover(context, photo, photoX, photoY, photoW, photoH);
  } else {
    const phGrad = context.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    phGrad.addColorStop(0, theme.photoFrame);
    phGrad.addColorStop(1, theme.highlight);
    context.fillStyle = phGrad;
    context.fillRect(photoX, photoY, photoW, photoH);
    context.strokeStyle = `${theme.accent}88`;
    context.lineWidth = 4;
    context.setLineDash([14, 8]);
    context.strokeRect(photoX + 10, photoY + 10, photoW - 20, photoH - 20);
    context.setLineDash([]);
    // Camera icon
    const iconSize = Math.min(photoW, photoH) * 0.22;
    const iconX = photoX + photoW / 2;
    const iconY = photoY + photoH / 2 - iconSize * 0.2;
    context.strokeStyle = theme.muted;
    context.lineWidth = Math.max(4, iconSize * 0.1);
    context.lineCap = "round";
    roundedRectPath(context, iconX - iconSize * 0.7, iconY - iconSize * 0.5, iconSize * 1.4, iconSize, iconSize * 0.12);
    context.stroke();
    context.beginPath();
    context.arc(iconX, iconY, iconSize * 0.3, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = theme.ink;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `900 ${Math.max(22, photoW * 0.1)}px 'Outfit', Arial, sans-serif`;
    context.fillText(`${index + 1}`, iconX, iconY + iconSize * 0.85);
  }
  context.restore();

  // Photo border
  context.save();
  context.strokeStyle = `${theme.border}22`;
  context.lineWidth = 3;
  roundedRectPath(context, photoX, photoY, photoW, photoH, photoRadius);
  context.stroke();
  context.restore();

  // Caption
  context.save();
  context.fillStyle = theme.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const labelFontSize = Math.max(18, Math.min(28, width * 0.055));
  
  const textY = y + height - bottomPad / 2;
  
  context.font = `900 ${labelFontSize}px 'Outfit', Arial, sans-serif`;
  context.fillText(`#${String(index + 1).padStart(2, "0")}`, x + width / 2, textY - 10);
  
  context.font = `700 ${Math.max(11, labelFontSize * 0.45)}px 'Inter', Arial, sans-serif`;
  context.fillStyle = theme.muted;
  context.fillText("LESS PLASTIC, MORE MOMENTS.", x + width / 2, textY + 12);
  context.restore();
}

/* --- DRAW IMAGE COVER (fills slot, no letterbox) --- */
function drawImageCover(context, image, x, y, width, height) {
  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;
  const scale = Math.max(width / imgW, height / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  context.drawImage(image, x + (width - drawW) / 2, y + (height - drawH) / 2, drawW, drawH);
}

/* --- BORDER ART DISPATCHER --- */
function drawBoothBorderArt(context, width, height, theme, layout) {
  const bw = layout.cols === 1 ? 16 : 18;
  if (theme.name === "Nature Vines") {
    drawNatureVinesBorder(context, width, height, theme, bw);
  } else if (theme.name === "Sunset Craft") {
    drawSunsetCraftBorder(context, width, height, theme, bw);
  } else {
    drawOceanDriftBorder(context, width, height, theme, bw);
  }
}

/* --- NATURE VINES BORDER --- */
function drawNatureVinesBorder(context, width, height, theme, bw) {
  context.save();
  context.strokeStyle = theme.border;
  context.lineWidth = bw;
  roundedRectPath(context, bw / 2, bw / 2, width - bw, height - bw, 32);
  context.stroke();
  context.strokeStyle = theme.accent2;
  context.lineWidth = 5;
  roundedRectPath(context, bw + 10, bw + 10, width - bw * 2 - 20, height - bw * 2 - 20, 24);
  context.stroke();
  context.restore();

  drawVineCorner(context, 40, 40, 1, 1, theme);
  drawVineCorner(context, width - 40, 40, -1, 1, theme);
  drawVineCorner(context, 40, height - 40, 1, -1, theme);
  drawVineCorner(context, width - 40, height - 40, -1, -1, theme);

  const positions = [
    [width * 0.25, 28], [width * 0.5, 24], [width * 0.75, 28],
    [width * 0.25, height - 28], [width * 0.5, height - 24], [width * 0.75, height - 28],
    [24, height * 0.3], [24, height * 0.5], [24, height * 0.7],
    [width - 24, height * 0.3], [width - 24, height * 0.5], [width - 24, height * 0.7]
  ];
  positions.forEach(([lx, ly], i) => drawMiniLeaf(context, lx, ly, 18 + (i % 3) * 4, i * 0.7, theme.accent, theme.accent2));
}

function drawVineCorner(context, x, y, sx, sy, theme) {
  context.save();
  context.translate(x, y);
  context.strokeStyle = theme.border;
  context.lineWidth = 5;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(0, 0);
  context.bezierCurveTo(sx * 40, sy * 20, sx * 60, sy * 60, sx * 80, sy * 40);
  context.stroke();
  context.beginPath();
  context.moveTo(0, 0);
  context.bezierCurveTo(sx * 20, sy * 40, sx * 60, sy * 60, sx * 40, sy * 80);
  context.stroke();
  drawMiniLeaf(context, sx * 80, sy * 40, 22, 0, theme.accent, theme.border);
  drawMiniLeaf(context, sx * 40, sy * 80, 20, Math.PI / 2, theme.accent2, theme.border);
  drawMiniLeaf(context, sx * 55, sy * 60, 16, Math.PI / 4, theme.accent, theme.accent2);
  context.fillStyle = theme.accent;
  [[sx * 30, sy * 20], [sx * 65, sy * 30]].forEach(([bx, by]) => {
    context.beginPath();
    context.arc(bx, by, 7, 0, Math.PI * 2);
    context.fill();
  });
  context.restore();
}

function drawMiniLeaf(context, x, y, size, angle, fill, stroke) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 2.5;
  context.beginPath();
  context.moveTo(0, -size);
  context.bezierCurveTo(size * 0.7, -size * 0.5, size * 0.7, size * 0.5, 0, size);
  context.bezierCurveTo(-size * 0.7, size * 0.5, -size * 0.7, -size * 0.5, 0, -size);
  context.fill();
  context.stroke();
  context.beginPath();
  context.moveTo(0, -size * 0.7);
  context.lineTo(0, size * 0.7);
  context.strokeStyle = stroke + "88";
  context.stroke();
  context.restore();
}

/* --- SUNSET CRAFT BORDER --- */
function drawSunsetCraftBorder(context, width, height, theme, bw) {
  context.save();
  const topGrad = context.createLinearGradient(0, 0, width, 0);
  topGrad.addColorStop(0, theme.accent);
  topGrad.addColorStop(0.5, theme.accent2);
  topGrad.addColorStop(1, theme.border);
  context.strokeStyle = topGrad;
  context.lineWidth = bw;
  roundedRectPath(context, bw / 2, bw / 2, width - bw, height - bw, 32);
  context.stroke();
  context.strokeStyle = theme.highlight;
  context.lineWidth = 4;
  context.setLineDash([18, 10]);
  roundedRectPath(context, bw + 12, bw + 12, width - bw * 2 - 24, height - bw * 2 - 24, 24);
  context.stroke();
  context.setLineDash([]);
  context.restore();

  drawSunCorner(context, 52, 52, theme);
  drawSunCorner(context, width - 52, 52, theme);
  drawSunCorner(context, 52, height - 52, theme);
  drawSunCorner(context, width - 52, height - 52, theme);
  [width * 0.25, width * 0.5, width * 0.75].forEach((fx) => {
    drawDaisyFlower(context, fx, 30, 20, theme.accent, theme.accent2, theme.highlight);
    drawDaisyFlower(context, fx, height - 30, 20, theme.accent2, theme.accent, theme.highlight);
  });
}

function drawSunCorner(context, x, y, theme) {
  context.save();
  context.translate(x, y);
  context.strokeStyle = theme.accent;
  context.lineWidth = 5;
  context.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    context.beginPath();
    context.moveTo(Math.cos(a) * 18, Math.sin(a) * 18);
    context.lineTo(Math.cos(a) * 34, Math.sin(a) * 34);
    context.stroke();
  }
  context.fillStyle = theme.accent;
  context.beginPath();
  context.arc(0, 0, 14, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = theme.highlight;
  context.beginPath();
  context.arc(0, 0, 8, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawDaisyFlower(context, x, y, size, petalColor, centerColor, highlight) {
  context.save();
  context.translate(x, y);
  for (let i = 0; i < 8; i++) {
    context.rotate(Math.PI / 4);
    context.fillStyle = petalColor;
    context.beginPath();
    context.ellipse(0, -size * 0.65, size * 0.28, size * 0.5, 0, 0, Math.PI * 2);
    context.fill();
  }
  context.fillStyle = centerColor;
  context.beginPath();
  context.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = highlight;
  context.beginPath();
  context.arc(-size * 0.07, -size * 0.07, size * 0.1, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/* --- OCEAN DRIFT BORDER --- */
function drawOceanDriftBorder(context, width, height, theme, bw) {
  context.save();
  context.strokeStyle = theme.border;
  context.lineWidth = bw;
  roundedRectPath(context, bw / 2, bw / 2, width - bw, height - bw, 32);
  context.stroke();
  context.strokeStyle = theme.accent2;
  context.lineWidth = 5;
  roundedRectPath(context, bw + 10, bw + 10, width - bw * 2 - 20, height - bw * 2 - 20, 24);
  context.stroke();
  context.restore();

  drawWaveBand(context, 0, 0, width, bw + 20, theme, true);
  drawWaveBand(context, 0, height - bw - 20, width, bw + 20, theme, false);

  drawCoralCluster(context, 40, 50, theme);
  drawCoralCluster(context, width - 40, 50, theme);
  drawCoralCluster(context, 40, height - 50, theme);
  drawCoralCluster(context, width - 40, height - 50, theme);

  [[22, height * 0.3], [22, height * 0.5], [22, height * 0.7],
   [width - 22, height * 0.3], [width - 22, height * 0.5], [width - 22, height * 0.7]
  ].forEach(([bx, by], i) => {
    const r = 6 + (i % 3) * 3;
    context.save();
    context.strokeStyle = theme.accent2;
    context.lineWidth = 3;
    context.globalAlpha = 0.65;
    context.beginPath();
    context.arc(bx, by, r, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  });
}

function drawWaveBand(context, x, y, width, height, theme, flip) {
  context.save();
  context.fillStyle = `${theme.accent}28`;
  const waveH = height * 0.6;
  const segments = Math.ceil(width / 80);
  context.beginPath();
  for (let i = 0; i <= segments; i++) {
    const wx = x + (i / segments) * width;
    const wy = flip ? y + waveH * (i % 2 === 0 ? 0.4 : 1) : y + height - waveH * (i % 2 === 0 ? 0.4 : 1);
    if (i === 0) context.moveTo(wx, wy);
    else context.lineTo(wx, wy);
  }
  context.lineTo(x + width, flip ? y + height : y);
  context.closePath();
  context.fill();
  context.restore();
}

function drawCoralCluster(context, x, y, theme) {
  context.save();
  context.translate(x, y);
  for (let i = 0; i < 5; i++) {
    const angle = ((i / 5) * Math.PI) - Math.PI / 2;
    const len = 22 + (i % 2) * 14;
    context.strokeStyle = i % 2 === 0 ? theme.accent : theme.accent2;
    context.lineWidth = 5 - i * 0.4;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
    context.stroke();
    context.fillStyle = i % 2 === 0 ? theme.muted : theme.accent;
    context.beginPath();
    context.arc(Math.cos(angle) * len, Math.sin(angle) * len, 5, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

/* --- STICKERS --- */
function drawBoothStickers(context, width, height, theme, stickerPacks, layout) {
  drawWashiTape(context, 62, 56, 160, 44, -0.2, theme.accent);
  drawWashiTape(context, width - 222, 56, 160, 44, 0.2, theme.accent2);
  drawWashiTape(context, 58, height - 102, 160, 44, 0.18, theme.accent2);
  drawWashiTape(context, width - 218, height - 102, 160, 44, -0.18, theme.accent);

  if (stickerPacks.includes("eco")) {
    drawMiniLeaf(context, 100, layout.cols === 1 ? 200 : 180, 34, 0.4, theme.accent, theme.border);
    drawMiniLeaf(context, width - 100, height - 200, 38, -0.3, theme.accent2, theme.border);
    drawStickerPill(context, width - 360, 130, 240, 60, "\ud83c\udf31 LESS PLASTIC", theme.bg, theme.ink);
    drawStickerPill(context, 80, height - 220, 260, 60, "\u267b\ufe0f REUSE & LOVE", theme.bg2, theme.ink);
  }

  if (stickerPacks.includes("sweet")) {
    drawDaisyFlower(context, width - 110, layout.cols === 1 ? 230 : 200, 32, theme.accent, theme.accent2, "#fff");
    drawDaisyFlower(context, 112, height - 270, 28, theme.accent2, theme.accent, "#fff");
    drawHeartSticker(context, 98, layout.cols === 1 ? 310 : 280, 30, theme.accent);
    drawHeartSticker(context, width - 92, height - 320, 28, theme.accent2);
  }

  if (stickerPacks.includes("spark")) {
    drawSparkle(context, 72, 100, 24, theme.ink);
    drawSparkle(context, width - 74, 116, 28, theme.ink);
    drawSparkle(context, width - 110, height - 190, 24, theme.border);
    drawStickerPill(context, width / 2 - 110, height - 80, 220, 52, "\u2746 Eco Education \u2746", theme.accent2, theme.ink);
  }
}

/* --- FOOTER --- */
function drawBoothFooter(context, width, height, margin, theme, layout) {
  context.save();
  context.fillStyle = theme.ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `800 ${layout.cols === 1 ? 26 : 28}px 'Inter', Arial, sans-serif`;
  context.globalAlpha = 0.75;
  context.fillText("Less plastic, more cute moments \ud83c\udf3f", width / 2, height - margin * 0.6);
  context.restore();
}

/* --- UTILITY --- */
function roundedRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}

function drawStickerPill(context, x, y, width, height, text, fill, ink) {
  context.save();
  context.fillStyle = fill;
  context.strokeStyle = `${ink}33`;
  context.lineWidth = 3;
  context.shadowColor = "rgba(0,0,0,0.1)";
  context.shadowBlur = 8;
  context.shadowOffsetY = 3;
  roundedRectPath(context, x, y, width, height, height / 2);
  context.fill();
  context.shadowBlur = 0;
  context.shadowOffsetY = 0;
  context.stroke();
  context.fillStyle = ink;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 22px 'Inter', Arial, sans-serif";
  context.fillText(text, x + width / 2, y + height / 2 + 1);
  context.restore();
}

function drawWashiTape(context, x, y, width, height, angle, fill) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate(angle);
  context.globalAlpha = 0.78;
  context.fillStyle = fill;
  context.shadowColor = "rgba(0,0,0,0.1)";
  context.shadowBlur = 6;
  context.shadowOffsetY = 2;
  roundedRectPath(context, -width / 2, -height / 2, width, height, 10);
  context.fill();
  context.globalAlpha = 0.22;
  context.fillStyle = "#ffffff";
  for (let i = -width / 2; i < width / 2; i += 22) {
    context.fillRect(i, -height / 2, 8, height);
  }
  context.restore();
}

function drawHeartSticker(context, x, y, size, fill) {
  context.save();
  context.translate(x, y);
  context.fillStyle = fill;
  context.strokeStyle = "rgba(0,0,0,0.12)";
  context.lineWidth = 3;
  context.shadowColor = "rgba(0,0,0,0.1)";
  context.shadowBlur = 6;
  context.beginPath();
  context.moveTo(0, size * 0.45);
  context.bezierCurveTo(-size, -size * 0.18, -size * 0.52, -size * 0.86, 0, -size * 0.38);
  context.bezierCurveTo(size * 0.52, -size * 0.86, size, -size * 0.18, 0, size * 0.45);
  context.fill();
  context.stroke();
  context.restore();
}

function drawSparkle(context, x, y, size, stroke) {
  context.save();
  context.strokeStyle = stroke;
  context.lineWidth = 5;
  context.lineCap = "round";
  [0, Math.PI / 4, Math.PI / 2, Math.PI * 3 / 4].forEach((angle) => {
    context.beginPath();
    context.moveTo(x + Math.cos(angle) * size * 0.25, y + Math.sin(angle) * size * 0.25);
    context.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
    context.moveTo(x - Math.cos(angle) * size * 0.25, y - Math.sin(angle) * size * 0.25);
    context.lineTo(x - Math.cos(angle) * size, y - Math.sin(angle) * size);
    context.stroke();
  });
  context.restore();
}


function setupTeamPhotos() {
  const photos = document.querySelectorAll(".team-photo[data-photo-base]");
  const extensions = [".jpg", ".jpeg", ".png", ".jfif", ".webp"];

  photos.forEach((photo) => {
    const basePath = photo.dataset.photoBase;
    const fallback = photo.closest(".team-photo-wrap")?.querySelector(".avatar-fallback");
    const directSource = photo.getAttribute("src");
    const candidates = [
      directSource,
      ...extensions.map((extension) => basePath ? `${basePath}${extension}` : "")
    ].filter(Boolean);
    const uniqueCandidates = [...new Set(candidates)];
    let attempt = 0;

    const showPhoto = () => {
      photo.hidden = false;
      if (fallback) fallback.hidden = true;
    };

    const showFallback = () => {
      photo.hidden = true;
      if (fallback) fallback.hidden = false;
    };

    const tryNextPhoto = () => {
      if (attempt >= uniqueCandidates.length) {
        showFallback();
        return;
      }

      showPhoto();
      photo.src = uniqueCandidates[attempt];
      attempt += 1;
    };

    photo.addEventListener("error", tryNextPhoto);
    photo.addEventListener("load", showPhoto);

    if (photo.complete) {
      if (photo.naturalWidth > 0) {
        showPhoto();
      } else {
        tryNextPhoto();
      }
      return;
    }

    showPhoto();
  });
}

function setupHeroParticles() {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const particles = [];
  const particleCount = Math.min(35, Math.floor(window.innerWidth / 40));

  const resizeCanvas = () => {
    const heroSection = canvas.closest(".hero");
    if (!heroSection) return;
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particleTypes = ["leaf", "pollen", "sparkle"];

  const createParticle = () => {
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: type === "leaf" ? 4 + Math.random() * 6 : type === "pollen" ? 2 + Math.random() * 3 : 1.5 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.15 - Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      opacity: 0.15 + Math.random() * 0.35,
      type,
      color: type === "leaf"
        ? `hsla(${130 + Math.random() * 30}, ${55 + Math.random() * 25}%, ${40 + Math.random() * 20}%, `
        : type === "pollen"
          ? `hsla(${45 + Math.random() * 15}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 15}%, `
          : `hsla(${160 + Math.random() * 60}, ${50 + Math.random() * 30}%, ${70 + Math.random() * 20}%, `,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.008 + Math.random() * 0.012,
      swayAmount: 0.3 + Math.random() * 0.6
    };
  };

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  const drawLeaf = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color + p.opacity + ")";
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.5, p.size * 0.3, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.3, -p.size * 0.6, -p.size * 0.3, 0, -p.size);
    ctx.fill();
    ctx.restore();
  };

  const drawPollen = (p) => {
    ctx.save();
    ctx.fillStyle = p.color + p.opacity + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.color + (p.opacity * 0.3) + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawSparkle = (p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = p.color + p.opacity + ")";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 1.5);
    ctx.lineTo(0, p.size * 1.5);
    ctx.moveTo(-p.size * 1.5, 0);
    ctx.lineTo(p.size * 1.5, 0);
    ctx.stroke();
    ctx.restore();
  };

  let animationId;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * p.swayAmount;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;

      if (p.type === "leaf") drawLeaf(p);
      else if (p.type === "pollen") drawPollen(p);
      else drawSparkle(p);
    });

    animationId = requestAnimationFrame(animate);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    animate();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else if (!prefersReducedMotion) {
      animate();
    }
  });
}

function setupHeroCounters() {
  const counters = document.querySelectorAll(".hero-stat-num[data-count]");
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.count, 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.round(easedProgress * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count;
    });
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }
}

/* ═══════════════════════════════════════════════════════════════
   ECO DETECTIVE — Visual Novel Game Engine
   ═══════════════════════════════════════════════════════════════ */

function setupEcoGame() {
  const container    = document.getElementById("gameContainer");
  const setupScreen  = document.getElementById("gameSetup");
  const viewport     = document.getElementById("gameViewport");
  const endingScreen = document.getElementById("gameEnding");

  const nameInput   = document.getElementById("playerName");
  const startBtn    = document.getElementById("gameStartBtn");
  const restartBtn  = document.getElementById("gameRestartBtn");
  const replayBtn   = document.getElementById("gameReplayBtn");

  const sceneEl     = document.getElementById("gameScene");
  const sceneTextEl = document.getElementById("gameSceneText");
  const characterEl = document.getElementById("gameCharacter");
  const portraitEl  = document.getElementById("gamePortrait");
  const charNameEl  = document.getElementById("gameCharName");
  const speakerEl   = document.getElementById("gameSpeaker");
  const dialogEl    = document.getElementById("gameDialog");
  const dialogText  = document.getElementById("gameDialogText");
  const dialogNext  = document.getElementById("gameDialogNext");
  const choicesEl   = document.getElementById("gameChoices");

  const clueList      = document.getElementById("gameClueList");
  const progressFill  = document.getElementById("gameProgressFill");
  const progressLabel = document.getElementById("gameProgressLabel");

  const endingIcon  = document.getElementById("gameEndingIcon");
  const endingTitle = document.getElementById("gameEndingTitle");
  const endingDesc  = document.getElementById("gameEndingDesc");
  const endingMsg   = document.getElementById("gameEndingMessage");

  if (!container || !setupScreen || !viewport || !startBtn) return;

  /* ── Character Data ── */
  const characters = {
    narrator: { name: "Narator", emoji: "📖", color: "#4a6b5a" },
    player:   { name: "", emoji: "👨‍💼", img: "assets/game/char_player_male.png", color: "#1d7a4e" },
    rama:     { name: "Rama", emoji: "🧑‍🎓", img: "assets/game/char_rama.png", color: "#2e7d32" },
    kheren:   { name: "Kheren", emoji: "👩‍🍳", img: "assets/game/char_kheren.png", color: "#e65100" },
    farrel:   { name: "Farrel", emoji: "🛹", img: "assets/game/char_farrel.png", color: "#1565c0" }
  };

  /* ── Game State ── */
  let state = {
    playerName: "Petugas",
    playerGender: "male",
    clues: [],
    visited: [],
    currentScene: null,
    dialogQueue: [],
    dialogIndex: 0,
    isTyping: false,
    typeTimer: null,
    totalScenes: 12,
    scenesVisited: 0
  };

  /* ── Scene Data (complete story) ── */
  const scenes = {
    /* ===== PROLOG ===== */
    prolog: {
      scene: "taman",
      sceneText: "🌳 Taman Kota Hijau Lestari — Pagi hari yang cerah",
      dialogs: [
        { speaker: "narrator", text: "Pagi ini, Taman Kota Hijau Lestari terlihat sangat cerah. Taman ini didesain sebagai area percontohan nol sampah plastik." },
        { speaker: "player", text: "Udaranya segar banget! Nggak sia-sia program bebas plastik ini dijalankan." },
        { speaker: "narrator", text: "Namun, langkah {nama} terhenti. Di dekat bangku taman, sebuah botol minuman energi impor berbahan plastik tebal tergeletak begitu saja." },
        { speaker: "player", text: "Hei, apa-apaan ini?! Botol plastik impor? Siapa yang berani merusak rekor nol sampah di taman ini?" },
        { speaker: "narrator", text: "Sebagai petugas, {nama} harus menemukan pelakunya. Di sekitar lokasi hanya ada tiga orang..." },
        { speaker: "player", text: "Ada Rama si vlogger lingkungan, Kheren yang lagi istirahat shift dari kafe sebelah, dan Farrel si anak skater." },
        { speaker: "narrator", text: "💡 Tahukah kamu? Satu botol plastik butuh 450 tahun untuk terurai. Membuang sembarangan bukan cuma kotor — tapi merusak lingkungan untuk ratusan tahun ke depan." }
      ],
      next: "pilih_interogasi"
    },

    /* ===== PILIH SIAPA DULU ===== */
    pilih_interogasi: {
      scene: "taman",
      sceneText: "🔍 Pilih siapa yang ingin kamu interogasi duluan",
      dialogs: [
        { speaker: "player", text: "Oke, aku harus teliti. Botol impor ini bukan minuman biasa. Siapa yang paling mungkin membuangnya?" }
      ],
      choices: [
        { text: "Hampiri Rama (Vlogger)", goto: "interogasi_rama", condition: () => !state.visited.includes("rama") },
        { text: "Hampiri Kheren (Barista)", goto: "interogasi_kheren", condition: () => !state.visited.includes("kheren") },
        { text: "Hampiri Farrel (Skater)", goto: "interogasi_farrel", condition: () => !state.visited.includes("farrel") },
        { text: "⚖️ Aku sudah cukup info — saatnya memutuskan!", goto: "keputusan", condition: () => state.visited.length >= 3 }
      ]
    },

    /* ===== INTEROGASI RAMA ===== */
    interogasi_rama: {
      scene: "rama",
      sceneText: "🎥 Di dekat air mancur — Rama sibuk dengan kameranya",
      onEnter: () => { if (!state.visited.includes("rama")) state.visited.push("rama"); },
      dialogs: [
        { speaker: "rama", text: "...dan seperti yang kalian lihat, taman ini beneran bersih banget, guys! Nol plastik!" },
        { speaker: "player", text: "Ehem. Permisi, Rama." },
        { speaker: "rama", text: "Eh, halo pak petugas! Ada apa nih? Lagi live vlog nih, mau masuk frame?" },
        { speaker: "player", text: "Nggak usah. Aku nemuin botol plastik minuman energi impor dibuang di sana. Kamu lihat siapa pelakunya?" },
        { speaker: "rama", text: "Hah?! Botol plastik? Di taman percontohan? Wah, itu merusak banget sih! Aku malah nggak lihat sama sekali." }
      ],
      next: "interogasi_rama_choices"
    },

    interogasi_rama_choices: {
      scene: "rama",
      sceneText: "🎥 Di dekat air mancur — Rama sibuk dengan kameranya",
      dialogs: [
        { speaker: "player", text: "Masih ada yang perlu kutanyakan..." }
      ],
      choices: [
        { text: "🎒 \"Boleh aku cek isi tasmu?\"", goto: "rama_tas" },
        { text: "🥤 \"Gimana kamu bisa nggak lihat?\"", goto: "rama_alasan" },
        { text: "🏃 \"Balik ke lokasi awal\"", goto: "kembali_pilih" }
      ]
    },

    rama_tas: {
      scene: "rama",
      sceneText: "🎒 Memeriksa tas Rama",
      dialogs: [
        { speaker: "player", text: "Kamu kan vlogger lingkungan yang biasa mungutin sampah. Boleh lihat tas punggungmu?" },
        { speaker: "rama", text: "Boleh aja. Nih, isinya tumbler stainlessku sama perlengkapan kamera. Oh, sama ada jaring kecil buat mungutin sampah yang kulihat." },
        { speaker: "narrator", text: "Rama membuka tasnya. Memang ada jaring, tapi ujung jaring itu berlubang cukup besar." },
        { speaker: "player", text: "Jaringmu bolong, Rama." },
        { speaker: "rama", text: "Wah, iya! Pantesan tadi waktu aku pungutin sampah di depan jalan raya terasa enteng... eh tunggu, jangan bilang botol yang aku mungut tadi jatuh?!" },
        { speaker: "narrator", text: "🔍 Petunjuk: Rama mengumpulkan sampah dari luar taman, tapi jaringnya bolong." }
      ],
      onEnter: () => addClue("🎒 Jaring sampah Rama bolong. Mungkin sampahnya berjatuhan?"),
      next: "interogasi_rama_choices"
    },

    rama_alasan: {
      scene: "rama",
      sceneText: "🥤 Menanyakan fokus Rama",
      dialogs: [
        { speaker: "rama", text: "Gimana mau lihat, dari tadi aku fokus ke monolog ke kamera. Kamu tau sendiri kan jadi konten kreator tuh butuh konsentrasi!" },
        { speaker: "player", text: "Jadi kamu beneran nggak perhatiin sekeliling?" },
        { speaker: "rama", text: "Cuma samar-samar sih. Tadi sempet ada Kheren lari buru-buru bawa kantong sampah kafe. Tapi ya dia kan orang kafe organik, masa buang sembarangan?" },
        { speaker: "narrator", text: "🔍 Petunjuk: Rama melihat Kheren berlari buru-buru membawa kantong sampah." }
      ],
      onEnter: () => addClue("👀 Rama melihat Kheren berlari buru-buru membawa kantong sampah kafe."),
      next: "interogasi_rama_choices"
    },

    /* ===== INTEROGASI KHEREN ===== */
    interogasi_kheren: {
      scene: "kheren",
      sceneText: "☕ Di bangku taman — Kheren terlihat kelelahan",
      onEnter: () => { if (!state.visited.includes("kheren")) state.visited.push("kheren"); },
      dialogs: [
        { speaker: "kheren", text: "Hadeh... capek banget shift pagi ini..." },
        { speaker: "player", text: "Permisi, Kheren. Lagi istirahat?" },
        { speaker: "kheren", text: "Eh, {nama}! Iya nih. Ada apa ya?" },
        { speaker: "player", text: "Tadi ada yang ninggalin botol plastik minuman energi di dekat sini. Kamu lihat sesuatu?" },
        { speaker: "kheren", text: "Botol minuman energi? Kafe kita kan jengkel banget sama hal gitu. Kita cuma pakai kemasan biodegradable." }
      ],
      next: "interogasi_kheren_choices"
    },

    interogasi_kheren_choices: {
      scene: "kheren",
      sceneText: "☕ Di bangku taman — Kheren terlihat kelelahan",
      dialogs: [
        { speaker: "player", text: "Ada hal lain yang ingin kupastikan..." }
      ],
      choices: [
        { text: "🏃 \"Kata Rama kamu tadi lari buru-buru?\"", goto: "kheren_lari" },
        { text: "🧾 \"Bisa cek nota pembelian kafe?\"", goto: "kheren_nota" },
        { text: "🏃 \"Balik ke lokasi awal\"", goto: "kembali_pilih" }
      ]
    },

    kheren_lari: {
      scene: "kheren",
      sceneText: "🏃 Menanyakan soal lari buru-buru",
      dialogs: [
        { speaker: "player", text: "Tadi katanya kamu lari buru-buru bawa kantong sampah? Buang ke mana?" },
        { speaker: "kheren", text: "Oh, itu! Iya, kantong sampahnya hampir sobek, jadi aku cepet-cepet lari ke tempat sampah besar di luar taman." },
        { speaker: "kheren", text: "Waktu aku lari, ada anak skater nyerempet aku! Untung sampahnya nggak tumpah." },
        { speaker: "player", text: "Anak skater? Farrel?" },
        { speaker: "kheren", text: "Iya, kayaknya dia minum sesuatu botolan gitu. Nyebelin banget nyerempet orang lagi bawa beban." },
        { speaker: "narrator", text: "🔍 Petunjuk: Farrel menyerempet Kheren sambil memegang minuman botol." }
      ],
      onEnter: () => addClue("👀 Kheren diserempet Farrel yang sedang memegang botol minuman."),
      next: "interogasi_kheren_choices"
    },

    kheren_nota: {
      scene: "kheren",
      sceneText: "🧾 Menanyakan nota minuman",
      dialogs: [
        { speaker: "player", text: "Kalian benar-benar nggak jual minuman botolan impor itu kan?" },
        { speaker: "kheren", text: "Sumpah deh. Cek aja etalase kita. Kita cuma jualan kopi lokal, matcha, sama teh organik." },
        { speaker: "kheren", text: "Minuman impor gitu mah harganya mahal dan plastiknya susah didaur ulang. Musuh utama kafe kita!" },
        { speaker: "narrator", text: "🔍 Petunjuk: Kheren dan kafenya memiliki alibi kuat soal jenis minuman tersebut." }
      ],
      onEnter: () => addClue("🧾 Kafe Kheren tidak menjual minuman energi impor sama sekali."),
      next: "interogasi_kheren_choices"
    },

    /* ===== INTEROGASI FARREL ===== */
    interogasi_farrel: {
      scene: "farrel",
      sceneText: "🛹 Di skatepark mini — Farrel sedang memperbaiki rodanya",
      onEnter: () => { if (!state.visited.includes("farrel")) state.visited.push("farrel"); },
      dialogs: [
        { speaker: "player", text: "Hei, Farrel." },
        { speaker: "farrel", text: "Yo, pak petugas! Santai dulu lah." },
        { speaker: "player", text: "Ada botol plastik minuman energi impor yang dibuang sembarangan di taman. Itu punya kamu?" },
        { speaker: "farrel", text: "Hah? Minuman energi impor? Gile aja, duit dari mana gue beli gituan. Gue minum air putih doang bawa dari rumah." }
      ],
      next: "interogasi_farrel_choices"
    },

    interogasi_farrel_choices: {
      scene: "farrel",
      sceneText: "🛹 Di skatepark mini — Farrel sedang memperbaiki rodanya",
      dialogs: [
        { speaker: "player", text: "Aku butuh penjelasan lagi..." }
      ],
      choices: [
        { text: "💦 \"Tapi Kheren bilang kamu bawa botol minuman?\"", goto: "farrel_botol" },
        { text: "🛹 \"Kamu yang nyerempet Kheren tadi?\"", goto: "farrel_serempet" },
        { text: "🏃 \"Balik ke lokasi awal\"", goto: "kembali_pilih" }
      ]
    },

    farrel_botol: {
      scene: "farrel",
      sceneText: "💦 Menanyakan soal botol minuman",
      dialogs: [
        { speaker: "player", text: "Tapi kata Kheren, dia lihat kamu megang botol minuman waktu nyerempet dia." },
        { speaker: "farrel", text: "Oh! Itu botol tumbler gue! Nih, botolnya warna biru metalik gini. Emang sekilas kayak botol minuman energi sih." },
        { speaker: "narrator", text: "Farrel menunjukkan tumblernya. Memang bentuk dan warnanya sangat mirip dengan botol minuman energi." },
        { speaker: "player", text: "Mirip banget. Pantesan Kheren salah sangka." },
        { speaker: "narrator", text: "🔍 Petunjuk: Botol yang dipegang Farrel ternyata adalah tumbler pribadinya yang berwarna mirip." }
      ],
      onEnter: () => addClue("💦 Botol yang dilihat Kheren ternyata tumbler milik Farrel."),
      next: "interogasi_farrel_choices"
    },

    farrel_serempet: {
      scene: "farrel",
      sceneText: "🛹 Menanyakan soal insiden serempetan",
      dialogs: [
        { speaker: "player", text: "Kamu ngaku nyerempet Kheren yang lagi lari bawa sampah?" },
        { speaker: "farrel", text: "Iya, sorry banget soal itu. Rem gue agak blong. Tapi gue lihat jelas kok, bukan dia yang buang botol." },
        { speaker: "player", text: "Lalu siapa?" },
        { speaker: "farrel", text: "Pas gue nyerempet dia, gue oleng terus lihat Bang Rama lagi sibuk vlog mundur-mundur. Pas dia jalan mundur, gue denger ada suara 'pluk' jatuh dari tasnya." },
        { speaker: "farrel", text: "Gue kira dia sengaja ninggalin barang buat konten. Nggak taunya sampah?" },
        { speaker: "narrator", text: "🔍 Petunjuk: Farrel melihat ada sesuatu yang jatuh dari tas Rama saat Rama berjalan mundur." }
      ],
      onEnter: () => addClue("🛹 Farrel melihat ada benda jatuh dari tas Rama saat Rama membuat vlog."),
      next: "interogasi_farrel_choices"
    },

    /* ===== KEMBALI PILIH ===== */
    kembali_pilih: {
      scene: "taman",
      sceneText: "🌳 Kembali ke area taman",
      dialogs: [
        { speaker: "player", text: "Hmm... ceritanya mulai terhubung. Aku harus cek yang lain atau langsung bikin keputusan." }
      ],
      next: "pilih_interogasi"
    },

    /* ===== FASE KEPUTUSAN ===== */
    keputusan: {
      scene: "keputusan",
      sceneText: "⚖️ Saatnya mengambil keputusan!",
      dialogs: [
        { speaker: "narrator", text: "Berdasarkan semua informasi yang membingungkan ini, {nama} harus menyimpulkan apa yang sebenarnya terjadi." },
        { speaker: "player", text: "Ini lebih rumit dari dugaanku. Semuanya punya alasan, tapi fakta-fakta kecil ini mengarah ke satu kesimpulan logis." },
        { speaker: "narrator", text: "💡 Tips: Baca kembali semua petunjuk di panel kiri. Siapa yang paling mungkin bertanggung jawab atas botol plastik itu?" }
      ],
      choices: [
        { text: "🧑‍🎓 \"Rama, ini salahmu! Botol itu jatuh dari tasmu yang bolong!\"", goto: "ending_good_rama" },
        { text: "👩‍🍳 \"Kheren, kamu buang botol itu waktu lari bawa sampah!\"", goto: "ending_bad_kheren" },
        { text: "🛹 \"Farrel, kamu pasti bohong soal tumbler itu!\"", goto: "ending_bad_farrel" }
      ]
    },

    /* ===== GOOD ENDING (Rama) ===== */
    ending_good_rama: {
      scene: "ending-good",
      sceneText: "🌿 Mengonfrontasi Rama...",
      dialogs: [
        { speaker: "player", text: "Rama, botol itu jatuh dari tasmu saat kamu sedang merekam vlog. Jaring sampahmu berlubang!" },
        { speaker: "rama", text: "Hah?! Masa sih? Coba aku cek video rekaman mentahku..." },
        { speaker: "narrator", text: "Rama memutar ulang videonya. Terdengar jelas suara jatuhnya botol saat ia asyik berbicara ke kamera, tanpa ia sadari." },
        { speaker: "rama", text: "Astaga... kamu benar. Aku tadi mungut botol itu di luar area taman, niatnya mau kubuang ke tempat daur ulang. Tapi malah jatuh di sini." },
        { speaker: "player", text: "Niatmu baik, tapi kelalaian kecil tetap bisa mencemari lingkungan. Jangan sampai kampanye ramah lingkungan malah jadi bumerang karena ceroboh." },
        { speaker: "rama", text: "Maaf banget, semuanya! Ini jadi pelajaran penting buatku. Aku bakal jahit jaring ini lebih kuat dan lebih hati-hati lagi." },
        { speaker: "narrator", text: "Rama memungut botol itu dan membuangnya ke tempat daur ulang dengan benar. Taman kembali bersih dari sampah plastik." }
      ],
      ending: {
        icon: "🌿",
        title: "Good Ending — Eco Detective!",
        desc: "Kamu berhasil menghubungkan semua petunjuk! Rama si aktivis tidak sengaja menjatuhkan sampahnya. Niat baik juga butuh ketelitian.",
        message: "💡 Pesan Moral: Investigasi yang tajam mencegah kita dari asal menuduh. Selain itu, niat baik untuk menjaga lingkungan juga harus diiringi dengan tindakan yang teliti. Jangan sampai niat menolong malah menimbulkan masalah baru."
      }
    },

    /* ===== BAD ENDING (Kheren) ===== */
    ending_bad_kheren: {
      scene: "ending-bad",
      sceneText: "😔 Tuduhan yang salah...",
      dialogs: [
        { speaker: "player", text: "Kheren, kamu pasti membuang botol itu saat kamu panik lari bawa sampah kafe!" },
        { speaker: "kheren", text: "Apa?! Aku sudah bersumpah kafe kami tidak menjual minuman itu! Aku hanya membuang sisa ampas kopi organik!" },
        { speaker: "narrator", text: "Kheren marah dan sakit hati karena dedikasinya pada lingkungan malah dicurigai. Ia langsung kembali ke kafenya." },
        { speaker: "rama", text: "Bro, kamu serius nuduh dia? Bukannya dia paling anti plastik?" },
        { speaker: "narrator", text: "Miskomunikasi ini membuat suasana taman memburuk. Sementara itu, botol plastik itu masih tergeletak di rumput tanpa ada yang mau mengakuinya." }
      ],
      ending: {
        icon: "💀",
        title: "Bad Ending — Kesimpulan Prematur!",
        desc: "Kamu terlalu cepat menuduh Kheren. Alibinya kuat, tapi kamu mengabaikan fakta-fakta yang ada.",
        message: "💡 Pesan Moral: Dalam menyimpulkan sesuatu, jangan abaikan fakta yang sudah jelas (nota dan produk kafe). Terlalu cepat menuduh bisa menyakiti orang yang sebenarnya peduli pada lingkungan."
      }
    },

    /* ===== BAD ENDING (Farrel) ===== */
    ending_bad_farrel: {
      scene: "ending-bad",
      sceneText: "😔 Tuduhan yang salah...",
      dialogs: [
        { speaker: "player", text: "Farrel, jangan bohong! Tumbler itu pasti alasan aja. Kamu yang bawa botol minuman energi itu kan?" },
        { speaker: "farrel", text: "Loh, kok jadi gue? Gue kan udah tunjukin tumbler biru gue. Mau dites minumannya?!" },
        { speaker: "narrator", text: "Farrel menyodorkan tumblernya yang memang berisi air putih biasa." },
        { speaker: "farrel", text: "Percuma gue niat bawa tumbler kalau ujung-ujungnya tetep dicurigai. Males ah main ke taman ini lagi." },
        { speaker: "narrator", text: "Farrel pergi dengan kecewa. Langkahnya yang mulai peduli lingkungan hancur karena tuduhan tanpa bukti yang kuat." },
        { speaker: "player", text: "Ah... sepertinya aku salah orang..." }
      ],
      ending: {
        icon: "💀",
        title: "Bad Ending — Demotivasi!",
        desc: "Kamu menuduh Farrel yang sebenarnya sudah mencoba berubah dengan membawa tumbler.",
        message: "💡 Pesan Moral: Prasangka buruk bisa menghancurkan semangat seseorang yang sedang mencoba berbuat baik. Selalu buktikan sesuatu berdasarkan data dan kesaksian yang konsisten!"
      }
    }
  };

  /* ── Engine Functions ── */

  function addClue(text) {
    if (state.clues.includes(text)) return;
    state.clues.push(text);
    renderClues();
  }

  function renderClues() {
    if (!clueList) return;
    if (state.clues.length === 0) {
      clueList.innerHTML = '<li class="game-clue-empty">Belum ada petunjuk...</li>';
      return;
    }
    clueList.innerHTML = state.clues.map(c => `<li>🔎 ${c}</li>`).join("");
  }

  function updateProgress(label, percent) {
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = label;
  }

  function setScene(sceneKey) {
    if (sceneEl) sceneEl.setAttribute("data-scene", sceneKey);
  }

  function setSceneText(text) {
    if (!sceneTextEl) return;
    sceneTextEl.textContent = text;
    sceneTextEl.classList.remove("is-visible");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => sceneTextEl.classList.add("is-visible"));
    });
  }

  function showCharacter(charKey) {
    if (!characterEl || !portraitEl || !charNameEl) return;
    const char = characters[charKey];
    if (!char || charKey === "narrator") {
      characterEl.hidden = true;
      return;
    }
    
    if (char.img) {
      portraitEl.style.backgroundImage = `url("${char.img}")`;
      portraitEl.textContent = "";
    } else {
      portraitEl.style.backgroundImage = "none";
      portraitEl.textContent = char.emoji;
    }
    
    charNameEl.textContent = charKey === "player" ? state.playerName : char.name;
    characterEl.hidden = false;
    characterEl.style.animation = "none";
    requestAnimationFrame(() => {
      characterEl.style.animation = "";
    });
  }

  function setSpeaker(charKey) {
    if (!speakerEl) return;
    const char = characters[charKey];
    if (!char || charKey === "narrator") {
      speakerEl.hidden = true;
      return;
    }
    speakerEl.textContent = charKey === "player" ? state.playerName : char.name;
    speakerEl.style.background = `linear-gradient(135deg, ${char.color}, ${char.color}cc)`;
    speakerEl.hidden = false;
  }

  function replaceVars(text) {
    return text.replace(/\{nama\}/g, state.playerName);
  }

  /* ── Typewriter Effect ── */
  function typeText(text, callback) {
    if (!dialogText) return;
    const fullText = replaceVars(text);
    dialogText.textContent = "";
    if (dialogNext) dialogNext.hidden = true;
    state.isTyping = true;
    let i = 0;

    function typeChar() {
      if (i < fullText.length) {
        dialogText.textContent += fullText[i];
        i++;
        state.typeTimer = setTimeout(typeChar, 22);
      } else {
        state.isTyping = false;
        if (dialogNext) dialogNext.hidden = false;
        if (callback) callback();
      }
    }

    typeChar();
  }

  function skipTypewriter() {
    if (!state.isTyping) return false;
    clearTimeout(state.typeTimer);
    const currentDialog = state.dialogQueue[state.dialogIndex];
    if (currentDialog && dialogText) {
      dialogText.textContent = replaceVars(currentDialog.text);
    }
    state.isTyping = false;
    if (dialogNext) dialogNext.hidden = false;
    return true;
  }

  /* ── Dialog Flow ── */
  function runScene(sceneKey) {
    const scene = scenes[sceneKey];
    if (!scene) return;

    state.currentScene = sceneKey;
    state.scenesVisited++;

    // Progress calculation
    const progress = Math.min(100, Math.round((state.scenesVisited / state.totalScenes) * 100));
    let label = "Prolog";
    if (state.visited.length >= 3) label = "Investigasi selesai";
    else if (state.visited.length > 0) label = `Interogasi ${state.visited.length}/3`;
    if (sceneKey.startsWith("ending")) label = "Ending";
    if (sceneKey === "keputusan") label = "Keputusan akhir";
    updateProgress(label, progress);

    // Scene setup
    setScene(scene.scene || "taman");
    setSceneText(scene.sceneText || "");

    // On enter
    if (scene.onEnter) scene.onEnter();

    // Prepare dialog queue
    state.dialogQueue = scene.dialogs || [];
    state.dialogIndex = 0;

    // Hide choices
    if (choicesEl) choicesEl.hidden = true;

    // Show first dialog
    showDialog();
  }

  function showDialog() {
    if (state.dialogIndex >= state.dialogQueue.length) {
      // Dialog finished — show choices or advance
      const scene = scenes[state.currentScene];
      if (scene?.choices) {
        showChoices(scene.choices);
      } else if (scene?.ending) {
        showEnding(scene.ending);
      } else if (scene?.next) {
        runScene(scene.next);
      }
      return;
    }

    const dialog = state.dialogQueue[state.dialogIndex];
    showCharacter(dialog.speaker);
    setSpeaker(dialog.speaker);
    typeText(dialog.text);
  }

  function advanceDialog() {
    if (skipTypewriter()) return;

    state.dialogIndex++;
    showDialog();
  }

  /* ── Choices ── */
  function showChoices(choices) {
    if (!choicesEl) return;

    const labels = ["A", "B", "C", "D", "E"];
    const available = choices.filter(c => !c.condition || c.condition());

    choicesEl.innerHTML = available.map((choice, i) =>
      `<button class="game-choice-btn" data-goto="${choice.goto}">
        <span class="game-choice-label">${labels[i] || "?"}</span>
        <span>${choice.text}</span>
      </button>`
    ).join("");

    choicesEl.hidden = false;

    // Bind events
    choicesEl.querySelectorAll(".game-choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const goto = btn.dataset.goto;
        choicesEl.hidden = true;
        if (goto && scenes[goto]) {
          runScene(goto);
        }
      });
    });
  }

  /* ── Ending ── */
  function showEnding(ending) {
    if (!endingScreen) return;
    if (endingIcon) endingIcon.textContent = ending.icon;
    if (endingTitle) endingTitle.textContent = ending.title;
    if (endingDesc) endingDesc.textContent = ending.desc;
    if (endingMsg) endingMsg.textContent = ending.message;
    endingScreen.hidden = false;
  }

  /* ── Game Controls ── */
  function startGame() {
    const name = nameInput?.value.trim() || "Petugas";
    const gender = document.querySelector('input[name="playerGender"]:checked')?.value || "male";

    state = {
      playerName: name,
      playerGender: gender,
      clues: [],
      visited: [],
      currentScene: null,
      dialogQueue: [],
      dialogIndex: 0,
      isTyping: false,
      typeTimer: null,
      totalScenes: 12,
      scenesVisited: 0
    };

    characters.player.name = name;
    characters.player.emoji = gender === "female" ? "👩‍💼" : "👨‍💼";
    characters.player.img = gender === "female" ? "assets/game/char_player_female.png" : "assets/game/char_player_male.png";

    renderClues();
    updateProgress("Prolog", 5);

    setupScreen.hidden = true;
    viewport.hidden = false;
    if (endingScreen) endingScreen.hidden = true;

    runScene("prolog");
  }

  function resetGame() {
    clearTimeout(state.typeTimer);
    setupScreen.hidden = false;
    viewport.hidden = true;
    if (endingScreen) endingScreen.hidden = true;
    if (dialogText) dialogText.textContent = "";
    if (choicesEl) choicesEl.hidden = true;
    if (characterEl) characterEl.hidden = true;
    if (speakerEl) speakerEl.hidden = true;
    renderClues();
    updateProgress("Prolog", 5);
  }

  /* ── Event Listeners ── */
  startBtn.addEventListener("click", startGame);

  if (nameInput) {
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startGame();
    });
  }

  if (restartBtn) restartBtn.addEventListener("click", resetGame);
  if (replayBtn) replayBtn.addEventListener("click", resetGame);

  if (dialogEl) {
    dialogEl.addEventListener("click", advanceDialog);
  }

  document.addEventListener("keydown", (e) => {
    if (!viewport || viewport.hidden) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      advanceDialog();
    }
  });
}
