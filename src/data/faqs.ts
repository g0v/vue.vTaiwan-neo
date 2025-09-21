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
    answer: '您可以透過以下方式提出政策議題與社會議題：參與我們的 <a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slack 頻道</a> 討論，或參加 <a href="https://www.vtaiwan.tw/meetups" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">線上會議</a> 分享您的想法。請提供議題名稱、背景說明、預期目標等相關資訊。我們的團隊會進行初步審核，確認議題的適切性和完整性。',
    answer_en: 'You can propose policy and social topics through the following ways: participate in our <a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slack channel</a> discussions, or join <a href="https://www.vtaiwan.tw/meetups" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">online meetings</a> to share your ideas. Please provide relevant information including topic name, background description, and expected goals. Our team will conduct a preliminary review to confirm the appropriateness and completeness of the topic.',
    answer_ja: '以下の方法で政策議題と社会議題を提案できます：私たちの <a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slackチャンネル</a> での議論に参加するか、<a href="https://www.vtaiwan.tw/meetups" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">オンライン会議</a> に参加してアイデアを共有してください。議題名、背景説明、目標などの関連情報を提供してください。当チームが内容の適切性と完全性を確認します。'
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
    answer: 'vTaiwan 的討論結果會被整理成政策建議報告，提交給相關政府部門、企業或第三部門參考。過去已有多項透過 vTaiwan 討論形成的政策建議被政府採納，並轉化為實際的法規或政策。此外，第三部門組織也會使用這些意見徵集程序，並透過其他公共參與途徑如 <a href="https://join.gov.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Join 平台連署</a>、<a href="https://g0v.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">公民協作</a> 等方式達到解決方案。vTaiwan 扮演的是促進對話和形成共識的通道，而非最終的決策者。',
    answer_en: 'The results of vTaiwan discussions are compiled into policy recommendation reports and submitted to relevant government departments, enterprises, or third-sector organizations for reference. Many policy recommendations discussed on vTaiwan have been adopted by the government and transformed into actual regulations or policies. Additionally, third-sector organizations also utilize these opinion collection processes and achieve solutions through other public participation channels such as <a href="https://join.gov.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Join platform petitions</a> and <a href="https://g0v.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">citizen collaboration</a>. vTaiwan serves as a channel for promoting dialogue and reaching consensus, rather than being the final decision-maker.',
    answer_ja: 'vTaiwanの議論結果は政策提言レポートとしてまとめられ、関係省庁、企業、第三セクター組織に提出されます。過去にはvTaiwanで議論された提案が政府に採用され、実際の法令や政策となった例もあります。さらに、第三セクター組織もこれらの意見収集プロセスを活用し、<a href="https://join.gov.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Joinプラットフォームの署名</a>や<a href="https://g0v.tw/" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">市民協働</a>などの他の公共参加ルートを通じて解決策を実現しています。vTaiwanは対話と合意形成を促進するチャネルとして機能し、最終的な意思決定者ではありません。'
  },
  {
    id: '6',
    question: '如何追蹤議題的進展？',
    question_en: 'How to track the progress of topics?',
    question_ja: '議題の進捗はどのように追跡できますか？',
    answer: '您可以在 vTaiwan 網站上查看各議題的最新進展和討論結果。我們會定期更新議題狀態，包括討論階段、參與人數、關鍵意見等資訊。您也可以加入 <a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slack #vTaiwan 頻道</a> 和瀏覽 <a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">vTaiwan 工作組會議記錄</a>，獲取最新的議題進展通知。',
    answer_en: 'You can view the latest progress and discussion results of each topic on the vTaiwan website. We will regularly update the topic status, including the discussion phase, the number of participants, and key opinions. You can also join the <a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slack #vTaiwan channel</a> and browse the <a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">vTaiwan working group meeting records</a> to receive the latest topic progress notifications.',
    answer_ja: 'vTaiwanのウェブサイトで各議題の最新の進捗や議論結果を確認できます。議題のステータス（議論段階、参加人数、主要な意見など）は定期的に更新されます。また、<a href="https://g0v-tw.slack.com/archives/C2Q1M4N1J" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">Slack #vTaiwanチャンネル</a> に参加したり、<a href="https://g0v.hackmd.io/@tmonk/rJHYWR9S4/%2Ff9c4pS_TQjClh0g6wCJ8iw?type=book" target="_blank" rel="noopener noreferrer" class="text-democratic-red hover:underline">vTaiwan作業グループ会議記録</a> を閲覧することで最新情報を受け取ることも可能です。'
  }
]
