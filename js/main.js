// Main JS file to handle interactivity across pages

document.addEventListener('DOMContentLoaded', () => {
  // 全局搜索初始化必须在任何页面逻辑之前执行。
  initGlobalSearch();
  const pageId = document.body.id;
  try {
    switch (pageId) {
      case 'home-page':
        initHomePage();
        break;
      case 'experts-page':
        initExpertsPage();
        break;
      case 'expert-detail-page':
        initExpertDetailPage();
        break;
      case 'institutions-page':
        initInstitutionsPage();
        break;
      case 'institution-detail-page':
        initInstitutionDetailPage();
        break;
      case 'lawcase-page':
        initLawcasePage();
        break;
      case 'reports-page':
        initReportsPage();
        break;
      case 'map-page':
        initMapPage();
        break;
      case 'admin-page':
        initAdminPage();
        break;
      case 'law-detail-page':
        initLawDetailPage();
        break;
      case 'case-detail-page':
        initCaseDetailPage();
        break;
      case 'report-detail-page':
        initReportDetailPage();
        break;
      case 'search-page':
        initSearchPage();
        break;
      default:
        break;
    }
  } catch (err) {
    // Display error on page for debugging
    const errEl = document.createElement('pre');
    errEl.style.color = 'red';
    errEl.textContent = '脚本错误：' + err.message;
    document.body.appendChild(errEl);
    console.error(err);
  }
});

/**
 * Initialize home page: slider, overview cards, news list
 */
function initHomePage() {
  initSlider();
  populateOverviewCards();
  populateNewsList();
}

function initSlider() {
  const slides = document.querySelectorAll('.hero-section .slide');
  const indicators = document.querySelectorAll('.slider-indicators .indicator');
  let current = 0;
  const showSlide = index => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
    current = index;
  };
  // Auto cycle
  let timer = setInterval(() => {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }, 5000);
  // Indicator click
  indicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      clearInterval(timer);
      showSlide(idx);
      timer = setInterval(() => {
        const next = (current + 1) % slides.length;
        showSlide(next);
      }, 5000);
    });
  });
  showSlide(0);
}

function populateOverviewCards() {
  const container = document.getElementById('overview-cards');
  if (!container) return;
  const { experts, institutions, laws, cases, reports } = window.DATA;
  const metrics = [
    { label: '专家数量', value: experts.length },
    { label: '机构数量', value: institutions.length },
    { label: '法规案例数量', value: laws.length + cases.length },
    { label: '报告数量', value: reports.length }
  ];
  container.innerHTML = metrics.map(m => `
    <div class="card">
      <div class="card-number">${m.value}</div>
      <div class="card-label">${m.label}</div>
    </div>
  `).join('');
}

function populateNewsList() {
  const newsContainer = document.getElementById('news-list');
  if (!newsContainer) return;
  const { news } = window.DATA;
  newsContainer.innerHTML = news.map(item => `
    <div class="news-item">
      <h3>${item.title}</h3>
      <p>${item.date}</p>
      <p>${item.content}</p>
    </div>
  `).join('');
}

/**
 * Experts page initialisation: filters and list
 */
