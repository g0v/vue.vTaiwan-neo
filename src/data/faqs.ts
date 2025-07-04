export interface FAQ {
  id: string
  question: string
  question_en: string
  answer: string
  answer_en: string
  details?: string[]
  details_en?: string[]
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: '什麼是 vTaiwan？',
    question_en: 'What is vTaiwan?',
    answer: 'vTaiwan 是一個結合線上與線下的公共政策討論平台，旨在透過公民參與和數位工具，促進政府、專家與民眾之間的理性對話，共同形塑更好的政策方案。',
    answer_en: 'vTaiwan is a platform that combines online and offline public policy discussions, aiming to promote rational dialogue between government, experts, and the public, and to jointly shape better policy solutions.'
  },
  {
    id: '2',
    question: '誰可以參與 vTaiwan？',
    question_en: 'Who can participate in vTaiwan?',
    answer: '任何對公共政策有興趣的公民都可以參與 vTaiwan 的討論。無論您是一般民眾、專家學者、企業代表或政府官員，都歡迎加入我們的平台，分享您的觀點和建議。',
    answer_en: 'Any citizen interested in public policy can participate in the discussions on vTaiwan. Whether you are a general public, an expert, a business representative, or a government official, we welcome you to join our platform and share your views and suggestions.'
  },
  {
    id: '3',
    question: '如何在 vTaiwan 上提出議題？',
    question_en: 'How to propose a topic on vTaiwan?',
    answer: '您可以透過我們的線上平台提出政策議題。點擊網站上的「提案」按鈕，填寫相關資訊，包括議題名稱、背景說明、預期目標等。提案後，我們的團隊會進行初步審核，確認議題的適切性和完整性。',
    answer_en: 'You can propose a policy topic through our online platform. Click the "Propose" button on the website, fill in the relevant information, including the topic name, background description, and expected goals. After submission, our team will conduct a preliminary review to confirm the appropriateness and completeness of the topic.'
  },
  {
    id: '4',
    question: 'vTaiwan 的討論流程是什麼？',
    question_en: 'What is the discussion process of vTaiwan?',
    answer: 'vTaiwan 的討論流程通常包括四個階段：',
    answer_en: 'The discussion process of vTaiwan usually includes four stages:',
    details: [
      '議題收集：收集各方對特定政策議題的意見和建議',
      '意見徵集：透過線上平台廣泛徵集公眾意見',
      '審議討論：舉辦線上或實體會議，深入討論議題',
      '政策形成：整合各方意見，形成具體政策建議'
    ],
    details_en: [
      'Topic Collection: Collecting opinions and suggestions from all parties on specific policy topics',
      'Public Opinion Collection: Broadly collecting public opinions through online platforms',
      'Discussion and Review: Holding online or offline meetings to discuss the topics in depth',
      'Policy Formulation: Integrating all opinions to form specific policy recommendations'
    ]
  },
  {
    id: '5',
    question: 'vTaiwan 的討論結果如何被採納？',
    question_en: 'How are the results of vTaiwan discussions implemented?',
    answer: 'vTaiwan 的討論結果會被整理成政策建議報告，提交給相關政府部門參考。過去已有多項透過 vTaiwan 討論形成的政策建議被政府採納，並轉化為實際的法規或政策。然而，最終的政策決定權仍在政府手中，vTaiwan 扮演的是促進對話和形成共識的角色。',
    answer_en: 'The results of vTaiwan discussions are compiled into policy recommendation reports and submitted to relevant government departments for reference. Many policy recommendations discussed on vTaiwan have been adopted by the government and transformed into actual regulations or policies. However, the final decision-making power remains with the government, and vTaiwan plays a role in promoting dialogue and reaching consensus.'
  },
  {
    id: '6',
    question: '如何追蹤議題的進展？',
    question_en: 'How to track the progress of topics?',
    answer: '您可以在 vTaiwan 網站上查看各議題的最新進展和討論結果。我們會定期更新議題狀態，包括討論階段、參與人數、關鍵意見等資訊。您也可以訂閱我們的電子報，獲取最新的議題進展通知。',
    answer_en: 'You can view the latest progress and discussion results of each topic on the vTaiwan website. We will regularly update the topic status, including the discussion phase, the number of participants, and key opinions. You can also subscribe to our newsletter to receive the latest topic progress notifications.'
  }
]
