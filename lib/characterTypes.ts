export interface CharacterTypeInfo {
  name: string;
  description: string;
  tagline: string;
  color: string;
  icon: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  careerRecommendations: string[];
  workStyle: string[];
  relationshipInsights: string[];
  developmentTips: string[];
}

export const CHARACTER_TYPES: Record<string, CharacterTypeInfo> = {
  PEMIKIR_INTROVERT: {
    name: 'Pemikir Introvert',
    tagline: 'The Analytical Mind',
    description: 'Orang dengan tipe ini cenderung berpikir mendalam, logis, dan terstruktur. Mereka lebih suka bekerja sendiri atau dalam kelompok kecil, menganalisis masalah dengan cermat sebelum mengambil keputusan. Pemikir Introvert sangat teliti dan berorientasi pada detail.',
    color: 'blue',
    icon: '🧠',
    traits: [
      'Analitis dan logis',
      'Teliti dan detail-oriented',
      'Mandiri dalam bekerja',
      'Pemikir strategis',
      'Objektif dan rasional',
    ],
    strengths: [
      'Kemampuan analisis yang sangat baik',
      'Dapat bekerja secara independen dengan efektif',
      'Teliti dan akurat dalam detail',
      'Pemecahan masalah yang sistematis',
      'Kemampuan berpikir kritis yang kuat',
    ],
    weaknesses: [
      'Cenderung terlalu perfeksionis',
      'Mungkin terlihat kurang komunikatif',
      'Kesulitan dalam situasi yang membutuhkan keputusan cepat',
      'Bisa terlalu fokus pada detail dan kehilangan gambaran besar',
    ],
    careerRecommendations: [
      'Data Analyst',
      'Software Developer',
      'Research Scientist',
      'Quality Assurance Specialist',
      'Financial Analyst',
      'Systems Architect',
      'Technical Writer',
    ],
    workStyle: [
      'Lebih produktif bekerja secara mandiri',
      'Membutuhkan waktu untuk berpikir sebelum bertindak',
      'Menyukai lingkungan kerja yang tenang',
      'Berorientasi pada hasil yang akurat dan berkualitas',
    ],
    relationshipInsights: [
      'Membutuhkan waktu pribadi untuk recharge energi',
      'Komunikasi cenderung to-the-point dan faktual',
      'Menghargai kedalaman dalam hubungan daripada kuantitas',
      'Loyal dan dapat diandalkan dalam komitmen',
    ],
    developmentTips: [
      'Latih keterampilan komunikasi interpersonal',
      'Pelajari untuk mendelegasikan dan percaya pada orang lain',
      'Kembangkan fleksibilitas dalam berpikir',
      'Praktikkan mengambil keputusan dengan informasi terbatas',
    ],
  },

  PEMIKIR_EXTROVERT: {
    name: 'Pemikir Extrovert',
    tagline: 'The Strategic Communicator',
    description: 'Tipe ini menggabungkan kemampuan berpikir logis dengan keterampilan komunikasi yang baik. Mereka pandai menganalisis situasi dan menyampaikan ide-ide mereka dengan jelas kepada orang lain. Pemikir Extrovert adalah problem solver yang efektif dalam tim.',
    color: 'sky',
    icon: '💡',
    traits: [
      'Logis dan komunikatif',
      'Pemimpin pemikiran',
      'Energik dalam diskusi',
      'Objektif namun persuasif',
      'Berorientasi pada solusi',
    ],
    strengths: [
      'Kemampuan menjelaskan konsep kompleks dengan sederhana',
      'Leadership dalam proyek analitis',
      'Networking dan kolaborasi yang efektif',
      'Dapat memotivasi tim dengan logika',
      'Adaptif dalam berbagai situasi',
    ],
    weaknesses: [
      'Bisa terlalu dominan dalam diskusi',
      'Kadang kurang sabar dengan proses yang lambat',
      'Mungkin mengabaikan aspek emosional',
      'Cenderung terlalu fokus pada hasil jangka pendek',
    ],
    careerRecommendations: [
      'Management Consultant',
      'Business Analyst',
      'Project Manager',
      'Sales Engineer',
      'Technology Evangelist',
      'Strategy Director',
      'Corporate Trainer',
    ],
    workStyle: [
      'Berkembang dalam lingkungan kolaboratif',
      'Menyukai brainstorming dan diskusi tim',
      'Efektif dalam presentasi dan pitching',
      'Membutuhkan tantangan intelektual',
    ],
    relationshipInsights: [
      'Senang berdiskusi dan bertukar pikiran',
      'Membutuhkan stimulasi intelektual dalam hubungan',
      'Terbuka dan langsung dalam komunikasi',
      'Menghargai partner yang cerdas dan independent',
    ],
    developmentTips: [
      'Dengarkan lebih banyak, bicara sedikit lebih sedikit',
      'Kembangkan empati dan emotional intelligence',
      'Praktikkan kesabaran dalam proses',
      'Pelajari untuk menghargai perspektif emosional',
    ],
  },

  PENGAMAT_INTROVERT: {
    name: 'Pengamat Introvert',
    tagline: 'The Thoughtful Observer',
    description: 'Orang dengan tipe ini sangat observatif dan reflektif. Mereka memiliki kemampuan luar biasa untuk memperhatikan detail dan pola yang orang lain lewatkan. Pengamat Introvert adalah pendengar yang baik dan pemikir yang mendalam.',
    color: 'green',
    icon: '👁️',
    traits: [
      'Sangat observatif',
      'Reflektif dan bijaksana',
      'Pendengar aktif',
      'Peka terhadap detail',
      'Tenang dan stabil',
    ],
    strengths: [
      'Kemampuan observasi yang tajam',
      'Insight mendalam tentang situasi dan orang',
      'Ketenangan dalam menghadapi tekanan',
      'Kemampuan mendengarkan yang excellent',
      'Pemahaman konteks yang kuat',
    ],
    weaknesses: [
      'Terlalu banyak mengobservasi, kurang mengambil tindakan',
      'Mungkin terlihat pasif atau tidak engaged',
      'Kesulitan mengekspresikan pemikiran secara verbal',
      'Cenderung overthinking',
    ],
    careerRecommendations: [
      'UX Researcher',
      'Market Research Analyst',
      'Quality Inspector',
      'Editor/Proofreader',
      'Librarian',
      'Detective/Investigator',
      'Environmental Scientist',
    ],
    workStyle: [
      'Membutuhkan waktu untuk observe sebelum bertindak',
      'Efektif dalam tugas yang membutuhkan perhatian detail',
      'Lebih suka komunikasi tertulis',
      'Berkembang dalam lingkungan yang stabil',
    ],
    relationshipInsights: [
      'Pendengar yang empati dan suportif',
      'Membutuhkan ruang pribadi yang banyak',
      'Menunjukkan cinta melalui tindakan, bukan kata-kata',
      'Loyal dan committed dalam jangka panjang',
    ],
    developmentTips: [
      'Praktikkan untuk lebih proaktif dalam komunikasi',
      'Belajar untuk mengambil action dengan informasi yang cukup',
      'Kembangkan confidence dalam menyuarakan opini',
      'Latih keterampilan presentasi dan public speaking',
    ],
  },

  PENGAMAT_EXTROVERT: {
    name: 'Pengamat Extrovert',
    tagline: 'The Social Connector',
    description: 'Tipe ini sangat peka terhadap dinamika sosial dan pandai membaca orang. Mereka menggunakan observasi mereka untuk membangun koneksi dan memfasilitasi interaksi. Pengamat Extrovert adalah networker alamiah yang dapat menciptakan harmoni dalam grup.',
    color: 'emerald',
    icon: '🤝',
    traits: [
      'Socially aware',
      'Fasilitator yang baik',
      'Empati dan perceptive',
      'Energik dalam interaksi',
      'Bridge builder',
    ],
    strengths: [
      'Kemampuan networking yang luar biasa',
      'Dapat membaca dan merespons dinamika grup',
      'Menciptakan atmosfer positif',
      'Mediator yang efektif',
      'Adaptif terhadap berbagai personalitas',
    ],
    weaknesses: [
      'Bisa terlalu fokus pada orang lain, mengabaikan diri sendiri',
      'Kesulitan dengan konflik langsung',
      'Mungkin people-pleasing',
      'Terlalu bergantung pada validasi eksternal',
    ],
    careerRecommendations: [
      'Human Resources Manager',
      'Event Coordinator',
      'Public Relations Specialist',
      'Customer Success Manager',
      'Community Manager',
      'Sales Representative',
      'Recruiter',
    ],
    workStyle: [
      'Berkembang dalam lingkungan tim',
      'Menyukai interaksi dengan berbagai orang',
      'Efektif dalam peran client-facing',
      'Motivasi dari appreciation dan recognition',
    ],
    relationshipInsights: [
      'Sangat atentif terhadap kebutuhan partner',
      'Membutuhkan interaksi sosial reguler',
      'Ekspresif dalam menunjukkan perasaan',
      'Menghargai quality time dan shared experiences',
    ],
    developmentTips: [
      'Set boundaries yang sehat dengan orang lain',
      'Praktikkan self-care dan me-time',
      'Belajar untuk comfortable dengan konflik',
      'Kembangkan assertiveness',
    ],
  },

  PERASA_INTROVERT: {
    name: 'Perasa Introvert',
    tagline: 'The Compassionate Soul',
    description: 'Orang dengan tipe ini memiliki kedalaman emosi yang luar biasa dan empati yang kuat. Mereka sangat peduli terhadap orang lain dan nilai-nilai mereka. Perasa Introvert adalah pendengar yang baik dan penasihat yang bijaksana.',
    color: 'purple',
    icon: '💜',
    traits: [
      'Empatik dan caring',
      'Idealis dengan nilai kuat',
      'Kreatif dan imaginatif',
      'Pendengar yang baik',
      'Reflektif dan introspektif',
    ],
    strengths: [
      'Empati dan pemahaman mendalam',
      'Kemampuan menulis dan ekspresi kreatif',
      'Komitmen kuat terhadap nilai dan misi',
      'Dapat melihat potensi dalam orang lain',
      'Autentik dan genuine',
    ],
    weaknesses: [
      'Terlalu sensitif terhadap kritik',
      'Cenderung idealis dan unrealistic',
      'Kesulitan dengan konflik',
      'Bisa terlalu perfeksionis dengan nilai personal',
    ],
    careerRecommendations: [
      'Counselor/Therapist',
      'Writer/Poet',
      'Social Worker',
      'Graphic Designer',
      'Non-profit Organizer',
      'Content Creator',
      'Art Therapist',
    ],
    workStyle: [
      'Membutuhkan pekerjaan yang bermakna',
      'Berkembang dengan autonomy',
      'Efektif dalam one-on-one interactions',
      'Motivasi dari making a difference',
    ],
    relationshipInsights: [
      'Deeply committed dan loyal',
      'Butuh partner yang understanding',
      'Mengekspresikan cinta dengan sangat personal',
      'Menghargai kedalaman dan autentisitas',
    ],
    developmentTips: [
      'Kembangkan resilience terhadap kritik',
      'Belajar untuk lebih pragmatis',
      'Praktikkan assertiveness',
      'Set realistic expectations',
    ],
  },

  PERASA_EXTROVERT: {
    name: 'Perasa Extrovert',
    tagline: 'The Inspiring Motivator',
    description: 'Tipe ini menggabungkan empati dengan energi sosial. Mereka sangat passionate dan dapat menginspirasi orang lain dengan antusiasme mereka. Perasa Extrovert adalah cheerleader alamiah yang membawa positivity ke mana pun mereka pergi.',
    color: 'pink',
    icon: '🌟',
    traits: [
      'Enthusiastic dan passionate',
      'Inspiring dan motivating',
      'Warm dan friendly',
      'Ekspresif secara emosional',
      'People-oriented',
    ],
    strengths: [
      'Kemampuan memotivasi dan inspire orang lain',
      'Komunikasi yang penuh empati',
      'Creating positive team culture',
      'Adaptif dan spontan',
      'Dapat melihat best dalam setiap situasi',
    ],
    weaknesses: [
      'Terlalu optimis, kurang realistic',
      'Kesulitan dengan tugas yang repetitive',
      'Bisa terlalu emosional dalam keputusan',
      'Mungkin overcommit',
    ],
    careerRecommendations: [
      'Motivational Speaker',
      'Teacher/Educator',
      'Marketing Manager',
      'Brand Ambassador',
      'Life Coach',
      'Event Planner',
      'Team Leader',
    ],
    workStyle: [
      'Berkembang dalam lingkungan energik',
      'Menyukai kolaborasi dan brainstorming',
      'Butuh variety dan new challenges',
      'Motivasi dari recognition dan impact',
    ],
    relationshipInsights: [
      'Sangat ekspresif dengan perasaan',
      'Butuh partner yang engaged',
      'Menunjukkan cinta dengan enthusiasm',
      'Menghargai adventure dan spontaneity',
    ],
    developmentTips: [
      'Develop follow-through dan consistency',
      'Belajar untuk lebih objektif',
      'Praktikkan active listening',
      'Manage commitments dengan realistic',
    ],
  },

  PEMIMPI_INTROVERT: {
    name: 'Pemimpi Introvert',
    tagline: 'The Visionary Creator',
    description: 'Orang dengan tipe ini memiliki imajinasi yang kaya dan visi yang unik. Mereka adalah inovator yang tenang, lebih suka bekerja pada ide-ide mereka secara mendalam. Pemimpi Introvert melihat possibilities di mana orang lain melihat limitations.',
    color: 'indigo',
    icon: '🎨',
    traits: [
      'Imaginatif dan visioner',
      'Inovatif dan original',
      'Mandiri dan self-directed',
      'Curious dan open-minded',
      'Artistic dan creative',
    ],
    strengths: [
      'Kreativitas dan inovasi exceptional',
      'Kemampuan melihat big picture',
      'Independent thinking',
      'Problem-solving yang unik',
      'Visi jangka panjang',
    ],
    weaknesses: [
      'Terlalu idealis, kurang practical',
      'Kesulitan dengan implementasi detail',
      'Mungkin impulsif dengan ide baru',
      'Kurang fokus pada execution',
    ],
    careerRecommendations: [
      'Product Designer',
      'Architect',
      'Creative Director',
      'Research & Development',
      'Entrepreneur',
      'Author/Novelist',
      'Inventor',
    ],
    workStyle: [
      'Butuh freedom untuk explore ide',
      'Berkembang dengan autonomy',
      'Menyukai proyek inovatif',
      'Motivasi dari creating something new',
    ],
    relationshipInsights: [
      'Butuh partner yang understand visi mereka',
      'Menghargai intellectual connection',
      'Kadang lost in thought',
      'Loyal dan committed meski independent',
    ],
    developmentTips: [
      'Develop execution dan implementation skills',
      'Belajar untuk more grounded',
      'Praktikkan prioritization',
      'Collaborate dengan detail-oriented people',
    ],
  },

  PEMIMPI_EXTROVERT: {
    name: 'Pemimpi Extrovert',
    tagline: 'The Charismatic Innovator',
    description: 'Tipe ini adalah visioner yang dapat menginspirasi orang lain dengan ide-ide mereka. Mereka menggabungkan kreativitas dengan kemampuan komunikasi yang kuat. Pemimpi Extrovert adalah changemaker yang dapat memobilisasi orang untuk mewujudkan visi mereka.',
    color: 'violet',
    icon: '🚀',
    traits: [
      'Visioner dan inspirational',
      'Charismatic dan persuasive',
      'Energik dan enthusiastic',
      'Risk-taker',
      'Future-oriented',
    ],
    strengths: [
      'Kemampuan inspire dan mobilize orang',
      'Kreativitas dalam strategy',
      'Networking dan influence yang kuat',
      'Adaptif terhadap perubahan',
      'Entrepreneurial mindset',
    ],
    weaknesses: [
      'Bisa terlalu impulsif',
      'Kesulitan dengan follow-through',
      'Mungkin unrealistic dengan timeline',
      'Kadang mengabaikan practical constraints',
    ],
    careerRecommendations: [
      'Startup Founder',
      'Innovation Consultant',
      'Creative Director',
      'Business Development Manager',
      'Marketing Director',
      'Change Management Consultant',
      'Venture Capitalist',
    ],
    workStyle: [
      'Berkembang dengan challenges besar',
      'Menyukai fast-paced environment',
      'Efektif dalam pitching dan presenting',
      'Motivasi dari creating impact',
    ],
    relationshipInsights: [
      'Butuh partner yang exciting',
      'Sangat ekspresif dan romantic',
      'Menghargai growth dan adventure',
      'Kadang unpredictable',
    ],
    developmentTips: [
      'Develop discipline dan consistency',
      'Belajar untuk realistic planning',
      'Praktikkan patience',
      'Focus on completing what you start',
    ],
  },

  PENGGERAK: {
    name: 'Penggerak',
    tagline: 'The Dynamic Driver',
    description: 'Orang dengan tipe ini adalah action-oriented leader yang dapat menggerakkan orang dan proyek dengan cepat. Mereka decisive, confident, dan tidak takut mengambil kontrol. Penggerak adalah go-getter yang membuat hal terjadi.',
    color: 'red',
    icon: '⚡',
    traits: [
      'Action-oriented',
      'Decisive dan confident',
      'Leadership natural',
      'Competitive dan driven',
      'Results-focused',
    ],
    strengths: [
      'Kemampuan execution yang kuat',
      'Leadership dan direction yang jelas',
      'Decisive dalam tekanan',
      'Dapat mobilize resources dengan cepat',
      'Goal-oriented dan productive',
    ],
    weaknesses: [
      'Bisa terlalu aggressive atau pushy',
      'Kesulitan dengan patience',
      'Mungkin kurang consideration untuk feelings',
      'Terlalu fokus pada results, mengabaikan process',
    ],
    careerRecommendations: [
      'CEO/Executive',
      'Operations Manager',
      'Sales Director',
      'Military Officer',
      'Emergency Services',
      'Sports Coach',
      'Crisis Manager',
    ],
    workStyle: [
      'Berkembang dengan challenges dan deadlines',
      'Menyukai fast results',
      'Efektif dalam crisis situations',
      'Motivasi dari achievement',
    ],
    relationshipInsights: [
      'Direct dan straightforward',
      'Protective dan providing',
      'Butuh respect dan admiration',
      'Kadang intimidating',
    ],
    developmentTips: [
      'Develop empathy dan listening skills',
      'Belajar untuk delegate',
      'Praktikkan patience',
      'Appreciate process, not just results',
    ],
  },
};

export function getCharacterTypeInfo(type: string): CharacterTypeInfo {
  return CHARACTER_TYPES[type] || CHARACTER_TYPES.PENGGERAK;
}

export function getCharacterTypeColor(type: string): string {
  const info = getCharacterTypeInfo(type);
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    sky: 'bg-sky-100 text-sky-800 border-sky-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    violet: 'bg-violet-100 text-violet-800 border-violet-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  };
  return colorMap[info.color] || colorMap.blue;
}