function initExpertsPage() {
  const experts = window.DATA.experts;
  const filterNationality = document.getElementById('filter-nationality');
  const filterInstitution = document.getElementById('filter-institution');
  const filterResearch = document.getElementById('filter-research');
  const searchInput = document.getElementById('expert-search');
  const listContainer = document.getElementById('experts-list');
  // populate nationality options
  const natSet = [];
  experts.forEach(e => {
    if (!natSet.includes(e.nationality)) natSet.push(e.nationality);
  });
  natSet.sort().forEach(nat => {
    const opt = document.createElement('option');
    opt.value = nat;
    opt.textContent = nat;
    filterNationality.appendChild(opt);
  });
  // populate institution options
  const instSet = [];
  experts.forEach(e => {
    if (!instSet.includes(e.institution)) instSet.push(e.institution);
  });
  instSet.sort().forEach(inst => {
    const opt = document.createElement('option');
    opt.value = inst;
    opt.textContent = inst;
    filterInstitution.appendChild(opt);
  });
  // populate research tag options
  const researchTagsSet = [];
  experts.forEach(e => {
    if (Array.isArray(e.research_tags)) {
      e.research_tags.forEach(tag => {
        if (!researchTagsSet.includes(tag)) researchTagsSet.push(tag);
      });
    }
  });
  researchTagsSet.sort().forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    filterResearch.appendChild(opt);
  });
  // render list
  function render() {
    const natVal = filterNationality.value;
    const instVal = filterInstitution.value;
    const researchVal = filterResearch.value;
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = experts.filter(e => {
      const matchNat = natVal ? e.nationality === natVal : true;
      const matchInst = instVal ? e.institution === instVal : true;
      const matchResearch = researchVal ? e.research_tags.includes(researchVal) : true;
      const matchKeyword = keyword ? (e.name_cn.toLowerCase().includes(keyword) || e.name_en.toLowerCase().includes(keyword) || e.research_tags.some(tag => tag.toLowerCase().includes(keyword))) : true;
      return matchNat && matchInst && matchResearch && matchKeyword;
    });
    if (filtered.length === 0) {
      listContainer.innerHTML = '<p style="padding: 10px;">暂无数据</p>';
      return;
    }
    listContainer.innerHTML = filtered.map(e => `
      <div class="expert-card">
        <a href="expert.html?id=${e.id}">
          <img src="${e.avatar_url}" alt="${e.name_cn}">
          <div class="card-body">
            <h3>${e.name_cn}</h3>
            <p>${e.institution}</p>
            <p>${e.nationality}</p>
          </div>
        </a>
      </div>
    `).join('');
  }
  [filterNationality, filterInstitution, filterResearch].forEach(sel => {
    sel.addEventListener('change', render);
  });
  searchInput.addEventListener('input', render);
  render();
}

/**
 * Expert detail page
 */
function initExpertDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const expert = window.DATA.experts.find(e => e.id === id);
  const profileContainer = document.getElementById('expert-profile');
  if (!expert || !profileContainer) return;
  profileContainer.innerHTML = `
    <img src="${expert.avatar_url}" alt="${expert.name_cn}">
    <h2>${expert.name_cn}</h2>
    <ul>
      <li>英文名：${expert.name_en}</li>
      <li>性别：${expert.gender}</li>
      <li>出生年份：${expert.birth_year}</li>
      <li>国籍：${expert.nationality}</li>
      <li>机构：${expert.institution}</li>
      <li>职位：${expert.position}</li>
      <li>学历：${expert.degree}</li>
      <li>邮箱：<a href="mailto:${expert.email}">${expert.email}</a></li>
    </ul>
  `;
  const tabs = document.querySelectorAll('.tab-header .tab-link');
  const researchContainer = document.getElementById('tab-research');
  const outputsContainer = document.getElementById('tab-outputs');
  const projectsContainer = document.getElementById('tab-projects');
  const mediaContainer = document.getElementById('tab-media');
  function fillList(container, items) {
    if (!items || items.length === 0) {
      container.innerHTML = '<p>暂无数据</p>';
      return;
    }
    container.innerHTML = '<ul>' + items.map(it => `<li>${it}</li>`).join('') + '</ul>';
  }
  fillList(researchContainer, expert.research_tags);
  fillList(outputsContainer, expert.outputs);
  fillList(projectsContainer, expert.projects);
  fillList(mediaContainer, expert.media);
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      ['research','outputs','projects','media'].forEach(tab => {
        document.getElementById('tab-' + tab).style.display = (tab === target) ? 'block' : 'none';
      });
    });
  });
}

/**
 * Institutions page
 */
