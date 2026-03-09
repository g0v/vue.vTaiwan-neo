const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http

    protocol
      .get(url, response => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filename)
          response.pipe(fileStream)

          fileStream.on('finish', () => {
            fileStream.close()
            console.log(`✅ 下載完成: ${filename}`)
            resolve()
          })

          fileStream.on('error', err => {
            fs.unlink(filename, () => {}) // 刪除部分下載的檔案
            reject(err)
          })
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`))
        }
      })
      .on('error', reject)
  })
}

function sanitizeFilename(url) {
  // 從 URL 中提取檔案名稱
  const urlObj = new URL(url)
  const pathname = urlObj.pathname

  // 提取最後的檔案名稱
  let filename = pathname.split('/').pop()

  // 移除查詢參數
  if (filename.includes('?')) {
    filename = filename.split('?')[0]
  }

  // 解碼 URL 編碼
  filename = decodeURIComponent(filename)

  // 移除特殊字符，只保留字母、數字、點號、連字符和下劃線
  filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')

  return filename
}

async function crawlVtaiwanImages() {
  let browser

  try {
    console.log('🚀 啟動瀏覽器...')
    browser = await chromium.launch({
      headless: true,
    })

    const page = await browser.newPage()

    console.log('📡 正在載入 vTaiwan 議題頁面...')
    await page.goto('https://www.vtaiwan.tw/topics', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    console.log('⏳ 等待 20 秒讓所有資料渲染完成...')
    await page.waitForTimeout(20000)

    console.log('🔍 正在尋找背景圖片...')

    // 尋找所有包含 background-image 的元素
    const backgroundImages = await page.evaluate(() => {
      const elements = document.querySelectorAll('*')
      const images = []

      elements.forEach((element, index) => {
        const style = window.getComputedStyle(element)
        const backgroundImage = style.backgroundImage

        if (backgroundImage && backgroundImage !== 'none') {
          // 提取 URL
          const urlMatch = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/)
          if (urlMatch) {
            images.push({
              url: urlMatch[1],
              element: element.outerHTML.substring(0, 200) + '...', // 截取前200字符用於除錯
            })
          }
        }
      })

      return images
    })

    console.log(`📊 找到 ${backgroundImages.length} 個背景圖片`)

    if (backgroundImages.length === 0) {
      console.log('❌ 沒有找到任何背景圖片')
      return
    }

    // 設定下載目錄為 public/cover
    const coverDir = path.join(__dirname, '..', 'public', 'cover')
    if (!fs.existsSync(coverDir)) {
      fs.mkdirSync(coverDir, { recursive: true })
    }

    // 下載每個圖片
    for (let i = 0; i < backgroundImages.length; i++) {
      const imageInfo = backgroundImages[i]
      const imageUrl = imageInfo.url

      console.log(`\n📥 正在處理第 ${i + 1}/${backgroundImages.length} 個圖片:`)
      console.log(`   URL: ${imageUrl}`)

      try {
        const filename = sanitizeFilename(imageUrl)
        const filepath = path.join(coverDir, filename)

        // 檢查檔案是否已存在
        if (fs.existsSync(filepath)) {
          console.log(`⏭️  檔案已存在，跳過: ${filename}`)
          continue
        }

        await downloadImage(imageUrl, filepath)
      } catch (error) {
        console.error(`❌ 下載失敗: ${imageUrl}`)
        console.error(`   錯誤: ${error.message}`)
      }
    }

    console.log('\n🎉 爬蟲任務完成！')
  } catch (error) {
    console.error('❌ 爬蟲執行失敗:', error)
  } finally {
    if (browser) {
      await browser.close()
      console.log('🔒 瀏覽器已關閉')
    }
  }
}

// 執行爬蟲
if (require.main === module) {
  crawlVtaiwanImages().catch(console.error)
}

module.exports = { crawlVtaiwanImages }
