import { Project, HomepageSettings, Testimonial } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    slug: 'church-automation-system',
    title: 'Church Management & Automation Platform',
    category: 'AI Automation',
    shortDescription: 'Complete automation system for church operations including attendance, donations, and member management.',
    fullDescription: 'Built a comprehensive automation platform that streamlines church operations, from automated attendance tracking to member engagement systems.',
    techStack: ['React', 'Django', 'n8n', 'PostgreSQL', 'Stripe'],
    problem: 'Churches struggled with manual processes for tracking attendance, managing donations, and engaging with members effectively.',
    solution: 'Developed an integrated platform with automated workflows, real-time dashboards, and seamless payment processing.',
    features: [
      'Automated attendance tracking with QR codes',
      'Donation management with Stripe integration',
      'Member database with engagement tracking',
      'Automated email and SMS campaigns',
      'Real-time analytics dashboard'
    ],
    result: 'Reduced administrative workload by 70% and increased member engagement by 45%.',
    status: 'published',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    slug: 'university-portal',
    title: 'University Management Portal',
    category: 'Web Application',
    shortDescription: 'Comprehensive web portal for university administration, student management, and course registration.',
    fullDescription: 'Developed a full-featured university management system handling everything from admissions to graduation.',
    techStack: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Redis'],
    problem: 'University needed a modern system to replace outdated manual processes for student management.',
    solution: 'Built a scalable web portal with role-based access for students, faculty, and administrators.',
    features: [
      'Student registration and enrollment system',
      'Course management and scheduling',
      'Grade tracking and transcripts',
      'Faculty portal for course management',
      'Payment integration for fees'
    ],
    result: 'Successfully deployed to 5,000+ students with 99.9% uptime.',
    status: 'published',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    slug: 'ai-chatbot-assistant',
    title: 'AI-Powered Customer Support Chatbot',
    category: 'AI Solution',
    shortDescription: 'Intelligent chatbot system that handles customer inquiries with natural language processing.',
    fullDescription: 'Created an AI chatbot that understands context, learns from interactions, and provides accurate responses.',
    techStack: ['Python', 'OpenAI API', 'LangChain', 'React', 'FastAPI'],
    problem: 'Company was overwhelmed with customer support tickets and needed 24/7 support coverage.',
    solution: 'Implemented an AI chatbot that handles common queries and escalates complex issues to human agents.',
    features: [
      'Natural language understanding',
      'Context-aware responses',
      'Multi-language support',
      'Integration with existing support systems',
      'Learning from past interactions'
    ],
    result: 'Handled 80% of customer inquiries automatically, reducing response time from hours to seconds.',
    status: 'published',
    createdAt: '2024-03-10'
  },
  {
    id: '4',
    slug: 'payment-integration-system',
    title: 'Multi-Gateway Payment Integration',
    category: 'Payment System',
    shortDescription: 'Unified payment system integrating multiple payment gateways for African and international transactions.',
    fullDescription: 'Built a robust payment infrastructure supporting Paystack, Flutterwave, and international gateways.',
    techStack: ['Node.js', 'Express', 'React', 'MongoDB', 'Stripe', 'Paystack'],
    problem: 'E-commerce platform needed to accept payments from multiple sources and currencies.',
    solution: 'Developed a unified payment API that handles multiple gateways with automatic routing and reconciliation.',
    features: [
      'Multiple payment gateway support',
      'Automatic currency conversion',
      'Transaction reconciliation',
      'Webhook management',
      'Real-time payment tracking'
    ],
    result: 'Processed over ₦100M in transactions with 99.99% success rate.',
    status: 'published',
    createdAt: '2024-04-05'
  },
  {
    id: '5',
    slug: 'workflow-automation-platform',
    title: 'No-Code Workflow Automation',
    category: 'Automation',
    shortDescription: 'Visual workflow builder for automating business processes without coding.',
    fullDescription: 'Created an n8n-based automation platform with custom integrations for African services.',
    techStack: ['n8n', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
    problem: 'Small businesses needed automation but lacked technical resources to build custom solutions.',
    solution: 'Built a user-friendly platform with pre-built templates and drag-and-drop workflow creation.',
    features: [
      'Visual workflow builder',
      'Pre-built templates',
      'Custom integrations',
      'Scheduled automations',
      'API connectors'
    ],
    result: 'Enabled 50+ businesses to automate repetitive tasks, saving an average of 20 hours per week.',
    status: 'published',
    createdAt: '2024-05-12'
  },
  {
    id: '6',
    slug: 'technical-training-platform',
    title: 'Technical Training & Consulting Platform',
    category: 'Training',
    shortDescription: 'Online learning platform for technical training in AI, automation, and web development.',
    fullDescription: 'Developed a comprehensive training platform with video courses, live sessions, and hands-on projects.',
    techStack: ['React', 'Django', 'PostgreSQL', 'AWS', 'Zoom API'],
    problem: 'Growing demand for quality technical training in AI and automation for African developers.',
    solution: 'Built an interactive platform combining recorded courses with live mentorship sessions.',
    features: [
      'Video course management',
      'Live session scheduling',
      'Progress tracking',
      'Certification system',
      'Project-based learning'
    ],
    result: 'Trained 200+ developers in AI and automation technologies.',
    status: 'published',
    createdAt: '2024-06-01'
  }
];