function initInstitutionsPage() {
  const institutions = window.DATA.institutions;
  const filterCountry = document.getElementById('filter-country');
  const filterField = document.getElementById('filter-field');
  const searchInput = document.getElementById('institution-search');
  const listContainer = document.getElementById('institutions-list');
  const countrySet = [];
  institutions.forEach(i => {
    if (!countrySet.includes(i.country)) countrySet.push(i.country);
  });
  countrySet.sort().forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCountry.appendChild(opt);
  });
  const fieldSet = [];
  institutions.forEach(i => {
    if (!fieldSet.includes(i.field)) fieldSet.push(i.field);
  });
  fieldSet.sort().forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    filterField.appendChild(opt);
  });
  function render() {
    const countryVal = filterCountry.value;
    const fieldVal = filterField.value;
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = institutions.filter(i => {
      const matchCountry = countryVal ? i.country === countryVal : true;
      const matchField = fieldVal ? i.field === fieldVal : true;
      const matchKeyword = keyword ? (i.name.toLowerCase().includes(keyword) || i.description.toLowerCase().includes(keyword)) : true;
      return matchCountry && matchField && matchKeyword;
    });
    if (filtered.length === 0) {
      listContainer.innerHTML = '<p style="padding: 10px;">暂无数据</p>';
      return;
    }
    listContainer.innerHTML = filtered.map(i => `
      <div class="institution-card">
        <a href="institution.html?id=${i.id}">
          <img src="${i.logo}" alt="${i.name}">
          <div class="card-body">
            <h3>${i.name}</h3>
            <p>${i.country}</p>
            <p>${i.field}</p>
          </div>
        </a>
      </div>
    `).join('');
  }
  [filterCountry, filterField].forEach(sel => {
    sel.addEventListener('change', render);
  });
  searchInput.addEventListener('input', render);
  render();
}

/**
 * Institution detail page
 */
function initInstitutionDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const inst = window.DATA.institutions.find(i => i.id === id);
  const container = document.getElementById('institution-detail');
  if (!inst || !container) return;
  let leadersHtml = '';
  if (inst.leaders && inst.leaders.length > 0) {
    leadersHtml = '<div class="leaders">' + inst.leaders.map(l => `
      <div class="leader-card">
        <h4>${l.name}</h4>
        <span>${l.position}</span>
      </div>
    `).join('') + '</div>';
  }
  const laws = window.DATA.laws.filter(l => inst.related_laws && inst.related_laws.includes(l.id));
  const cases = window.DATA.cases.filter(c => inst.related_cases && inst.related_cases.includes(c.id));
  let relatedHtml = '';
  if (laws.length > 0) {
    relatedHtml += '<h3>相关法规</h3><ul>' + laws.map(l => `<li><a href="lawcase.html#law-${l.id}">${l.title}</a></li>`).join('') + '</ul>';
  }
  if (cases.length > 0) {
    relatedHtml += '<h3>相关案例</h3><ul>' + cases.map(c => `<li><a href="lawcase.html#case-${c.id}">${c.title}</a></li>`).join('') + '</ul>';
  }
  container.innerHTML = `
    <h2>${inst.name}</h2>
    <p><strong>国家/地区：</strong>${inst.country}</p>
    <p><strong>领域：</strong>${inst.field}</p>
    <p>${inst.description}</p>
    ${leadersHtml}
    ${relatedHtml}
  `;
}

/**
 * Lawcase page
 */
