export const translations = {
  en: {
    common: {
      call: "Call",
      edit: "Edit",
      copy: "Copy",
      delete: "Delete",
      createAgent: "Create Agent",
      search: "Search agents...",
    },
    nav: {
      title: "VAPI Agent Builder",
      subtitle: "Manage your AI voice agents",
      buildAgents: "Build custom AI agents",
      makeCalls: "Make voice calls",
      fullCustomization: "Full customization",
    },
    home: {
      myAgents: "My Agents",
      manageAgents: "Manage and deploy your custom AI voice agents",
      customerSupportAgent: "Customer Support Agent",
      technicalSupportSpecialist: "Technical Support Specialist",
      salesRepresentative: "Sales Representative",
      duration: "10m",
      customAgentsTitle: "Custom AI Agents",
      customAgentsDesc: "Create agents with custom prompts, personalities, and behaviors tailored to your needs",
      fullControlTitle: "Full Control",
      fullControlDesc: "Configure voice, model, interruption settings, and more with an intuitive interface",
      instantDeploymentTitle: "Instant Deployment",
      instantDeploymentDesc: "Test and deploy your agents instantly with one-click voice calling",
    },
  },
  zh: {
    common: {
      call: "通话",
      edit: "编辑",
      copy: "复制",
      delete: "删除",
      createAgent: "创建代理",
      search: "搜索代理...",
    },
    nav: {
      title: "VAPI 代理构建器",
      subtitle: "管理您的 AI 语音代理",
      buildAgents: "构建自定义 AI 代理",
      makeCalls: "进行语音通话",
      fullCustomization: "完全自定义",
    },
    home: {
      myAgents: "我的代理",
      manageAgents: "管理和部署您的自定义 AI 语音代理",
      customerSupportAgent: "客户支持代理",
      technicalSupportSpecialist: "技术支持专家",
      salesRepresentative: "销售代表",
      duration: "10分钟",
      customAgentsTitle: "自定义 AI 代理",
      customAgentsDesc: "创建具有自定义提示、个性和行为的代理，以满足您的需求",
      fullControlTitle: "完全控制",
      fullControlDesc: "通过直观的界面配置语音、模型、中断设置等",
      instantDeploymentTitle: "即时部署",
      instantDeploymentDesc: "通过一键语音通话即时测试和部署您的代理",
    },
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;