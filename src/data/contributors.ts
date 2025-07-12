export interface Contributor {
  id: string
  name: string
  role?: string
  description?: string
  contribution?: string
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
    name: 'Bestian Tang',
    role: 'contributors.roles.techDirector',
    description: 'contributors.descriptions.techDirector',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512'
  },
  {
    id: '3',
    name: 'Tofus Wang',
    role: 'contributors.roles.designer',
    description: 'contributors.descriptions.designer',
    imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512'
  }
]

export const communityContributors: Contributor[] = [
  { id: '1', name: 'Peter Cui', contribution: 'contributors.contributions.policyResearch', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '2', name: 'Peter Cui', contribution: 'contributors.contributions.eventPlanning', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '3', name: 'Joshua Yang', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U02E9C8B42U-21f68e5ff15c-512' },
  { id: '4', name: 'Shuyang Lin', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U2PUXG69E-f59903ccf61f-512' },
  { id: '5', name: 'Peter Cui', contribution: 'contributors.contributions.contentManager', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-UPHFV4KF0-8263b8a8cfdc-512' },
  { id: '6', name: 'Tofus Wang', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '7', name: 'Tofus Wang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U01JXVDPS5R-5a1d6aace86d-512' },
  { id: '8', name: 'Joey Yu', contribution: 'contributors.contributions.uiuxDesign', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U0638P8FJ82-5ee2c8a9ae73-192' },
  { id: '9', name: 'Tim', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U05BY0RLJM7-ab97abff7b44-512' },
  { id: '10', name: 'Anan', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U08U8MNTS0M-d68838168b5e-192' },
  { id: '11', name: 'Bestian Tang', contribution: 'contributors.contributions.frontendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '12', name: 'Bestian Tang', contribution: 'contributors.contributions.backendDev', imgURL: 'https://ca.slack-edge.com/T02G2SXKM-U053N6CAQ-338c6ec3f9d7-512' },
  { id: '13', name: 'Nobody', contribution: 'contributors.contributions.dataAnalysis' },
  { id: '14', name: 'Nobody', contribution: 'contributors.contributions.translationSupport' },
]