function initLawcasePage() {
  const lawTabBtn = document.querySelector('button[data-tab="laws"]');
  const caseTabBtn = document.querySelector('button[data-tab="cases"]');
  const tabButtons = [lawTabBtn, caseTabBtn];
  const lawsContainer = document.getElementById('tab-laws');
  const casesContainer = document.getElementById('tab-cases');
  const filterSelect = document.getElementById('filter-law-type');
  const searchInput = document.getElementById('lawcase-search');
  const laws = window.DATA.laws;
  const cases = window.DATA.cases;
  const categorySet = [];
  laws.forEach(l => { if (!categorySet.includes(l.category)) categorySet.push(l.category); });
  cases.forEach(c => { if (!categorySet.includes(c.category)) categorySet.push(c.category); });
  categorySet.sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
  function renderLawcase() {
    const catVal = filterSelect.value;
    const keyword = searchInput.value.trim().toLowerCase();
    const filteredLaws = laws.filter(l => {
      const matchCat = catVal ? l.category === catVal : true;
      const matchKeyword = keyword ? (l.title.toLowerCase().includes(keyword) || l.summary.toLowerCase().includes(keyword)) : true;
      return matchCat && matchKeyword;
    });
    const filteredCases = cases.filter(c => {
      const matchCat = catVal ? c.category === catVal : true;
      const matchKeyword = keyword ? (c.title.toLowerCase().includes(keyword) || c.summary.toLowerCase().includes(keyword)) : true;
      return matchCat && matchKeyword;
    });
    // 渲染法规列表，点击跳转到法规详情页
    lawsContainer.innerHTML = filteredLaws.map(l => `
      <div class="law-item" id="law-${l.id}">
        <h3>${l.title}</h3>
        <p>${l.summary}</p>
        <a href="law-detail.html?id=${l.id}">查看详情</a>
      </div>
    `).join('') || '<p>暂无数据</p>';
    // 渲染案例列表，点击跳转到案例详情页
    casesContainer.innerHTML = filteredCases.map(c => `
      <div class="case-item" id="case-${c.id}">
        <h3>${c.title}</h3>
        <p>${c.summary}</p>
        <a href="case-detail.html?id=${c.id}">查看详情</a>
      </div>
    `).join('') || '<p>暂无数据</p>';
  }
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      if (target === 'laws') {
        lawsContainer.style.display = 'block';
        casesContainer.style.display = 'none';
      } else {
        lawsContainer.style.display = 'none';
        casesContainer.style.display = 'block';
      }
    });
  });
  filterSelect.addEventListener('change', renderLawcase);
  searchInput.addEventListener('input', renderLawcase);
  renderLawcase();
}

/**
 * Reports page
 */
function initReportsPage() {
  const reports = window.DATA.reports;
  const filterSelect = document.getElementById('filter-report-category');
  const searchInput = document.getElementById('report-search');
  const listContainer = document.getElementById('reports-list');
  const categorySet = [];
  reports.forEach(r => {
    if (!categorySet.includes(r.category)) categorySet.push(r.category);
  });
  categorySet.sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
  function render() {
    const catVal = filterSelect.value;
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = reports.filter(r => {
      const matchCat = catVal ? r.category === catVal : true;
      const matchKeyword = keyword ? (r.title.toLowerCase().includes(keyword) || r.summary.toLowerCase().includes(keyword)) : true;
      return matchCat && matchKeyword;
    });
    listContainer.innerHTML = filtered.map(r => `
      <div class="report-card">
        <h3>${r.title}</h3>
        <p>${r.summary}</p>
        <a href="report-detail.html?id=${r.id}">查看详情</a>
      </div>
    `).join('') || '<p>暂无数据</p>';
  }
  filterSelect.addEventListener('change', render);
  searchInput.addEventListener('input', render);
  render();
}

/**
 * Map page
 */
