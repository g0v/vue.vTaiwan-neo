export interface FAQ {
  id: string
  question: string
  question_en: string
  question_ja?: string
  answer: string
  answer_en: string
  answer_ja?: string
  details?: string[]
  details_en?: string[]
  details_ja?: string[]
}

export const faqs: FAQ[] = [
  {
    id: '1',
    question: '什麼是 vTaiwan？',
    question_en: 'What is vTaiwan?',
    question_ja: 'vTaiwanとは何ですか？',
    answer: 'vTaiwan 是一個結合線上與線下的公共政策討論平台，旨在透過公民參與和數位工具，促進政府、專家與民眾之間的理性對話，共同形塑更好的政策方案。',
    answer_en: 'vTaiwan is a platform that combines online and offline public policy discussions, aiming to promote rational dialogue between government, experts, and the public, and to jointly shape better policy solutions.',
    answer_ja: 'vTaiwanは、オンラインとオフラインを組み合わせた公共政策討論プラットフォームです。市民参加とデジタルツールを通じて、政府、専門家、市民の理性的な対話を促進し、より良い政策を共に作り上げます。'
  },
  {
    id: '2',
    question: '誰可以參與 vTaiwan？',
    question_en: 'Who can participate in vTaiwan?',
    question_ja: '誰がvTaiwanに参加できますか？',
    answer: '任何對公共政策有興趣的公民都可以參與 vTaiwan 的討論。無論您是一般民眾、專家學者、企業代表或政府官員，都歡迎加入我們的平台，分享您的觀點和建議。',
    answer_en: 'Any citizen interested in public policy can participate in the discussions on vTaiwan. Whether you are a general public, an expert, a business representative, or a government official, we welcome you to join our platform and share your views and suggestions.',
    answer_ja: '公共政策に関心のあるすべての市民がvTaiwanの議論に参加できます。一般市民、専門家、企業代表、政府関係者など、どなたでもご参加いただき、ご意見やご提案をお寄せください。'
  },
  {
    id: '3',
    question: '如何在 vTaiwan 上提出議題？',
    question_en: 'How to propose a topic on vTaiwan?',
    question_ja: 'vTaiwanでどのように議題を提案できますか？',
    answer: '您可以透過我們的線上平台提出政策議題。點擊網站上的「提案」按鈕，填寫相關資訊，包括議題名稱、背景說明、預期目標等。提案後，我們的團隊會進行初步審核，確認議題的適切性和完整性。',
    answer_en: 'You can propose a policy topic through our online platform. Click the "Propose" button on the website, fill in the relevant information, including the topic name, background description, and expected goals. After submission, our team will conduct a preliminary review to confirm the appropriateness and completeness of the topic.',
    answer_ja: '当ウェブサイトの「提案」ボタンをクリックし、議題名、背景説明、目標など必要事項を入力することで、政策議題を提案できます。提案後、当チームが内容の適切性と完全性を確認します。'
  },
  {
    id: '4',
    question: 'vTaiwan 的討論流程是什麼？',
    question_en: 'What is the discussion process of vTaiwan?',
    question_ja: 'vTaiwanの議論プロセスはどのようなものですか？',
    answer: 'vTaiwan 的討論流程通常包括四個階段：',
    answer_en: 'The discussion process of vTaiwan usually includes four stages:',
    answer_ja: 'vTaiwanの議論プロセスは通常、次の4つの段階で構成されます：',
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
    ],
    details_ja: [
      '議題収集：特定の政策議題に関する意見や提案を集める',
      '意見募集：オンラインプラットフォームを通じて広く意見を募集する',
      '審議討論：オンラインまたは対面で会議を開催し、議題を深く議論する',
      '政策形成：さまざまな意見を統合し、具体的な政策提案をまとめる'
    ]
  },
  {
    id: '5',
    question: 'vTaiwan 的討論結果如何被採納？',
    question_en: 'How are the results of vTaiwan discussions implemented?',
    question_ja: 'vTaiwanの議論結果はどのように活用されますか？',
    answer: 'vTaiwan 的討論結果會被整理成政策建議報告，提交給相關政府部門參考。過去已有多項透過 vTaiwan 討論形成的政策建議被政府採納，並轉化為實際的法規或政策。然而，最終的政策決定權仍在政府手中，vTaiwan 扮演的是促進對話和形成共識的角色。',
    answer_en: 'The results of vTaiwan discussions are compiled into policy recommendation reports and submitted to relevant government departments for reference. Many policy recommendations discussed on vTaiwan have been adopted by the government and transformed into actual regulations or policies. However, the final decision-making power remains with the government, and vTaiwan plays a role in promoting dialogue and reaching consensus.',
    answer_ja: 'vTaiwanの議論結果は政策提言レポートとしてまとめられ、関係省庁に提出されます。過去にはvTaiwanで議論された提案が政府に採用され、実際の法令や政策となった例もあります。ただし、最終的な政策決定権は政府にあり、vTaiwanは対話と合意形成を促進する役割を担っています。'
  },
  {
    id: '6',
    question: '如何追蹤議題的進展？',
    question_en: 'How to track the progress of topics?',
    question_ja: '議題の進捗はどのように追跡できますか？',
    answer: '您可以在 vTaiwan 網站上查看各議題的最新進展和討論結果。我們會定期更新議題狀態，包括討論階段、參與人數、關鍵意見等資訊。您也可以訂閱我們的電子報，獲取最新的議題進展通知。',
    answer_en: 'You can view the latest progress and discussion results of each topic on the vTaiwan website. We will regularly update the topic status, including the discussion phase, the number of participants, and key opinions. You can also subscribe to our newsletter to receive the latest topic progress notifications.',
    answer_ja: 'vTaiwanのウェブサイトで各議題の最新の進捗や議論結果を確認できます。議題のステータス（議論段階、参加人数、主要な意見など）は定期的に更新されます。また、ニュースレターを購読することで最新情報を受け取ることも可能です。'
  }
]