export const mockHomepageSettings: HomepageSettings = {
  heroTitle: 'Experience simplicity in every interaction',
  heroSubtitle: 'We build AI-driven tools, automation systems, and modern applications that simplify your workflow, reduce manual effort, and help your business move faster.',
  heroPrimaryCTA: 'Book a Strategy Call',
  heroPrimaryLink: '/contact',
  heroSecondaryCTA: 'View Projects',
  heroSecondaryLink: '/projects',
  services: [
    {
      id: '1',
      title: 'AI & Automation Systems',
      description: 'Intelligent systems that automate repetitive tasks and provide insights from your data.',
      icon: 'Bot'
    },
    {
      id: '2',
      title: 'Custom Web Applications',
      description: 'Scalable web apps built with React, Django, FastAPI, and modern technologies.',
      icon: 'Globe'
    },
    {
      id: '3',
      title: 'API Integrations',
      description: 'Seamless integrations with payment gateways, CRMs, and third-party services.',
      icon: 'Plug'
    },
    {
      id: '4',
      title: 'Payment Systems',
      description: 'Secure payment processing with support for African and international gateways.',
      icon: 'CreditCard'
    },
    {
      id: '5',
      title: 'Technical Consulting',
      description: 'Expert guidance on architecture, technology choices, and best practices.',
      icon: 'Users'
    },
    {
      id: '6',
      title: 'Training & Workshops',
      description: 'Hands-on training in AI, automation, and fullstack development.',
      icon: 'GraduationCap'
    }
  ]
};

export const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Michael Adebayo',
    role: 'CTO',
    company: 'TechStart Africa',
    content: 'Sannex transformed our operations with an AI-powered automation system that saved us 30 hours per week. Their expertise in AI and automation is unmatched.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Operations Director',
    company: 'Global Ventures Ltd',
    content: 'The custom web application they built exceeded our expectations. Clean code, beautiful design, and delivered on time. Highly recommend!',
    rating: 5
  },
  {
    id: 3,
    name: 'Dr. Ibrahim Yusuf',
    role: 'Academic Lead',
    company: 'University of Lagos',
    content: 'Outstanding training program! The team helped us upskill our staff in modern web development and AI integration. Very practical and well-structured.',
    rating: 5
  },
  {
    id: 4,
    name: 'Jennifer Williams',
    role: 'Product Manager',
    company: 'FinTech Solutions',
    content: 'They integrated Stripe payments and automated our billing workflow seamlessly. Great communication and technical skills throughout the project.',
    rating: 5
  },
  {
    id: 5,
    name: 'Adeola Okafor',
    role: 'Founder & CEO',
    company: 'EduConnect',
    content: 'Sannex built our entire learning platform from scratch. The React frontend and Django backend work flawlessly together. True professionals!',
    rating: 5
  },
  {
    id: 6,
    name: 'David Martinez',
    role: 'IT Manager',
    company: 'RetailPro',
    content: 'The automation workflows they created with n8n and APIs have revolutionized how we handle customer data. Impressive problem-solving skills.',
    rating: 5
  }
];
