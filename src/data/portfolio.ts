export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
}

export interface ArchitectureModule {
  name: string;
  type: 'app' | 'core' | 'feature';
  responsibility: string;
  dependencies?: string[];
}

export interface EngineeringDeepDive {
  title: string;
  subtitle: string;
  problem: string;
  implementation: string;
  whyItMatters: string;
  codeSnippet?: string;
}

export interface FlagshipProject {
  id: string;
  titleEn: string;
  titleAr: string;
  tagline: string;
  badge: string;
  summary: string;
  githubUrl: string;
  videoUrl?: string;
  images: {
    mockup: string;
    screens: string;
    logo: string;
  };
  techStack: string[];
  problem: string;
  solution: string;
  modules: ArchitectureModule[];
  deepDives: EngineeringDeepDive[];
  workflow: {
    step: string;
    actor: 'Requester' | 'Runner' | 'System';
    title: string;
    description: string;
  }[];
  verifiedFeatures: string[];
  plannedFeatures: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  periodOrRole?: string;
  summary: string;
  engineeringHighlight: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured: boolean;
  domain: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  badge?: string;
  domain: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  logo: string;
}

export interface SkillGroup {
  category: string;
  description: string;
  skills: {
    name: string;
    priority?: boolean;
    note?: string;
  }[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  grade?: string;
  description: string;
  highlights: string[];
  logo: string;
}

export interface CourseItem {
  title: string;
  provider: string;
  description: string;
}

export const personalInfo = {
  name: 'Ahmed Khaled',
  role: 'Native Android Engineer',
  experienceYears: '2+ Years',
  location: 'Cairo, Egypt',
  militaryStatus: 'Exempted',
  bio: 'Native Android Engineer with 2+ years of hands-on production experience engineering, releasing, and maintaining native Android applications across food delivery, multi-service transportation, and e-commerce platforms. Specializing in modern Android with Kotlin, Jetpack Compose, MVVM, and Clean Architecture, with an uncompromising focus on app stability, reactive state synchronization, and maintainable modular codebases.',
  resumeUrl: '/Ahmed_Khaled.pdf',
  social: {
    github: 'https://github.com/AhmedKhaled2711',
    linkedin: 'https://www.linkedin.com/in/ahmed-khaled-android',
    email: 'eng.ahmedkhaled.work@gmail.com',
  } as SocialLinks,
  highlights: [
    { label: 'Production Apps', value: 'Food Delivery & Multi-Service' },
    { label: 'Core Architecture', value: 'Clean Arch + MVVM + UDF' },
    { label: 'Modern Tooling', value: 'Kotlin 2.0 • Jetpack Compose' },
    { label: 'Target Market', value: 'Egypt & GCC Region' },
  ]
};

export const hatliProject: FlagshipProject = {
  id: 'hatli',
  titleEn: 'Hatli',
  titleAr: 'هاتلي',
  tagline: 'Hyperlocal Community Errand & Delivery Marketplace',
  badge: 'Primary Flagship Architecture Case Study',
  summary: 'A modular, Clean Architecture Android application built with Kotlin, Jetpack Compose, and Material 3. Hatli solves peer-to-peer hyperlocal deliveries in emerging markets and small towns lacking structured street address grids through landmark-first navigation, dynamic dual-persona role switching, and real-time state synchronization.',
  githubUrl: 'https://github.com/AhmedKhaled2711/Hatli',
  videoUrl: 'https://www.youtube.com/watch?v=542VAY6xlq0&t=69s',
  images: {
    mockup: '/images/projects/hatli-mockup.jpg',
    screens: '/images/projects/hatli-screens.svg',
    logo: '/images/projects/hatli-logo.svg',
  },
  techStack: [
    'Kotlin 2.0',
    'Jetpack Compose (BOM 2025)',
    'Material 3',
    '12-Module Clean Architecture',
    'Hilt Dependency Injection',
    'Kotlin Coroutines & Flow',
    'Cloud Firestore',
    'Firebase Phone Auth (OTP)',
    'Room Database (hatli.db)',
    'Jetpack DataStore',
    'Retrofit & OkHttp',
    'Min SDK 29 (Android 10+)',
  ],
  problem: 'Conventional delivery platforms (e.g., Talabat, DoorDash) encounter severe operational friction in small towns and emerging markets: addresses lack geocoded street numbers, orders consist of open shopping lists across diverse local merchants rather than standardized catalog SKUs, and couriers are siloed in completely disconnected apps with high entry barriers.',
  solution: 'Hatli introduces a landmark-first errand engine where requesters specify approximate drop-offs with contextual landmark instructions, propose their own delivery fees, and interact directly with runners. A single app binary houses both Requester (طالب) and Runner (كابتن) roles, dynamically toggled once the user completes an in-app verification gate.',
  modules: [
    { name: ':app', type: 'app', responsibility: 'Application entry point, Hilt root container, Navigation Host, Firebase Messaging service integration.' },
    { name: ':core:model', type: 'core', responsibility: 'Pure Kotlin domain models (Request, UserProfile, ChatMessage, RequestStatus, LatLng).' },
    { name: ':core:common', type: 'core', responsibility: 'AppError hierarchy, Result<T> sealed wrappers, Coroutine Dispatchers (@IoDispatcher, @MainDispatcher).' },
    { name: ':core:domain', type: 'core', responsibility: 'Pure Kotlin business Use Cases: CreateRequestUseCase, ObserveRequestUseCase, SendChatMessageUseCase.' },
    { name: ':core:data', type: 'core', responsibility: 'Repository implementations, Firestore & Firebase Auth data sources, DataStore session preferences.' },
    { name: ':core:database', type: 'core', responsibility: 'Room database (hatli.db), DAOs, local caching entities with explicit database migration strategies.' },
    { name: ':core:network', type: 'core', responsibility: 'Retrofit/OkHttp HTTP clients, authorization interceptors, connection timeout handlers.' },
    { name: ':core:designsystem', type: 'core', responsibility: 'Brand tokens, Material 3 theme wrapper, typography scale, custom UI primitives, shape system.' },
    { name: ':core:ui', type: 'core', responsibility: 'Type-safe Navigation routes (@Serializable), BaseViewModel contracts, UI state modeling (UiState<T>).' },
    { name: ':feature:auth', type: 'feature', responsibility: 'Phone number authentication, SMS OTP input, profile creation, and Runner approval gate check.' },
    { name: ':feature:home', type: 'feature', responsibility: 'Main shell, floating navigation bar, Requester active orders, and Runner available errands feed.' },
    { name: ':feature:request', type: 'feature', responsibility: '3-step errand creation wizard, fee negotiation slider, and 5-stage live status tracker.' },
    { name: ':feature:chat', type: 'feature', responsibility: 'Real-time in-app conversation thread, message bubbles, Bidi Arabic/English formatting.' },
    { name: ':feature:profile', type: 'feature', responsibility: 'User profile management, role switcher, Arabic/English locale toggle, dark/light theme switch.' },
  ],
  deepDives: [
    {
      title: 'Resource-Safe Real-Time Concurrency',
      subtitle: 'Preventing Memory Leaks in Firestore Listeners',
      problem: 'Firestore real-time snapshot listeners attach asynchronous event callbacks to remote collections. If a user navigates away or puts the app into the background, unchecked snapshot listeners remain open, wasting cellular data, battery, and causing memory leaks.',
      implementation: 'Encapsulated Firestore snapshot callbacks within Kotlin callbackFlow channels. The listener registration is held until the collector terminates, with mandatory resource cleanup inside awaitClose { registration.remove() }. In the presentation layer, Compose views collect flows via collectAsStateWithLifecycle(), automatically halting collection when screens leave the STARTED lifecycle state.',
      whyItMatters: 'Guarantees zero memory leaks and zero orphaned network listeners when users rotate their device or leave active order screens.',
      codeSnippet: `fun observeRequest(id: String): Flow<Request> = callbackFlow {
    val registration = firestore.collection("requests").document(id)
        .addSnapshotListener { snapshot, error ->
            if (error != null) { close(error); return@addSnapshotListener }
            snapshot?.toRequestOrNull()?.let { trySend(it) }
        }
    awaitClose { registration.remove() } // Mandatory cleanup
}`
    },
    {
      title: 'Reflection-Free Schema Mapping',
      subtitle: 'Type-Safe Firestore Deserialization Under R8/ProGuard',
      problem: 'Using Firestore\'s default toObject(Class<T>) depends on Java reflection. In release builds with R8 code shrinking and ProGuard obfuscation, reflection frequently fails due to stripped getters/setters or minified field names, producing catastrophic runtime crashes.',
      implementation: 'Eliminated reflection entirely by authoring manual, explicit schema mappers (RequestFirestoreMapper). Every document field is extracted with strict type checks, safe fallbacks, and enum parsing.',
      whyItMatters: 'Complete immunity against R8/ProGuard regressions, guaranteed zero reflection overhead at runtime, and deterministic error logging when backend schemas evolve.',
      codeSnippet: `fun DocumentSnapshot.toRequest(): Request = Request(
    id = id,
    title = getString("title").orEmpty(),
    status = getString("status")?.let { RequestStatus.valueOf(it) } ?: RequestStatus.PENDING,
    deliveryFee = getDouble("deliveryFee") ?: 0.0,
    createdAt = getTimestamp("createdAt")?.toDate() ?: Date()
)`
    },
    {
      title: 'Bidirectional (Bidi) Text & RTL Layout Isolation',
      subtitle: 'Native Arabic Usability Without Breaking Internationalization',
      problem: 'Android applications in Egypt require flawless Right-to-Left (RTL) Arabic typography. However, blanket RTL mirroring breaks Egyptian phone numbers (+20), monetary currency badges (EGP), and numeric OTP code fields, causing inverted digits.',
      implementation: 'Engineered a unified design system supporting bidirectional layouts: layout direction is set to LayoutDirection.Rtl for Arabic typography, while monetary values, phone inputs, and OTP pins are explicitly isolated inside CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr).',
      whyItMatters: 'Ensures natural Arabic reading flow for headings and descriptions while keeping numerals, phone numbers, and pricing strictly readable in standard format.',
      codeSnippet: `// Isolate LTR direction for phone & price formatting in Arabic RTL layout
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Text(
        text = formatEgyptianPhone(phoneNumber),
        style = MaterialTheme.typography.bodyMedium
    )
}`
    },
    {
      title: 'Dual-Persona Architecture & Runner Verification Gate',
      subtitle: 'Single Binary Multi-Role Marketplace',
      problem: 'Maintaining two separate apps (one for customers, one for delivery drivers) doubles the maintenance burden, build pipelines, and distribution overhead for an emerging market startup.',
      implementation: 'Unified both personas inside a single binary. User records in Cloud Firestore contain a role enum and a verification status flag. The app navigation dynamically swaps home screens between Requester and Runner views, protected by an in-app RunnerApprovalScreen gate and server-side Firestore security rules.',
      whyItMatters: 'Drastically reduces development cycle time and lets verified users accept errands immediately without downloading a separate driver application.',
    }
  ],
  workflow: [
    {
      step: '01',
      actor: 'Requester',
      title: 'Errand Creation Wizard',
      description: 'The requester specifies what needs to be picked up, selects landmark-first drop-off instructions, and sets a suggested delivery fee via an interactive fee slider.'
    },
    {
      step: '02',
      actor: 'System',
      title: 'Live Marketplace Broadcast',
      description: 'The request is persisted to Cloud Firestore and broadcasted in real time to all active, verified runners within the neighborhood radius.'
    },
    {
      step: '03',
      actor: 'Runner',
      title: 'Errand Acceptance & Verification Gate',
      description: 'A verified runner reviews the errand notes, destination landmark, and fee, then accepts the task. Unverified runners are blocked by the verification gate.'
    },
    {
      step: '04',
      actor: 'System',
      title: '5-Stage Lifecycle Tracking',
      description: 'Both parties observe state updates in real time: Pending ➔ Accepted ➔ In Progress ➔ Purchased ➔ Delivered, with automatic Room local cache synchronization.'
    },
    {
      step: '05',
      actor: 'Requester',
      title: 'Delivery Confirmation & Rating',
      description: 'The runner confirms package handover, the requester verifies item fulfillment, and both users complete peer ratings.'
    }
  ],
  verifiedFeatures: [
    'Firebase Phone Authentication with Egyptian (+20) formatting and SMS OTP verification',
    'Dual-persona runtime switching (Requester & Runner) within a single app binary',
    '3-Step Errand Creation Wizard (Categories, custom shopping lists, landmark instructions, suggested fee)',
    '5-Stage real-time request lifecycle tracking (Pending ➔ Accepted ➔ InProgress ➔ Purchased ➔ Delivered)',
    'Live in-app messaging thread with Bidi formatting and unread message indicators',
    'Local offline caching via Room (hatli.db) with explicit database migrations',
    'Native Arabic (RTL) and English (LTR) localization with dynamic Light/Dark Material 3 theming',
    'Runner verification gate (RunnerApprovalScreen) preventing unauthorized marketplace participation'
  ],
  plannedFeatures: [
    'Server-side Firebase Cloud Functions trigger for automated FCM push notifications',
    'Automated identity document OCR / KYC verification service for runners',
    'Digital in-app payment gateway (card & mobile wallets; currently operates via cash on delivery / direct settlement)',
    'Firebase App Check integration with Google Play Integrity device attestation'
  ]
};

export const selectedProjects: Project[] = [
  {
    id: 'shoppe',
    title: 'Shoppe',
    category: 'E-Commerce Mobile Application',
    periodOrRole: 'ITI Graduation Project',
    summary: 'Full-featured native Android e-commerce platform delivering category browsing, customizable cart, multi-address management, Stripe payments, and interactive map location selection.',
    engineeringHighlight: 'Built with Clean Architecture and MVVM, integrating Stripe payment processing SDK, Google Maps location picker for precise delivery drop-offs, and bilingual Arabic/English localization.',
    techStack: [
      'Kotlin',
      'MVVM',
      'Clean Architecture',
      'Retrofit',
      'Firebase Auth',
      'Stripe SDK',
      'Google Maps API',
      'Room Database',
      'Navigation Component',
    ],
    githubUrl: 'https://github.com/AhmedKhaled2711/Shoppe',
    demoUrl: 'https://youtube.com/shorts/SrThHb7D8Gk',
    image: '/images/projects/shoppe.png',
    featured: true,
    domain: 'E-Commerce & Digital Payments'
  },
  {
    id: 'timely',
    title: 'Timely',
    category: 'Educational & Fee Management',
    periodOrRole: 'Personal Project',
    summary: 'Modern Android application designed for independent educators, tutors, and administrators to organize student records, group assignments, and monthly academic payment tracking.',
    engineeringHighlight: 'Engineered an offline-first architecture pairing a local Room database with Firebase Firestore synchronization, Google Sign-In authentication, and zero-hardcoded secrets management.',
    techStack: [
      'Kotlin',
      'Jetpack Compose',
      'Material 3',
      'MVVM',
      'Clean Architecture',
      'Room Database',
      'Cloud Firestore',
      'Google Sign-In',
      'Coroutines & Flow',
    ],
    githubUrl: 'https://github.com/AhmedKhaled2711/Timely',
    featured: true,
    domain: 'Education & Offline-First Persistence'
  },
  {
    id: 'weather',
    title: 'WeatherApplication',
    category: 'Forecast Engine & Background Services',
    periodOrRole: 'Personal Project',
    summary: 'Location-aware weather application delivering real-time forecasts, multi-day predictions, and weather alerts based on device geolocation or custom Google Maps selections.',
    engineeringHighlight: 'Employs Android background processing using AlarmManager and BroadcastReceivers for automated weather alert notifications, Fused Location Provider, Room caching, and automated unit testing.',
    techStack: [
      'Kotlin',
      'MVVM',
      'View Binding',
      'Retrofit',
      'Room Database',
      'Coroutines & Flow',
      'AlarmManager',
      'BroadcastReceivers',
      'Google Maps',
      'Unit Testing',
    ],
    githubUrl: 'https://github.com/AhmedKhaled2711/WeatherApplication',
    image: '/images/projects/weather.png',
    featured: true,
    domain: 'Background Tasks & Android OS Integrations'
  },
  {
    id: 'foodplanner',
    title: 'FoodPlanner',
    category: 'Meal Planning & Recipe Discovery',
    periodOrRole: 'ITI Training Project',
    summary: 'Meal planning and recipe discovery application with weekly calendar scheduling, ingredient searching, step-by-step video tutorials, and offline access for saved meals.',
    engineeringHighlight: 'Demonstrates professional mastery of Java in Android, MVP (Model-View-Presenter) architectural pattern, RxJava reactive streams, Retrofit REST consumption, Room persistence, and Firebase authentication.',
    techStack: [
      'Java',
      'MVP Architecture',
      'RxJava',
      'Retrofit',
      'Room Database',
      'Firebase Auth',
      'Repository Pattern',
    ],
    githubUrl: 'https://github.com/AhmedKhaled2711/FoodPlanner',
    featured: true,
    domain: 'Reactive Java & Legacy Codebase Modernization'
  }
];

export const workExperiences: WorkExperience[] = [
  {
    role: 'Android Engineer',
    company: 'Sapqoon',
    location: 'Cairo, Egypt',
    period: '01/2026 – Present',
    badge: 'Current Role',
    domain: 'On-Demand Food Delivery Ecosystem',
    summary: 'Engineering and maintaining production-ready native Android applications across Client, Delivery, and Store platforms serving real-time commercial operations in Cairo.',
    responsibilities: [
      'Contributed to scalable food delivery applications across Client, Delivery, and Store platforms.',
      'Developed and maintained production-ready features including product browsing, cart management, checkout flows, notifications, and real-time order tracking.',
      'Improved application startup time, runtime stability, and overall user experience across multiple production modules.',
      'Enhanced real-time synchronization and notification reliability using WebSockets, WorkManager, and background services.',
      'Collaborated in cross-functional squads with backend, QA, and product teams to deliver scalable mobile solutions.',
      'Participated in ongoing production support, crash triage (Firebase Crashlytics), debugging, and performance optimization.'
    ],
    technologies: [
      'Kotlin',
      'Jetpack Compose',
      'MVVM',
      'Clean Architecture',
      'Coroutines',
      'Flow',
      'Retrofit',
      'Room',
      'Firebase',
      'FCM',
      'WorkManager',
      'WebSockets',
      'Git'
    ],
    logo: '/images/experience/sapqoon.jpg'
  },
  {
    role: 'Android Engineer',
    company: 'Smart Lee',
    location: 'Riyadh, Saudi Arabia (Remote from Cairo)',
    period: '07/2024 – 09/2025',
    domain: 'Multi-Service Commercial Platform (Dorr)',
    summary: 'Developed and maintained native Android features for a high-traffic multi-service consumer platform spanning Taxi, Restaurants, Hotels, Flights, and Parcel Delivery modules.',
    responsibilities: [
      'Developed and maintained Android features for multi-service consumer applications including Taxi, Restaurants, Hotels, Flights, and Parcel Delivery modules.',
      'Built scalable mobile solutions using MVVM and Clean Architecture with a strict focus on performance, maintainability, and clean code practices.',
      'Integrated REST APIs, optimized background data handling, and improved application responsiveness and memory stability.',
      'Participated in agile sprint rituals, code reviews, debugging, and multi-market production release cycles.'
    ],
    technologies: [
      'Kotlin',
      'Java',
      'MVVM',
      'Clean Architecture',
      'Retrofit',
      'Firebase',
      'Room',
      'Git'
    ],
    logo: '/images/experience/smartlee.png'
  }
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Android Core & UI Engineering',
    description: 'Modern, idiomatic UI engineering for Android using Jetpack Compose and platform SDKs with full bidirectional RTL Arabic support.',
    skills: [
      { name: 'Kotlin', priority: true },
      { name: 'Java', priority: true },
      { name: 'Android SDK', priority: true },
      { name: 'Jetpack Compose', priority: true },
      { name: 'Material 3', priority: true },
      { name: 'Android Jetpack', priority: true },
      { name: 'Navigation Component' },
      { name: 'View Binding' },
      { name: 'XML Layouts' },
      { name: 'Custom Views' },
      { name: 'Bidi & RTL Layout Support', priority: true }
    ]
  },
  {
    category: 'Architecture, Concurrency & State',
    description: 'Disciplined application structuring with strict separation of concerns, reactive streams, and dependency injection.',
    skills: [
      { name: 'Clean Architecture', priority: true },
      { name: 'MVVM Pattern', priority: true },
      { name: 'Modular Architecture (Multi-Module Gradle)', priority: true },
      { name: 'Unidirectional Data Flow (UDF)', priority: true },
      { name: 'Kotlin Coroutines', priority: true },
      { name: 'Flow & StateFlow', priority: true },
      { name: 'Hilt / Dagger 2', priority: true },
      { name: 'MVP Pattern' },
      { name: 'RxJava' },
      { name: 'SOLID Principles', priority: true }
    ]
  },
  {
    category: 'Data, Networking & Persistence',
    description: 'Offline-first data layer implementations, cloud database synchronization, and robust API communication.',
    skills: [
      { name: 'Retrofit & OkHttp', priority: true },
      { name: 'REST APIs', priority: true },
      { name: 'WebSockets', priority: true },
      { name: 'Room Database', priority: true },
      { name: 'SQLite', priority: true },
      { name: 'Cloud Firestore', priority: true },
      { name: 'Firebase Authentication (SMS OTP)', priority: true },
      { name: 'Jetpack DataStore' },
      { name: 'Paging 3' },
      { name: 'Offline-First Caching', priority: true }
    ]
  },
  {
    category: 'Background Execution, Stability & Quality',
    description: 'Ensuring reliable background synchronization, push messaging, crash diagnostics, and production performance.',
    skills: [
      { name: 'WorkManager', priority: true },
      { name: 'Background & Foreground Services', priority: true },
      { name: 'Broadcast Receivers & AlarmManager' },
      { name: 'Firebase Cloud Messaging (FCM)', priority: true },
      { name: 'Firebase Crashlytics', priority: true },
      { name: 'App Startup Time Optimization' },
      { name: 'Memory Leak Prevention' },
      { name: 'Unit Testing (JUnit & Mockk)' },
      { name: 'Android Studio Profiler' },
      { name: 'Git & GitHub Workflows' },
      { name: 'Gradle (KTS / Groovy)' }
    ]
  }
];

