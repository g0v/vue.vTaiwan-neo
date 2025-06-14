export interface Meetup {
  id: string
  slug: string
  title: string
  description: string
  date: string
  time: string
  location: string
  project: string
  projectUrl: string
  registrationUrl?: string
  recordingUrl?: string
  summaryUrl?: string
  hackmdUrl?: string // hackMD 的 url
  kktixUrl?: string // kktix 的 url
  googleFormUrl?: string // google form 的 url
  tags: string[]
  isPrototype?: boolean
}

export const meetups: Meetup[] = [
  {
    id: '1',
    slug: 'digital-id-discussion',
    title: '數位身分證政策討論會',
    description: '深入討論數位身分證的隱私保護機制、資安標準與實施時程，邀請相關專家與公民共同參與。',
    date: '2024-03-25',
    time: '14:00-16:00',
    location: '台北市公民會館',
    project: '數位身分證',
    projectUrl: '/projects/digital-id',
    registrationUrl: 'https://forms.gle/example1',
    tags: ['政策討論', '數位政府'],
    isPrototype: true
  },
  {
    id: '2',
    slug: 'open-data-workshop',
    title: '開放資料工作坊',
    description: '分享政府資料開放的技術標準、API 設計與應用案例，促進資料透明化與創新應用。',
    date: '2024-04-02',
    time: '10:00-12:00',
    location: '線上會議',
    project: '開放政府資料',
    projectUrl: '/projects/open-data',
    registrationUrl: 'https://forms.gle/example2',
    tags: ['工作坊', '開放資料'],
    isPrototype: true
  },
  {
    id: '3',
    slug: 'telemedicine-regulation',
    title: '遠距醫療法規研討會',
    description: '討論遠距醫療的法規框架、醫療品質保障與偏鄉醫療資源分配議題。',
    date: '2024-04-10',
    time: '15:00-17:00',
    location: '台中市',
    project: '遠距醫療法規',
    projectUrl: '/projects/telemedicine',
    registrationUrl: 'https://forms.gle/example3',
    tags: ['法規討論', '醫療政策'],
    isPrototype: true
  },
  {
    id: '4',
    slug: 'online-voting-security',
    title: '線上投票系統安全研討會',
    description: '探討線上投票系統的資安要求、驗證機制與防護措施，確保選舉公正性。',
    date: '2024-04-15',
    time: '14:00-16:00',
    location: '台北市',
    project: '線上投票系統',
    projectUrl: '/projects/online-voting',
    registrationUrl: 'https://forms.gle/example4',
    tags: ['資安討論', '數位民主'],
    isPrototype: true
  },
  {
    id: '5',
    slug: 'sharing-economy-policy',
    title: '共享經濟政策圓桌會議',
    description: '討論共享經濟平台的監管框架、稅務規範與消費者權益保護機制。',
    date: '2024-03-10',
    time: '13:00-15:00',
    location: '台北市',
    project: '共享經濟管理',
    projectUrl: '/projects/sharing-economy',
    recordingUrl: 'https://youtube.com/watch?v=example5',
    summaryUrl: '/meetups/summary/sharing-economy-policy',
    tags: ['政策討論', '經濟政策'],
    isPrototype: true
  },
  {
    id: '6',
    slug: 'digital-learning-resources',
    title: '數位學習資源分享會',
    description: '分享開放教育資源的建置經驗、數位學習平台的發展現況與未來展望。',
    date: '2024-03-05',
    time: '10:00-12:00',
    location: '線上會議',
    project: '數位學習資源',
    projectUrl: '/projects/digital-learning',
    recordingUrl: 'https://youtube.com/watch?v=example6',
    summaryUrl: '/meetups/summary/digital-learning-resources',
    tags: ['經驗分享', '教育政策'],
    isPrototype: true
  },
  {
    id: '7',
    slug: 'environmental-info-transparency',
    title: '環境資訊公開機制討論',
    description: '討論環境監測資料的公開標準、即時資訊發布機制與公民參與管道。',
    date: '2024-02-28',
    time: '14:00-16:00',
    location: '高雄市',
    project: '環境資訊公開',
    projectUrl: '/projects/environmental-info',
    recordingUrl: 'https://youtube.com/watch?v=example7',
    summaryUrl: '/meetups/summary/environmental-info-transparency',
    tags: ['環境政策', '資訊公開'],
    isPrototype: true
  }
]

// 取得即將舉行的會議
export const getUpcomingMeetups = (): Meetup[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return meetups
    .filter(meetup => new Date(meetup.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// 取得過去的會議
export const getPastMeetups = (): Meetup[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return meetups
    .filter(meetup => new Date(meetup.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
