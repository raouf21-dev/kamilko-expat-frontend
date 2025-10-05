import React from 'react';
import { X, Check, AlertCircle, Clock, FileText, Users, Briefcase, RefreshCw, Languages } from 'lucide-react';

const getServiceTranslations = (lang) => {
  const translations = {
    en: {
      readyTitle: 'Ready to Get Started?',
      readySubtitle: 'Contact us today to begin your {service} process',
      contactButton: 'Contact Us'
    },
    fr: {
      readyTitle: 'Prêt à Commencer?',
      readySubtitle: 'Contactez-nous aujourd\'hui pour commencer votre processus {service}',
      contactButton: 'Nous Contacter'
    },
    ar: {
      readyTitle: 'هل أنت مستعد للبدء؟',
      readySubtitle: 'اتصل بنا اليوم لبدء عملية {service}',
      contactButton: 'اتصل بنا'
    },
    pt: {
      readyTitle: 'Pronto para Começar?',
      readySubtitle: 'Contacte-nos hoje para iniciar o seu processo de {service}',
      contactButton: 'Contacte-nos'
    }
  };
  return translations[lang] || translations.en;
};

const services = {
  nif: {
    title: 'NIF Application',
    subtitle: 'Número de Identificação Fiscal',
    // price: '€99',
    icon: FileText,
    sections: [
      {
        title: 'What is NIF?',
        content: "The NIF (Tax Identification Number) is Portugal's equivalent to a Tax ID or Social Security Number. It's a unique 9-digit number that identifies you for all tax and administrative purposes in Portugal."
      },
      {
        title: 'Why You Need It',
        content: "The NIF is absolutely essential and the FIRST step for anyone moving to Portugal.",
        list: [
          'Open a bank account',
          'Sign a rental contract or purchase property',
          'Set up utilities (water, electricity, internet)',
          'Register for healthcare',
          'Apply for residence permits',
          'Start a business',
          'Buy a car or mobile phone plan',
          'File taxes in Portugal'
        ]
      },
      {
        title: 'Who Needs It?',
        list: [
          'Anyone planning to live, work, or invest in Portugal',
          'Property buyers (even if not residing in Portugal)',
          'Remote workers applying for D7 or Digital Nomad visas',
          'Students enrolling in Portuguese universities',
          'Retirees moving to Portugal'
        ]
      },
      {
        title: 'Documents Required',
        list: [
          'Valid passport (original and copy)',
          'Proof of address (utility bill, rental contract, or hotel booking)',
          'Portuguese tax representative (if applying from outside Portugal)',
          'Completed application form'
        ]
      },
      {
        title: 'Processing Time',
        highlights: [
          { label: 'With Euro Expat', value: '1-2 weeks', positive: true },
          { label: 'Without assistance', value: '4-6 weeks or longer', positive: false }
        ]
      },
      {
        title: 'How We Help',
        list: [
          'Fast-track appointment booking at Portuguese Tax Office (Finanças)',
          'Complete form preparation and submission',
          'Tax representative services (if needed)',
          'Follow-up until you receive your NIF certificate',
          'Guidance on using your NIF for other procedures'
        ]
      }
    ]
  },

  niss: {
    title: 'NISS Registration',
    subtitle: 'Número de Identificação da Segurança Social',
    // price: '€79',
    icon: Users,
    sections: [
      {
        title: 'What is NISS?',
        content: "NISS is your Portuguese Social Security Number. It's a unique identifier that connects you to Portugal's social security system, giving you access to healthcare, pensions, and social benefits."
      },
      {
        title: 'Why You Need It',
        content: 'The NISS is crucial for:',
        list: [
          'Legal employment in Portugal',
          'Accessing public healthcare (SNS)',
          'Receiving unemployment benefits',
          'Pension contributions',
          'Maternity/paternity leave',
          'Sickness benefits',
          'Family allowances',
          'Opening certain types of bank accounts'
        ]
      },
      {
        title: 'Who Needs It?',
        list: [
          'Anyone planning to work in Portugal (employed or self-employed)',
          'Freelancers and remote workers',
          'Business owners',
          'Residents seeking healthcare access',
          'Anyone contributing to Portuguese social security'
        ]
      },
      {
        title: 'Documents Required',
        list: [
          'Valid passport',
          'NIF (Tax ID - must have this first!)',
          'Proof of address in Portugal',
          'Employment contract or proof of self-employment',
          'Birth certificate (sometimes required)'
        ]
      },
      {
        title: 'Processing Time',
        highlights: [
          { label: 'With Euro Expat', value: '2-3 weeks', positive: true },
          { label: 'Without assistance', value: '6-8 weeks', positive: false }
        ]
      },
      {
        title: 'Benefits of NISS',
        list: [
          'Full access to Portuguese public healthcare',
          'Legal work authorization',
          'Pension contributions (can transfer from other EU countries)',
          'Protection in case of unemployment or illness',
          'Family benefits and allowances'
        ]
      }
    ]
  },

  courses: {
    title: 'Course Enrollment & Certification',
    subtitle: 'Portuguese Integration Courses',
    // price: '€149',
    icon: FileText,
    note: 'Course fees additional - paid directly to institution',
    sections: [
      {
        title: 'What is This?',
        content: 'For certain residence permit categories, Portuguese immigration requires proof of integration efforts. Enrolling in certified Portuguese language or cultural courses demonstrates your commitment to integrating into Portuguese society.'
      },
      {
        title: 'Why You Need It',
        content: 'Required for:',
        list: [
          'Work visa applications',
          'D7 visa (passive income visa)',
          'Family reunification permits',
          'Permanent residency applications',
          'Citizenship applications (proof of integration)',
          'Golden Visa renewal (in some cases)'
        ]
      },
      {
        title: 'What Courses Qualify?',
        list: [
          'Portuguese language courses (A1, A2, B1, B2 levels)',
          'Portuguese culture and history courses',
          'Professional integration courses',
          'Vocational training recognized by Portuguese authorities',
          'Online courses from accredited institutions'
        ]
      },
      {
        title: 'Course Options',
        options: [
          {
            name: 'Online Courses',
            // price: '€150-300',
            features: ['Flexible schedule', 'Study from anywhere', 'Officially recognized certificates', '20-40 hours']
          },
          {
            name: 'In-Person Classes',
            // price: '€200-500',
            features: ['Better for networking', 'Immersive experience', '2-3 months, 2-3 times per week']
          },
          {
            name: 'Intensive Courses',
            // price: '€400-800',
            features: ['Fast completion (1-2 weeks)', 'Full-time commitment', 'Great for urgent applications']
          }
        ]
      },
      {
        title: 'How We Help',
        list: [
          'Recommend approved course providers',
          'Enroll you in the right level for your needs',
          'Ensure courses meet AIMA (immigration) requirements',
          'Track your progress',
          'Obtain official certificates for your residency file',
          'Coordinate with immigration authorities'
        ]
      }
    ]
  },

  aima: {
    title: 'AIMA Appointments',
    subtitle: 'Immigration Service Appointments',
    // price: '€199',
    icon: Clock,
    extraService: '€299 with accompaniment and interpreter',
    sections: [
      {
        title: 'What is AIMA?',
        content: "AIMA (Agência para a Integração, Migrações e Asilo) is Portugal's immigration service, formerly known as SEF. They handle all residence permit applications, renewals, and immigration matters."
      },
      {
        title: 'The Problem',
        problems: [
          'Appointments book out in seconds',
          'Website often crashes',
          'No appointment = delayed residency',
          'Can wait 6-12 months without help',
          'Different appointment types for different stages'
        ]
      },
      {
        title: 'How We Help - 24/7 Monitoring',
        list: [
          '24/7 Monitoring: We check for available appointments constantly',
          'Instant Booking: When slots open, we book immediately',
          'Multiple Locations: We monitor all AIMA offices across Portugal',
          'Priority Service: Our clients get appointments within 2-4 weeks',
          'Preparation: We prepare all your documents before the appointment',
          'Accompaniment: We can attend with you (translation support)'
        ]
      },
      {
        title: 'Types of AIMA Appointments',
        list: [
          'Initial Residence Permit Application',
          'Biometric Data Collection (fingerprints, photo)',
          'Document Submission',
          'Permit Renewal',
          'Change of Status',
          'Family Reunification'
        ]
      },
      {
        title: 'What Happens at AIMA',
        list: [
          'Document verification',
          'Biometric data collection (fingerprints, photo)',
          'Interview (basic questions about your situation)',
          'Final submission of application',
          'Receipt of protocol (temporary residence proof)'
        ]
      },
      {
        title: 'Success Rate',
        content: 'With proper documentation preparation: 98% approval rate'
      }
    ]
  },

  citizenship: {
    title: 'Citizenship Application',
    subtitle: 'Portuguese Citizenship & EU Passport',
    // price: '€599',
    icon: FileText,
    note: 'Government fees (€250) paid separately',
    sections: [
      {
        title: 'What is Portuguese Citizenship?',
        content: 'Portuguese citizenship gives you full rights as an EU citizen, including:',
        list: [
          'Portuguese passport (visa-free travel to 180+ countries)',
          'Right to live and work anywhere in the EU',
          'Voting rights',
          'Access to all social benefits',
          'No need to renew residence permits ever again'
        ]
      },
      {
        title: 'Who Can Apply?',
        eligibility: [
          {
            route: 'Residency Route (Most Common)',
            requirements: [
              'Lived in Portugal legally for 5 years',
              'Basic Portuguese language skills (A2 level)',
              'Clean criminal record',
              'Proof of ties to Portugal'
            ]
          },
          {
            route: 'Marriage to Portuguese Citizen',
            requirements: [
              'Married for 3+ years',
              'Or 6 years if living abroad',
              'Portuguese language proficiency'
            ]
          },
          {
            route: 'Portuguese Ancestry',
            requirements: [
              'Grandparents or great-grandparents born in Portugal',
              'Sephardic Jewish heritage',
              'Born in Portugal'
            ]
          },
          {
            route: 'Investment Route',
            requirements: [
              'Golden Visa holders after 5 years',
              'Must pass language and integration tests'
            ]
          }
        ]
      },
      {
        title: 'Requirements',
        list: [
          'Legal residence for 5+ years',
          'Portuguese language certificate (A2 level minimum)',
          'Clean criminal record (Portugal and country of origin)',
          'Proof of ties to Portuguese community',
          'Knowledge of Portuguese history and culture',
          'Tax compliance in Portugal'
        ]
      },
      {
        title: 'The Application Process (12-18 Months)',
        phases: [
          {
            phase: 'Preparation (2-3 months)',
            steps: ['Gather all required documents', 'Obtain language certificate', 'Get criminal record certificates', 'Collect tax records', 'Prove residence history']
          },
          {
            phase: 'Submission',
            steps: ['Submit application online or at registry office', 'Pay application fee (€250)', 'Receive application number']
          },
          {
            phase: 'Review (6-12 months)',
            steps: ['Background checks', 'Document verification', 'Possible interview', 'Additional documents may be requested']
          },
          {
            phase: 'Decision',
            steps: ['Approval or denial notification', 'If approved: Schedule oath ceremony']
          },
          {
            phase: 'Oath & Passport',
            steps: ['Take citizenship oath', 'Receive citizenship certificate', 'Apply for Portuguese passport']
          }
        ]
      },
      {
        title: 'Benefits of Portuguese Citizenship',
        list: [
          '🇵🇹 Portuguese passport (6th most powerful in the world)',
          '🇪🇺 EU citizenship (live/work in 27 countries)',
          '✈️ Visa-free travel to 180+ countries',
          '🏛️ Full political rights (vote, run for office)',
          '🏥 Full healthcare access',
          '🎓 EU university tuition rates',
          '👨‍👩‍👧 Pass citizenship to children'
        ]
      },
      {
        title: 'Dual Citizenship',
        content: 'Portugal allows dual citizenship! You can keep your original nationality.'
      }
    ]
  },

  business: {
    title: 'Business Activity Setup',
    subtitle: 'Abrir Atividade in Portugal',
    // price: '€299',
    icon: Briefcase,
    note: 'Government fees (€360+) paid separately. Monthly accounting not included (€50-150/month with partners)',
    sections: [
      {
        title: 'What is Atividade?',
        content: '"Abrir Atividade" means opening your business activity with Portuguese tax authorities. Essential for freelancers, remote workers, and business owners.'
      },
      {
        title: 'Who Needs This?',
        list: [
          'Digital nomads with remote income',
          'Freelancers (designers, developers, consultants)',
          'Small business owners',
          'Self-employed professionals',
          'D7 visa holders working remotely',
          'Anyone starting a company in Portugal'
        ]
      },
      {
        title: 'Types of Business Structures',
        types: [
          {
            name: 'Trabalhador Independente (Self-Employed)',
            description: 'Simplest option for freelancers and consultants. Lower setup costs, flexible tax regime options.'
          },
          {
            name: 'Unipessoal por Quotas (Single-Person LLC)',
            description: 'Limited liability protection. More professional image. Required for certain activities.'
          },
          {
            name: 'Sociedade por Quotas (LLC with Partners)',
            description: 'Multiple owners, shared liability, formal structure. Best for growing businesses.'
          },
          {
            name: 'Sucursal (Branch Office)',
            description: 'For foreign companies opening in Portugal. Parent company retains control.'
          }
        ]
      },
      {
        title: 'Tax Regimes Explained',
        regimes: [
          {
            name: 'Simplified Regime (Most Common)',
            features: ['75% automatic expense deduction', '25% of income is taxable', 'Minimal bookkeeping required', 'Best for most freelancers']
          },
          {
            name: 'Organized Accounting',
            features: ['Deduct actual expenses', 'Requires professional accountant', 'Better for high expenses', 'More complex']
          }
        ]
      },
      {
        title: 'NHR (Non-Habitual Resident) Benefits',
        content: 'If you qualify for NHR status:',
        list: [
          '20% flat tax on Portuguese-source income',
          '0% tax on certain foreign income',
          'Valid for 10 years',
          'HUGE tax savings!'
        ]
      },
      {
        title: 'Timeline',
        timelines: [
          { type: 'Trabalhador Independente', time: '1-2 days' },
          { type: 'Company Registration', time: '1 week' },
          { type: 'Full setup with bank account', time: '2-3 weeks' }
        ]
      },
      {
        title: 'How We Help',
        list: [
          'Consult on best business structure',
          'CAE code selection',
          'Complete registration process',
          'Tax regime optimization',
          'Social security registration',
          'Accountant referrals',
          'Banking assistance',
          'Ongoing compliance guidance'
        ]
      }
    ]
  },

  renewal: {
    title: 'Permit Renewals',
    subtitle: 'Residence Permit Renewal Services',
    //: '€249',
    icon: RefreshCw,
    note: 'AIMA government fees (€80-170) paid separately',
    sections: [
      {
        title: 'What are Permit Renewals?',
        content: 'Most Portuguese residence permits are temporary (1-2 years) and must be renewed before expiration. Renewal is NOT automatic - you must actively apply and meet continued requirements.'
      },
      {
        title: 'Types of Permits We Renew',
        list: [
          'Work permits',
          'D7 visas (passive income/retirement)',
          'Digital Nomad visas',
          'Family reunification permits',
          'Student residence permits',
          'Golden Visa',
          'Startup visa',
          'Job seeker permits'
        ]
      },
      {
        title: 'When to Renew',
        alert: 'CRITICAL: Apply 30-90 days BEFORE expiration!',
        warnings: [
          'Too early: Application rejected',
          'Too late: Penalties or permit expiration',
          'Expired permit: Major legal issues'
        ]
      },
      {
        title: 'All Permits Require',
        list: [
          'Valid passport (minimum 3 months validity)',
          'Proof of continued legal residence',
          'Updated proof of income/employment',
          'Health insurance (valid for renewal period)',
          'Tax compliance certificate',
          'Clean criminal record (sometimes)',
          'Proof of address',
          'No absences exceeding limits'
        ]
      },
      {
        title: 'Timeline',
        timelines: [
          { phase: 'Application preparation', time: '1-2 weeks' },
          { phase: 'AIMA appointment wait', time: '2-8 weeks (with our help)' },
          { phase: 'Decision after appointment', time: '2-6 months' },
          { phase: 'Total process', time: '3-8 months' }
        ]
      },
      {
        title: 'How We Help',
        list: [
          'Renewal timeline management (remind you when to apply)',
          'Document checklist specific to your permit type',
          'AIMA appointment booking',
          'Document preparation and review',
          'Translation services',
          'Application submission',
          'Follow-up with authorities',
          'Problem resolution (if issues arise)',
          'Accompaniment to AIMA (if needed)'
        ]
      },
      {
        title: 'Permanent Residence',
        content: 'After 5 years with temporary permits, you can apply for permanent residence. No more renewals needed! Almost same rights as citizens. Valid for 5 years, then renewable indefinitely.'
      }
    ]
  },

  portuguese: {
    title: 'Learn Portuguese',
    subtitle: 'Portuguese Language Courses for Expats',
    //: 'From €15/hour',
    icon: Languages,
    sections: [
      {
        title: 'Why Learn Portuguese?',
        content: "Learning Portuguese isn't just helpful - it's often REQUIRED and always beneficial for:",
        list: [
          'Residence permit applications (proof of integration)',
          'Citizenship (A2 level required)',
          'Daily life and integration',
          'Job opportunities',
          'Making friends and networking',
          'Understanding legal documents',
          'Healthcare communication',
          'Better quality of life'
        ]
      },
      {
        title: 'Course Levels (CEFR Standard)',
        levels: [
          {
            level: 'A1 - Absolute Beginner (40 hours)',
            description: 'Basic greetings, numbers, dates, shopping, asking directions. Good for daily survival.'
          },
          {
            level: 'A2 - Elementary (60 hours)',
            description: 'Describing people, past/future tenses, appointments, healthcare, banking. Required for Portuguese citizenship.',
            required: true
          },
          {
            level: 'B1 - Intermediate (80 hours)',
            description: 'Express opinions, handle travel situations, understand TV/news basics. Good for work and social life.'
          },
          {
            level: 'B2 - Upper Intermediate (100 hours)',
            description: 'Fluent conversations, professional communication, read newspapers. Good for professional careers.'
          }
        ]
      },
      {
        title: 'Learning Options',
        options: [
          {
            name: 'Online Group Classes',
            // price: '€15-25/hour',
            features: ['2-3 times per week', '90-minute sessions', '8-15 students per class', 'Interactive via Zoom', 'Flexible schedule']
          },
          {
            name: 'Private Tutoring',
            // price: '€25-40/hour',
            features: ['One-on-one lessons', 'Customized pace and content', 'Schedule flexibility', 'Fastest progress']
          },
          {
            name: 'Intensive Courses',
            // price: '€400-800 per level',
            features: ['3-4 hours daily', 'Complete level in 2-4 weeks', 'Immersive experience', 'Best for urgent needs']
          },
          {
            name: 'Self-Study with Support',
            // price: '€50-100/month',
            features: ['Online platform access', 'Weekly tutor check-ins', 'Practice exercises', 'Most affordable']
          }
        ]
      },
      {
        title: 'Special Features for Arabic Speakers',
        content: 'Bilingual instruction available with teachers who speak Arabic, Arabic-Portuguese learning materials, cultural bridges explained, and common mistakes for Arabic speakers addressed.'
      },
      {
        title: 'Immigration-Focused Content',
        subtitle: 'Vocabulary You Actually Need',
        topics: [
          'At the immigration office (AIMA)',
          'Tax office (Finanças)',
          'Social Security office',
          'Healthcare system',
          'Renting apartments',
          'Job interviews',
          'Bank accounts',
          'Legal documents'
        ]
      },
      {
        title: 'Official Certifications',
        content: 'We prepare you for:',
        certs: [
          'CIPLE (A2): Required for citizenship',
          'DEPLE (B1): For advanced integration',
          'DIPLE (B2): For professional needs',
          'University of Lisbon certificates',
          'Camões Institute certificates'
        ]
      },
      {
        title: "What's Included",
        list: [
          'Placement test (determine your level)',
          'Customized learning plan',
          'Course materials (digital books, audio)',
          'Weekly homework and corrections',
          'Progress tracking',
          'Certificate upon completion',
          'Immigration-ready documentation',
          'Exam preparation included'
        ]
      }
    ]
  }
};

