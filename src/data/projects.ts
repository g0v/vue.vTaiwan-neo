export interface Project {
  id: string
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  status: 'active' | 'completed'
  icon: string
  color: 'primary' | 'teal' | 'amber'
  url: string
  category: string
  categoryEn?: string
  participantsCount: number
  isPrototype?: boolean // 是否為樣稿
  githubRepo?: string // github repo
  documentation?: string // 文件連結
  discussion?: string // 討論區連結
}

export const projects: Project[] = [
  {
    id: '1',
    title: '數位身分證',
    titleEn: 'Digital ID',
    description: '討論數位身分證的隱私與安全議題，探討如何在便利性與資安之間取得平衡。',
    descriptionEn: 'Discuss the privacy and security issues of digital ID, and explore how to balance convenience and security.',
    status: 'active',
    icon: 'credit-card',
    color: 'primary',
    url: '/projects/digital-id',
    category: '數位政策',
    categoryEn: 'Digital Policy',
    participantsCount: 256,
    isPrototype: true
  },
  {
    id: '2',
    title: '開放政府資料',
    titleEn: 'Open Government Data',
    description: '推動政府資料開放與應用，建立資料標準與開放授權機制。',
    descriptionEn: 'Promote government data openness and application, establish data standards and open licensing mechanisms.',
    status: 'active',
    icon: 'database',
    color: 'teal',
    url: '/projects/open-data',
    category: '開放政府',
    categoryEn: 'Open Government',
    participantsCount: 189,
    isPrototype: true
  },
  {
    id: '3',
    title: '遠距醫療法規',
    titleEn: 'Telemedicine Regulations',
    description: '探討遠距醫療的法規與實施，解決偏鄉醫療資源不足問題。',
    descriptionEn: 'Explore the regulations and implementation of telemedicine to address the issue of insufficient medical resources in remote areas.',
    status: 'completed',
    icon: 'heart-pulse',
    color: 'amber',
    url: '/projects/telemedicine',
    category: '健康醫療',
    categoryEn: 'Healthcare',
    participantsCount: 142,
    isPrototype: true
  },
  {
    id: '4',
    title: '線上投票系統',
    titleEn: 'Online Voting System',
    description: '研究安全可靠的線上投票系統，提升公民參與度與決策效率。',
    descriptionEn: 'Research secure and reliable online voting systems to enhance citizen participation and decision-making efficiency.',
    status: 'active',
    icon: 'check-square',
    color: 'primary',
    url: '/projects/online-voting',
    category: '數位民主',
    categoryEn: 'Digital Democracy',
    participantsCount: 213,
    isPrototype: true
  },
  {
    id: '5',
    title: '共享經濟管理',
    titleEn: 'Sharing Economy Management',
    description: '討論共享經濟平台的監管與稅務問題，平衡創新與消費者保護。',
    descriptionEn: 'Discuss the regulation and taxation issues of sharing economy platforms, balancing innovation and consumer protection.',
    status: 'completed',
    icon: 'share',
    color: 'teal',
    url: '/projects/sharing-economy',
    category: '經濟政策',
    categoryEn: 'Economic Policy',
    participantsCount: 178,
    isPrototype: true
  },
  {
    id: '6',
    title: '數位學習資源',
    titleEn: 'Digital Learning Resources',
    description: '推動開放教育資源與數位學習平台，縮小教育資源差距。',
    descriptionEn: 'Promote open educational resources and digital learning platforms to reduce educational resource gaps.',
    status: 'active',
    icon: 'book-open',
    color: 'amber',
    url: '/projects/digital-learning',
    category: '教育政策',
    categoryEn: 'Education Policy',
    participantsCount: 165,
    isPrototype: true
  },
  {
    id: '7',
    title: '環境資訊公開',
    titleEn: 'Environmental Information Disclosure',
    description: '建立環境監測資訊公開機制，提升環境治理透明度。',
    descriptionEn: 'Establish an environmental monitoring information disclosure mechanism to enhance environmental governance transparency.',
    status: 'active',
    icon: 'leaf',
    color: 'teal',
    url: '/projects/environmental-info',
    category: '環境政策',
    categoryEn: 'Environmental Policy',
    participantsCount: 132,
    isPrototype: true
  },
  {
    id: '8',
    title: '網路隱私保護',
    titleEn: 'Network Privacy Protection',
    description: '討論個人資料保護與網路隱私權的法規與實踐。',
    descriptionEn: 'Discuss the regulations and practices of personal data protection and network privacy rights.',
    status: 'completed',
    icon: 'shield',
    color: 'primary',
    url: '/projects/privacy-protection',
    category: '數位權利',
    categoryEn: 'Digital Rights',
    participantsCount: 201,
    isPrototype: true
  },
  {
    id: '9',
    title: '青年就業政策',
    titleEn: 'Youth Employment Policy',
    description: '探討青年就業困境與政策解方，促進世代公平。',
    descriptionEn: 'Explore the challenges of youth employment and policy solutions to promote intergenerational equity.',
    status: 'active',
    icon: 'briefcase',
    color: 'amber',
    url: '/projects/youth-employment',
    category: '勞動政策',
    categoryEn: 'Labor Policy',
    participantsCount: 187,
    isPrototype: true
  }
]

// 狀態選項
export const statuses = [
  { value: 'all', label: '全部', labelEn: 'All' },
  { value: 'active', label: '進行中', labelEn: 'Active' },
  { value: 'completed', label: '已完成', labelEn: 'Completed' }
]

// 顏色對應
export const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: 'democratic-red',
    teal: 'jade-green',
    amber: 'wheat-yellow'
  }
  return colorMap[color] || 'democratic-red'
}
