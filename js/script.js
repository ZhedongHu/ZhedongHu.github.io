(function () {
  // 当前语言：zh 或 en
  function currentLang() {
    const lang = document.documentElement.lang || "zh-CN";
    return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  // 初始化语言偏好
  const savedLang = localStorage.getItem("site-lang");
  if (savedLang === "en" || savedLang === "zh") {
    document.documentElement.lang = savedLang === "en" ? "en" : "zh-CN";
  }

  // 语言切换
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      const next = currentLang() === "zh" ? "en" : "zh-CN";
      document.documentElement.lang = next;
      localStorage.setItem("site-lang", next === "en" ? "en" : "zh");
      renderProjects();
    });
  }

  // 转义 HTML，防止项目内容破坏页面
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 渲染项目卡片
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid) return;

    const projects = window.PROJECTS || [];
    const lang = currentLang();

    if (!projects.length) {
      grid.innerHTML = `<p class="empty-tip">${lang === "zh" ? "暂无项目" : "No projects yet"}</p>`;
      return;
    }

    grid.innerHTML = "";

    projects.forEach(function (project) {
      const card = document.createElement("article");
      card.className = "project-card";

      const title = project.title
        ? project.title[lang] || project.title.zh || ""
        : "";
      const description = project.description
        ? project.description[lang] || project.description.zh || ""
        : "";

      const visual = project.image
        ? `<div class="project-image"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(title)}" loading="lazy"></div>`
        : `<div class="project-icon">${escapeHtml(project.icon || "📁")}</div>`;

      const tagsHtml = (project.tags || [])
        .map(function (tag) {
          return `<span class="tag">${escapeHtml(tag)}</span>`;
        })
        .join("");

      const links = [];
      if (project.github) {
        links.push(`<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener">GitHub</a>`);
      }
      if (project.demo) {
        links.push(`<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener">${lang === "zh" ? "在线演示" : "Live Demo"}</a>`);
      }

      card.innerHTML = `
        ${visual}
        <div class="project-body">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
          <div class="project-tags">${tagsHtml}</div>
          <div class="project-links">${links.join("")}</div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // 粒子背景动画
  function initParticles() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height, particles;
    const COUNT = 55;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = Array.from({ length: COUNT }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2 + 0.5
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 224, 255, 0.65)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 180, 255, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", function () {
      resize();
      createParticles();
    });

    resize();
    createParticles();
    draw();
  }

  function init() {
    renderProjects();
    initParticles();
  }

  document.addEventListener("DOMContentLoaded", init);
})();