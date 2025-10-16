export interface Contributor {
  id: string
  name: string
  role?: string
  description?: string
  contribution?: string
  contributions?: string[]
  imgURL?: string
}

export const coreTeam: Contributor[] = [
  {
    id: '1',
    name: 'Peter Cui',
    role: 'contributors.roles.projectManager',
    description: 'contributors.descriptions.projectManager',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512'
  },
  {
    id: '2',
    name: 'Yi-Ting Lien',
    role: 'contributors.roles.projectManager',
    description: 'contributors.descriptions.projectManager',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U071XARBY03-8305075e99fa-512'
  },
  {
    id: '3',
    name: 'Joshua Yang',
    role: 'contributors.roles.processDesigner',
    description: 'contributors.descriptions.processDesigner',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U02E9C8B42U-21f68e5ff15c-512'
  },
  {
    id: '4',
    name: 'Bestian Tang',
    role: 'contributors.roles.techDirector',
    description: 'contributors.descriptions.techDirector',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512'
  },
  {
    id: '5',
    name: 'Tofus Wang',
    role: 'contributors.roles.designer',
    description: 'contributors.descriptions.designer',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512'
  },
  { id: '6',
    name: 'Shuyang Lin',
    role: 'contributors.roles.designer',
    description: 'contributors.descriptions.designer',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512'
  },
]

// 原始資料
const rawCommunityContributors: Contributor[] = [
  { id: '1', name: 'Peter Cui', contribution: 'contributors.contributions.policyResearch', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '2', name: 'Peter Cui', contribution: 'contributors.contributions.eventPlanning', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '3', name: 'Joshua Yang', contribution: 'contributors.contributions.eventPlanning', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U02E9C8B42U-21f68e5ff15c-512' },
  { id: '4', name: 'Joshua Yang', contribution: 'contributors.contributions.policyResearch', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U02E9C8B42U-21f68e5ff15c-512' },
  { id: '5', name: 'Yi-Ting Lien', contribution: 'contributors.contributions.eventPlanning', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U071XARBY03-8305075e99fa-512' },
  { id: '6', name: 'Shuyang Lin', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512' },
  { id: '7', name: 'Shuyang Lin', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512' },
  { id: '8', name: 'Shuyang Lin', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512' },
  { id: '9', name: 'Peter Cui', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '10', name: 'Tofus Wang', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '11', name: 'Tofus Wang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '12', name: 'Joey Yu', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U0638P8FJ82-5ee2c8a9ae73-192' },
  { id: '13', name: 'Joey Yu', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U0638P8FJ82-5ee2c8a9ae73-192' },
  { id: '14', name: 'Tim', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U05BY0RLJM7-ab97abff7b44-512' },
  { id: '15', name: 'Anan', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U08U8MNTS0M-d68838168b5e-192' },
  /*  -->Here, add your own contribution --> */
  { id: '16', name: 'Bestian Tang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '17', name: 'Bestian Tang', contribution: 'contributors.contributions.backendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '18', name: 'Nobody', contribution: 'contributors.contributions.dataAnalysis' },
  { id: '19', name: 'Nobody', contribution: 'contributors.contributions.translationSupport' },

]

// 合併相同貢獻者的函數
function mergeContributors(rawContributors: Contributor[]): Contributor[] {
  const contributorMap = new Map<string, Contributor>()

  rawContributors.forEach(contributor => {
    // 沒有頭像或名為Nobody的貢獻者不進行合併，保持獨立
    if (!contributor.imgURL || contributor.name === 'Nobody') {
      contributorMap.set(contributor.id, {
        ...contributor,
        contributions: contributor.contribution ? [contributor.contribution] : []
      })
      return
    }

    const key = contributor.imgURL // 只使用頭像URL作為唯一鍵

    if (contributorMap.has(key)) {
      // 如果已存在，將貢獻項目加入陣列
      const existing = contributorMap.get(key)!
      if (contributor.contribution && !existing.contributions?.includes(contributor.contribution)) {
        existing.contributions = existing.contributions || []
        existing.contributions.push(contributor.contribution)
      }
    } else {
      // 如果不存在，創建新的貢獻者
      contributorMap.set(key, {
        ...contributor,
        contributions: contributor.contribution ? [contributor.contribution] : []
      })
    }
  })

  return Array.from(contributorMap.values())
}

export const communityContributors: Contributor[] = mergeContributors(rawCommunityContributors)
