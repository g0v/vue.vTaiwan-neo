export interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed'
  icon: string
  color: 'primary' | 'teal' | 'amber'
  url: string
  category: string
  participantsCount: number
}

export const projects: Project[] = [
  {
    id: '1',
    title: '數位身分證',
    description: '討論數位身分證的隱私與安全議題，探討如何在便利性與資安之間取得平衡。',
    status: 'active',
    icon: 'credit-card',
    color: 'primary',
    url: '/projects/digital-id',
    category: '數位政策',
    participantsCount: 256
  },
  {
    id: '2',
    title: '開放政府資料',
    description: '推動政府資料開放與應用，建立資料標準與開放授權機制。',
    status: 'active',
    icon: 'database',
    color: 'teal',
    url: '/projects/open-data',
    category: '開放政府',
    participantsCount: 189
  },
  {
    id: '3',
    title: '遠距醫療法規',
    description: '探討遠距醫療的法規與實施，解決偏鄉醫療資源不足問題。',
    status: 'completed',
    icon: 'heart-pulse',
    color: 'amber',
    url: '/projects/telemedicine',
    category: '健康醫療',
    participantsCount: 142
  },
  {
    id: '4',
    title: '線上投票系統',
    description: '研究安全可靠的線上投票系統，提升公民參與度與決策效率。',
    status: 'active',
    icon: 'check-square',
    color: 'primary',
    url: '/projects/online-voting',
    category: '數位民主',
    participantsCount: 213
  },
  {
    id: '5',
    title: '共享經濟管理',
    description: '討論共享經濟平台的監管與稅務問題，平衡創新與消費者保護。',
    status: 'completed',
    icon: 'share',
    color: 'teal',
    url: '/projects/sharing-economy',
    category: '經濟政策',
    participantsCount: 178
  },
  {
    id: '6',
    title: '數位學習資源',
    description: '推動開放教育資源與數位學習平台，縮小教育資源差距。',
    status: 'active',
    icon: 'book-open',
    color: 'amber',
    url: '/projects/digital-learning',
    category: '教育政策',
    participantsCount: 165
  },
  {
    id: '7',
    title: '環境資訊公開',
    description: '建立環境監測資訊公開機制，提升環境治理透明度。',
    status: 'active',
    icon: 'leaf',
    color: 'teal',
    url: '/projects/environmental-info',
    category: '環境政策',
    participantsCount: 132
  },
  {
    id: '8',
    title: '網路隱私保護',
    description: '討論個人資料保護與網路隱私權的法規與實踐。',
    status: 'completed',
    icon: 'shield',
    color: 'primary',
    url: '/projects/privacy-protection',
    category: '數位權利',
    participantsCount: 201
  },
  {
    id: '9',
    title: '青年就業政策',
    description: '探討青年就業困境與政策解方，促進世代公平。',
    status: 'active',
    icon: 'briefcase',
    color: 'amber',
    url: '/projects/youth-employment',
    category: '勞動政策',
    participantsCount: 187
  }
]

// 狀態選項
export const statuses = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '進行中' },
  { value: 'completed', label: '已完成' }
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
