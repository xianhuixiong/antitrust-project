// 本文件定义用于演示的示例数据，包括专家、机构、法规、案例和报告等。
// 实际应用中，数据应由后端接口提供。

const data = {
  experts: [
    {
      id: 1,
      name_cn: "张三",
      name_en: "Zhang San",
      gender: "男",
      birth_year: 1970,
      nationality: "中国",
      institution_id: 1,
      position: "教授",
      degree: "博士",
      email: "zhangsan@example.com",
      research_tags: ["反垄断", "竞争政策"],
      avatar: "images/avatar1.png",
      projects: ["完善竞争政策研究", "跨国并购案例分析"],
      outputs: ["《反垄断法评论》", "《竞争政策研究报告》"],
      media: ["央视新闻采访：谈平台经济监管"],
    },
    {
      id: 2,
      name_cn: "李四",
      name_en: "Li Si",
      gender: "女",
      birth_year: 1980,
      nationality: "美国",
      institution_id: 2,
      position: "研究员",
      degree: "博士",
      email: "lisi@example.com",
      research_tags: ["数字经济", "数据治理"],
      avatar: "images/avatar2.png",
      projects: ["数字市场竞争评估"],
      outputs: ["《数据治理蓝皮书》"],
      media: ["纽约时报专访：数字经济竞争"],
    },
    {
      id: 3,
      name_cn: "王五",
      name_en: "Wang Wu",
      gender: "男",
      birth_year: 1978,
      nationality: "英国",
      institution_id: 3,
      position: "高级顾问",
      degree: "硕士",
      email: "wangwu@example.com",
      research_tags: ["国际贸易", "竞争法"],
      avatar: "images/avatar3.png",
      projects: ["欧盟竞争法案例研究"],
      outputs: ["《国际竞争法》"],
      media: ["BBC访谈：全球化与竞争"],
    },
    {
      id: 4,
      name_cn: "赵六",
      name_en: "Zhao Liu",
      gender: "女",
      birth_year: 1985,
      nationality: "法国",
      institution_id: 3,
      position: "讲师",
      degree: "博士",
      email: "zhaoliu@example.com",
      research_tags: ["反垄断", "数字平台"],
      avatar: "images/avatar1.png",
      projects: ["欧洲数字平台竞争监管"],
      outputs: ["《平台经济法制研究》"],
      media: ["法国经济报采访：平台竞争"],
    }
  ],
  institutions: [
    {
      id: 1,
      name: "中国社会科学院",
      country: "中国",
      field: "经济学研究",
      logo: "images/logo1.png",
      description: "中国社会科学院是我国哲学社会科学研究最高学术机构和综合研究中心。",
      lawcases: [1, 2],
    },
    {
      id: 2,
      name: "斯坦福大学反垄断研究中心",
      country: "美国",
      field: "反垄断研究",
      logo: "images/logo2.png",
      description: "该中心致力于研究全球范围内的反垄断政策与实践。",
      lawcases: [3],
    },
    {
      id: 3,
      name: "英国竞争与市场管理局",
      country: "英国",
      field: "监管机构",
      logo: "images/logo3.png",
      description: "CMA 是英国负责竞争政策与消费者保护的独立机构。",
      lawcases: [],
    }
  ],
  laws: [
    {
      id: 1,
      category: "中国",
      title: "中华人民共和国反垄断法",
      summary: "规范市场竞争行为，防止垄断行为，保护消费者利益。",
      date: "2022-08-01",
      link: "#",
    },
    {
      id: 2,
      category: "欧盟",
      title: "欧盟竞争条例",
      summary: "欧盟委员会发布的竞争规则，维护统一市场公平竞争。",
      date: "2021-05-15",
      link: "#",
    },
    {
      id: 3,
      category: "美国",
      title: "谢尔曼反托拉斯法",
      summary: "美国反垄断的基础法律，禁止垄断与不正当竞争。",
      date: "1890-07-02",
      link: "#",
    }
  ],
  cases: [
    {
      id: 1,
      category: "平台经济",
      title: "某电商平台“二选一”案",
      summary: "涉嫌滥用市场支配地位，强迫商家二选一。",
      date: "2024-03-10",
      link: "#",
    },
    {
      id: 2,
      category: "并购审查",
      title: "某科技公司收购案被否决",
      summary: "并购可能导致市场垄断，监管机构否决。",
      date: "2023-11-05",
      link: "#",
    },
    {
      id: 3,
      category: "价格垄断",
      title: "某医药企业价格垄断案",
      summary: "协同行为导致药品价格大幅上涨。",
      date: "2023-06-18",
      link: "#",
    }
  ],
  reports: [
    {
      id: 1,
      category: "年度报告",
      title: "全球反垄断发展报告2024",
      summary: "总结全球反垄断执法与政策趋势。",
      date: "2024-12-31",
      link: "#",
    },
    {
      id: 2,
      category: "专题分析",
      title: "数字经济竞争政策研究",
      summary: "探讨数字经济领域的竞争政策挑战与对策。",
      date: "2025-02-15",
      link: "#",
    },
    {
      id: 3,
      category: "案例集",
      title: "并购案例精编",
      summary: "收录近年来典型并购案例并评析。",
      date: "2024-09-20",
      link: "#",
    }
  ]
};

// 为首页添加示例新闻数据，便于前端新闻模块的渲染。
// 如果没有新闻数据，主页的新闻列表在原代码中会报错，因此这里提供几条示例。
data.news = [
  {
    id: 1,
    title: "反垄断法修订发布",
    date: "2025-05-20",
    content: "新修订的反垄断法正式实施，强化了对数字经济领域的监管，并完善了罚则。",
  },
  {
    id: 2,
    title: "数字平台监管会议召开",
    date: "2025-04-30",
    content: "多部门联合召开平台经济监管会议，探讨公平竞争和用户权益保护。",
  },
  {
    id: 3,
    title: "全球竞争政策趋势分析",
    date: "2025-03-10",
    content: "最新发布的年度报告总结了全球范围内竞争政策的最新动向和案例。",
  },
];

// 在数据定义后对部分字段进行补充和处理
// 为每位专家添加 avatar_url 和 institution 字段，便于前端渲染
data.experts.forEach(expert => {
  // 设置 avatar_url 字段以兼容 main.js 中的使用
  expert.avatar_url = expert.avatar;
  // 通过 institution_id 在机构列表中找到对应的机构名称
  const inst = data.institutions.find(i => i.id === expert.institution_id);
  expert.institution = inst ? inst.name : '';
});
// 将数据导出到全局作用域，供其他脚本使用
// 为向后兼容，既导出 appData，也导出 DATA
window.appData = data;
window.DATA = data;