const ServiceDetails = ({ serviceKey, onClose, isRTL, t }) => {
  const service = services[serviceKey];

  if (!service) return null;

  const Icon = service.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-t-lg relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{service.title}</h1>
                <p className="text-blue-100 text-lg">{service.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="text-4xl font-bold">{service.price}</div> */}
              {service.note && (
                <p className="text-sm text-blue-100 max-w-xs">{service.note}</p>
              )}
            </div>

            {service.extraService && (
              <p className="text-sm text-blue-100 mt-2">{service.extraService}</p>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {service.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>

                {section.content && (
                  <p className="text-gray-700 mb-4">{section.content}</p>
                )}

                {section.alert && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="font-semibold text-red-800">{section.alert}</p>
                    </div>
                  </div>
                )}

                {section.list && (
                  <ul className="space-y-2 mb-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.problems && (
                  <ul className="space-y-2 mb-4">
                    {section.problems.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.warnings && (
                  <ul className="space-y-2 mb-4">
                    {section.warnings.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.highlights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {section.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-lg ${
                          highlight.positive
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="text-sm text-gray-600">{highlight.label}</div>
                        <div className={`text-xl font-bold ${
                          highlight.positive ? 'text-green-700' : 'text-gray-700'
                        }`}>{highlight.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {section.options && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {section.options.map((option, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                        {/* <p className="text-blue-600 font-bold mb-3">{option.price}</p> */}
                        <ul className="space-y-1">
                          {option.features.map((feature, j) => (
                            <li key={j} className="text-sm text-gray-600 flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.eligibility && (
                  <div className="space-y-4">
                    {section.eligibility.map((route, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">{route.route}</h3>
                        <ul className="space-y-1">
                          {route.requirements.map((req, j) => (
                            <li key={j} className="flex items-start text-sm text-gray-700">
                              <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.phases && (
                  <div className="space-y-4">
                    {section.phases.map((phase, i) => (
                      <div key={i} className="border-l-4 border-blue-600 pl-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{phase.phase}</h3>
                        <ul className="space-y-1">
                          {phase.steps.map((step, j) => (
                            <li key={j} className="text-sm text-gray-600">• {step}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.types && (
                  <div className="space-y-3">
                    {section.types.map((type, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900">{type.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.regimes && (
                  <div className="space-y-3">
                    {section.regimes.map((regime, i) => (
                      <div key={i} className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">{regime.name}</h3>
                        <ul className="space-y-1">
                          {regime.features.map((feature, j) => (
                            <li key={j} className="text-sm text-gray-700 flex items-start">
                              <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.timelines && (
                  <div className="space-y-2">
                    {section.timelines.map((timeline, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700">{timeline.type || timeline.phase}</span>
                        <span className="font-semibold text-blue-900">{timeline.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.levels && (
                  <div className="space-y-3">
                    {section.levels.map((level, i) => (
                      <div key={i} className={`p-4 rounded-lg ${level.required ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                        <h3 className="font-semibold text-gray-900 mb-1">{level.level}</h3>
                        <p className="text-sm text-gray-600">{level.description}</p>
                        {level.required && (
                          <span className="inline-block mt-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Required for Citizenship
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.topics && (
                  <div className="grid grid-cols-2 gap-2">
                    {section.topics.map((topic, i) => (
                      <div key={i} className="text-sm text-gray-700 flex items-start">
                        <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.certs && (
                  <ul className="space-y-2">
                    {section.certs.map((cert, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-4">Contact us today to begin your {service.title.toLowerCase()} process</p>
                <button
                  onClick={onClose}
                  className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