function initMapPage() {
  const markersContainer = document.getElementById('map-markers');
  const experts = window.DATA.experts;
  const institutions = window.DATA.institutions;
  const counts = {};
  experts.forEach(e => {
    counts[e.nationality] = (counts[e.nationality] || 0) + 1;
  });
  institutions.forEach(i => {
    counts[i.country] = (counts[i.country] || 0) + 1;
  });
  const positions = {
    '中国': { x: 70, y: 55 },
    '美国': { x: 25, y: 50 },
    '英国': { x: 46, y: 38 },
    '日本': { x: 80, y: 45 },
    '法国': { x: 45, y: 45 },
    '德国': { x: 48, y: 42 }
  };
  markersContainer.innerHTML = '';
  Object.keys(counts).forEach(country => {
    const pos = positions[country];
    if (!pos) return;
    const marker = document.createElement('div');
    marker.className = 'map-marker';
    marker.style.left = pos.x + '%';
    marker.style.top = pos.y + '%';
    marker.textContent = `${country}: ${counts[country]}`;
    markersContainer.appendChild(marker);
  });
}

/**
 * Admin page
 */
function initAdminPage() {
  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const messageEl = document.getElementById('login-message');
  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      messageEl.textContent = '请输入用户名和密码。';
      messageEl.style.color = '#f44336';
      return;
    }
    if (username === 'admin' && password === 'admin') {
      messageEl.textContent = '登录成功（示例）。';
      messageEl.style.color = '#4caf50';
    } else {
      messageEl.textContent = '用户名或密码错误。';
      messageEl.style.color = '#f44336';
    }
  });
}

/**
 * 初始化法规详情页
 * 读取查询参数中的 id，查找相应法规并渲染详情。
 */
function initLawDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const law = window.DATA.laws.find(l => l.id === id);
  const container = document.getElementById('law-detail');
  if (!container) return;
  if (!law) {
    container.innerHTML = '<p>未找到对应的法规。</p>';
    return;
  }
  container.innerHTML = `
    <h2>${law.title}</h2>
    <p><strong>发布时间：</strong>${law.date}</p>
    <p>${law.summary}</p>
    ${law.link && law.link !== '#' ? `<p><a href="${law.link}" target="_blank">下载原文</a></p>` : ''}
    <p><a href="lawcase.html">返回法规案例列表</a></p>
  `;
}

/**
 * 初始化案例详情页
 */
function initCaseDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const c = window.DATA.cases.find(item => item.id === id);
  const container = document.getElementById('case-detail');
  if (!container) return;
  if (!c) {
    container.innerHTML = '<p>未找到对应的案例。</p>';
    return;
  }
  container.innerHTML = `
    <h2>${c.title}</h2>
    <p><strong>发布日期：</strong>${c.date}</p>
    <p>${c.summary}</p>
    <p><a href="lawcase.html">返回法规案例列表</a></p>
  `;
}

/**
 * 初始化报告详情页
 */
function initReportDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const report = window.DATA.reports.find(r => r.id === id);
  const container = document.getElementById('report-detail');
  if (!container) return;
  if (!report) {
    container.innerHTML = '<p>未找到对应的报告。</p>';
    return;
  }
  container.innerHTML = `
    <h2>${report.title}</h2>
    <p><strong>发布日期：</strong>${report.date}</p>
    <p>${report.summary}</p>
    ${report.link && report.link !== '#' ? `<p><a href="${report.link}" target="_blank">下载报告</a></p>` : ''}
    <p><a href="reports.html">返回报告列表</a></p>
  `;
}

/**
 * 初始化全局搜索功能。该函数会在所有页面的 DOMContentLoaded 事件触发时调用。
 * 它会监听头部搜索输入框和按钮的点击/按键事件，并在用户输入搜索词后跳转至搜索结果页。
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search');
  const searchBtn = document.getElementById('search-btn');
  if (!searchInput || !searchBtn) return;
  function goSearch() {
    const query = searchInput.value.trim();
    // 只有在有搜索词时才跳转
    if (query) {
      window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    }
  }
  searchBtn.addEventListener('click', goSearch);
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      goSearch();
    }
  });
}

/**
 * 搜索结果页面初始化。根据 query 参数搜索各类数据并渲染结果列表。
 */