export const educationHistory: EducationItem[] = [
  {
    institution: 'Information Technology Institute (ITI)',
    degree: '9-Month Professional Diploma – Native Mobile Applications Development',
    period: '10/2023 – 06/2024',
    location: 'Ministry of Communications and Information Technology (MCIT), Egypt',
    description: 'Intensive, highly competitive post-graduate professional engineering program focused on production-grade native mobile development, modern software engineering, and software architectures.',
    highlights: [
      'Advanced Native Android Engineering with Kotlin and Java',
      'Clean Architecture, MVVM, MVP, and Modularization',
      'Asynchronous & Reactive Concurrency (Coroutines, Flow, RxJava)',
      'Offline-First Data Layer with Room, SQLite, and RESTful APIs',
      'Graduation Project: Shoppe (Fashion Shop) E-Commerce Application'
    ],
    logo: '/images/education/iti.png'
  },
  {
    institution: 'Menofia University',
    degree: 'Bachelor of Computer Science',
    period: '09/2019 – 05/2023',
    location: 'Faculty of Computers and Information, Menofia, Egypt',
    grade: 'Overall: Good • Graduation Project: Distinct',
    description: 'Four-year undergraduate degree establishing deep foundations in algorithms, data structures, operating systems, and object-oriented software engineering.',
    highlights: [
      'Graduation Project: Advising Network App (Awarded Distinct Grade)',
      'Data Structures, Algorithms, Complexity Analysis, and Problem Solving',
      'Database Management Systems, SQL, and Relational Modeling',
      'Object-Oriented Programming (OOP), Design Patterns, and Operating Systems'
    ],
    logo: '/images/education/menofia.jpg'
  }
];

export const continuousLearningCourses: CourseItem[] = [
  {
    title: 'Android & Kotlin - The Android-Kotlin Development Guide',
    provider: 'Udemy',
    description: 'Comprehensive guide covering modern Android architecture, Jetpack components, Coroutines, and idiomatic Kotlin practices.'
  },
  {
    title: 'Android App Development Specialization',
    provider: 'Coursera',
    description: 'Specialization focusing on native Android development, lifecycle management, background execution, and user interface engineering.'
  },
  {
    title: 'Data Structures and Algorithms',
    provider: 'Princeton University (Coursera)',
    description: 'Rigorous computer science study on data structures, sorting algorithms, graph algorithms, and algorithmic complexity.'
  }
];
