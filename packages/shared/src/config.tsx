import { type Config } from './types';

export const config: Config = {
  // General
  projectName: "ShadCN Theme Creator for Chrome",
  projectDescription: "Boost productivity and create stunning ShadCN UI themes in real-time. Customize, preview, and export with ease using our Chrome extension.",
  projectTagline: "Customize Your UI in Real-Time with ShadCN Theme Creator for Chrome",

  // Links
  purchaseUrl: "https://chrome.google.com/webstore",
  githubUrl: "https://github.com/felipebarcelospro/shadcn-theme-creator-for-chrome",
  twitterUrl: "https://twitter.com/feldbarcelospro",

  // Developer Info
  developerName: "Felipe Barcelos",
  developerEmail: "felipe.barcelospro@gmail.com",
  developerImage: "https://media.licdn.com/dms/image/v2/D4D03AQHvSr_V9EAOjQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1728308774937?e=1734566400&v=beta&t=QAfLIR7Q60F1AEatAqPzGAXUjKTlhGvpFtexpyDki5U",
  developerBio: "I'm a passionate software engineer and entrepreneur from 🇧🇷, dedicated to transforming ideas into scalable, profitable SaaS products.",

  // Features
  features: [
    {
      title: "Automatic Detection",
      description: "Instantly recognizes ShadCN UI compatible websites, streamlining your workflow.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>)
    },
    {
      title: "Intuitive Interface",
      description: "Easy-to-use color pickers for seamless theme adjustments and customization.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>)
    },
    {
      title: "Real-time Preview",
      description: "Witness changes instantly as you customize, enhancing your design process.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>)
    },
    {
      title: "Export Themes",
      description: "Save and reuse your custom themes across multiple projects effortlessly.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>)
    },
    {
      title: "Optimized Performance",
      description: "Built with React and TypeScript for unparalleled speed and reliability.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>)
    },
    {
      title: "Privacy-First",
      description: "All customizations occur locally in your browser, ensuring data privacy.",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>)
    }
  ],

  // FAQ
  faq: [
    {
      question: "What is ShadCN Theme Creator for Chrome?",
      answer: "ShadCN Theme Creator for Chrome is a Chrome extension that allows real-time customization and preview of ShadCN UI themes, enhancing your web development workflow."
    },
    {
      question: "How does ShadCN Theme Creator for Chrome work?",
      answer: "It integrates with your browser, allowing you to modify ShadCN UI theme variables on-the-fly and see changes instantly on any website using ShadCN UI."
    },
    {
      question: "Is ShadCN Theme Creator for Chrome free to use?",
      answer: "Yes, ShadCN Theme Creator for Chrome is completely free. You can download it from the Chrome Web Store and start customizing immediately."
    },
    {
      question: "How do I export my customized theme?",
      answer: "Simply click the \"Export Theme\" button in the extension to generate a CSS file with your customized theme variables, ready to use in your projects."
    },
    {
      question: "Can I use ShadCN Theme Creator for Chrome with any website?",
      answer: "ShadCN Theme Creator for Chrome works with any website that uses ShadCN UI. It automatically detects compatible sites and enables customization."
    },
    {
      question: "Does ShadCN Theme Creator for Chrome support dark mode?",
      answer: "Yes, you can customize both light and dark mode themes separately, ensuring your design looks great in any color scheme."
    },
    {
      question: "How often is ShadCN Theme Creator for Chrome updated?",
      answer: "We regularly update ShadCN Theme Creator for Chrome to ensure compatibility with the latest ShadCN UI versions and to add new features based on user feedback."
    },
    {
      question: "Can I save multiple custom themes?",
      answer: "Yes, ShadCN Theme Creator for Chrome allows you to save and manage multiple custom themes, making it easy to switch between different designs."
    },
    {
      question: "Is ShadCN Theme Creator for Chrome suitable for beginners?",
      answer: "Absolutely! ShadCN Theme Creator for Chrome is designed to be user-friendly, making it accessible for beginners while still offering powerful features for experienced developers."
    },
    {
      question: "How can I contribute to ShadCN Theme Creator for Chrome?",
      answer: "We welcome contributions! Visit our GitHub repository to submit issues, feature requests, or pull requests. Your input helps improve the tool for everyone."
    }
  ],

  // Legal
  termsOfUseUrl: "/terms-of-use",
  privacyPolicyUrl: "/privacy-policy",
};