function initSearchPage() {
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get('query') || '';
  const summaryEl = document.getElementById('search-summary');
  const resultsEl = document.getElementById('search-results');
  const searchInput = document.getElementById('global-search');
  // 若有输入框，则填入当前查询词，便于用户再次搜索
  if (searchInput) searchInput.value = queryParam;
  if (!resultsEl) return;
  const query = queryParam.trim().toLowerCase();
  // 更新顶部摘要
  if (summaryEl) {
    summaryEl.textContent = query ? `关键字 “${queryParam}” 的搜索结果：` : '请输入关键字进行搜索。';
  }
  // 如果没有关键字，清空结果并返回
  if (!query) {
    resultsEl.innerHTML = '';
    return;
  }
  // 从各数据集中筛选匹配项
  const { experts, institutions, laws, cases, reports } = window.DATA;
  // 匹配函数，用于检测目标字符串数组或单个字符串中是否包含关键字
  function matches(strOrArr) {
    if (!strOrArr) return false;
    if (Array.isArray(strOrArr)) {
      return strOrArr.some(item => matches(item));
    }
    return String(strOrArr).toLowerCase().includes(query);
  }
  const matchedExperts = experts.filter(e => {
    return matches(e.name_cn) || matches(e.name_en) || matches(e.institution) || matches(e.nationality) || matches(e.research_tags);
  });
  const matchedInstitutions = institutions.filter(i => {
    return matches(i.name) || matches(i.country) || matches(i.field) || matches(i.description);
  });
  const matchedLaws = laws.filter(l => {
    return matches(l.title) || matches(l.summary) || matches(l.category);
  });
  const matchedCases = cases.filter(c => {
    return matches(c.title) || matches(c.summary) || matches(c.category);
  });
  const matchedReports = reports.filter(r => {
    return matches(r.title) || matches(r.summary) || matches(r.category);
  });
  function renderSection(title, itemsHtml) {
    return `<section class="search-section">
      <h2>${title}</h2>
      ${itemsHtml || '<p>暂无匹配结果</p>'}
    </section>`;
  }
  // 构建各类结果的 HTML。复用已有的卡片/列表样式类。
  const expertHtml = matchedExperts.map(e => {
    return `<div class="expert-card">
      <a href="expert.html?id=${e.id}">
        <img src="${e.avatar_url}" alt="${e.name_cn}">
        <div class="card-body">
          <h3>${e.name_cn}</h3>
          <p>${e.institution}</p>
          <p>${e.nationality}</p>
        </div>
      </a>
    </div>`;
  }).join('');
  const institutionHtml = matchedInstitutions.map(i => {
    return `<div class="institution-card">
      <a href="institution.html?id=${i.id}">
        <img src="${i.logo}" alt="${i.name}">
        <div class="card-body">
          <h3>${i.name}</h3>
          <p>${i.country}</p>
          <p>${i.field}</p>
        </div>
      </a>
    </div>`;
  }).join('');
  const lawHtml = matchedLaws.map(l => {
    return `<div class="law-item">
      <h3><a href="law-detail.html?id=${l.id}">${l.title}</a></h3>
      <p>${l.date}</p>
      <p>${l.summary}</p>
    </div>`;
  }).join('');
  const caseHtml = matchedCases.map(c => {
    return `<div class="case-item">
      <h3><a href="case-detail.html?id=${c.id}">${c.title}</a></h3>
      <p>${c.date}</p>
      <p>${c.summary}</p>
    </div>`;
  }).join('');
  const reportHtml = matchedReports.map(r => {
    return `<div class="report-card">
      <h3>${r.title}</h3>
      <p>${r.date}</p>
      <p>${r.summary}</p>
      <a href="report-detail.html?id=${r.id}">查看详情</a>
    </div>`;
  }).join('');
  // 组合所有部分
  resultsEl.innerHTML =
    renderSection('专家', expertHtml) +
    renderSection('机构', institutionHtml) +
    renderSection('法规', lawHtml) +
    renderSection('案例', caseHtml) +
    renderSection('报告', reportHtml);
}