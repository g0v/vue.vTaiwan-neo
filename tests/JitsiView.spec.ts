import { flushPromises, shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import JitsiView from '@/views/JitsiView.vue'
import zhTW from '@/l10n/zh-TW.json'
import en from '@/l10n/en.json'
import ja from '@/l10n/ja.json'

const firebaseMocks = vi.hoisted(() => ({
  get: vi.fn(),
  onValue: vi.fn(),
  set: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/lib/firebase', () => ({ database: {} }))
vi.mock('firebase/database', () => ({
  get: firebaseMocks.get,
  onValue: firebaseMocks.onValue,
  ref: vi.fn((_database, path) => path),
  set: firebaseMocks.set,
  update: firebaseMocks.update,
}))

type MeetingData = Record<string, unknown>
type Snapshot = { exists: () => boolean; val: () => MeetingData | null }

function mountMeeting(userData = { uid: 'test-user', name: '測試使用者' }) {
  const i18n = createI18n({
    legacy: false,
    locale: 'zh-TW',
    messages: { 'zh-TW': zhTW, en, ja },
  })
  const wrapper = shallowMount(JitsiView, {
    props: { userData },
    global: {
      plugins: [i18n],
      stubs: { IconWrapper: true, TranscriptLanguageSwitcher: true, TranscriptPanel: true },
    },
  })
  return { wrapper, i18n }
}

describe('JitsiView 分軌轉錄按鈕', () => {
  let meetings: Map<string, MeetingData>
  let listeners: Map<string, Set<(snapshot: Snapshot) => void>>
  let unsubscribes: ReturnType<typeof vi.fn>[]

  function snapshotFor(path: string): Snapshot {
    const data = meetings.get(path)
    return { exists: () => !!data, val: () => (data ? { ...data } : null) }
  }

  function publish(path: string, data: MeetingData) {
    meetings.set(path, data)
    listeners.get(path)?.forEach(callback => callback(snapshotFor(path)))
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    meetings = new Map()
    listeners = new Map()
    unsubscribes = []
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    firebaseMocks.get.mockResolvedValue({ exists: () => false })
    firebaseMocks.set.mockResolvedValue(undefined)
    firebaseMocks.onValue.mockImplementation((path: string, callback: (snapshot: Snapshot) => void) => {
      if (!listeners.has(path)) listeners.set(path, new Set())
      listeners.get(path)!.add(callback)
      callback(snapshotFor(path))
      const unsubscribe = vi.fn(() => listeners.get(path)!.delete(callback))
      unsubscribes.push(unsubscribe)
      return unsubscribe
    })
    firebaseMocks.update.mockImplementation(async (path: string, changes: MeetingData) => {
      const data = { ...meetings.get(path), ...changes }
      Object.keys(data).forEach(key => {
        if (data[key] === null) delete data[key]
      })
      publish(path, data)
    })
    vi.stubGlobal(
      'MediaRecorder',
      class {
        state = 'inactive'
        ondataavailable = null
        onstop = null
        start() {
          this.state = 'recording'
        }
        stop() {
          this.state = 'inactive'
        }
      }
    )

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        addEventListener: vi.fn(),
        enumerateDevices: vi.fn().mockResolvedValue([]),
        getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [] }),
        removeEventListener: vi.fn(),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('閒置時顯示紫色，並依語系提供提示文字', async () => {
    const { wrapper, i18n } = mountMeeting()
    await flushPromises()

    const button = wrapper.get('button[aria-label="分軌轉錄"]')
    expect(button.attributes('title')).toBe('分軌轉錄')
    expect(button.classes()).toContain('bg-transcription-purple')

    i18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()
    expect(button.attributes('title')).toBe('Separate-track transcription')

    i18n.global.locale.value = 'ja'
    await wrapper.vm.$nextTick()
    expect(button.attributes('title')).toBe('トラック別文字起こし')

    wrapper.unmount()
  })

  it('空會議立即開始監聽，且不整筆寫入資料', async () => {
    const { wrapper } = mountMeeting()
    expect(firebaseMocks.onValue).toHaveBeenCalledOnce()
    await flushPromises()
    expect(firebaseMocks.get).not.toHaveBeenCalled()
    expect(firebaseMocks.set).not.toHaveBeenCalled()

    const path = firebaseMocks.onValue.mock.calls[0][0]
    publish(path, { recordingSpeaker: '小明', recordingStartTime: Date.now() - 5000 })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="status"]').text()).toBe('小明 轉錄中... 已錄 5 秒')
    expect(wrapper.vm.isRecordingAudio).toBe(false)
    wrapper.unmount()
  })

  it('一人開始或停止錄音時，另一人即時看到名稱、秒數與提示消失', async () => {
    const { wrapper: recorder } = mountMeeting({ uid: 'alice', name: 'Alice' })
    const { wrapper: observer } = mountMeeting({ uid: 'bob', name: 'Bob' })
    await flushPromises()
    const path = firebaseMocks.onValue.mock.calls[0][0]
    publish(path, { recorder: 'alice', transcripts: { entry: { text: '既有逐字稿' } } })

    await recorder.vm.startAudioRecording()
    await flushPromises()
    expect(firebaseMocks.update).toHaveBeenLastCalledWith(path, { recordingSpeaker: 'Alice', recordingStartTime: Date.now() })
    expect(observer.get('[role="status"]').text()).toBe('Alice 轉錄中... 已錄 0 秒')
    expect(observer.vm.isRecordingAudio).toBe(false)
    expect(observer.vm.transcriptData).toEqual({ entry: { text: '既有逐字稿' } })
    expect(observer.vm.isRecorder).toBe(false)

    await vi.advanceTimersByTimeAsync(2000)
    expect(observer.get('[role="status"]').text()).toBe('Alice 轉錄中... 已錄 2 秒')

    await recorder.vm.stopAudioRecording()
    await flushPromises()
    expect(firebaseMocks.update).toHaveBeenLastCalledWith(path, { recordingSpeaker: null, recordingStartTime: null })
    expect(recorder.find('[role="status"]').exists()).toBe(false)
    expect(observer.find('[role="status"]').exists()).toBe(false)
    expect(observer.vm.meetingData.recordingSpeaker).toBeUndefined()
    expect(observer.vm.meetingData.recordingStartTime).toBeUndefined()
    expect(meetings.get(path)?.recorder).toBe('alice')
    expect(observer.vm.transcriptData).toEqual({ entry: { text: '既有逐字稿' } })

    // 超過原本的自動分段時間後，停止的提示也不能重新出現
    await vi.advanceTimersByTimeAsync(31000)
    expect(recorder.find('[role="status"]').exists()).toBe(false)
    expect(observer.find('[role="status"]').exists()).toBe(false)
    expect(firebaseMocks.update).toHaveBeenCalledTimes(2)
    recorder.unmount()
    observer.unmount()
  })

  it('本機處理音檔時仍顯示共用的轉錄者名稱，並支援三種語系', async () => {
    const { wrapper, i18n } = mountMeeting()
    const path = firebaseMocks.onValue.mock.calls[0][0]
    publish(path, { recordingSpeaker: 'Alice', recordingStartTime: Date.now() })
    await wrapper.setData({ isTranscripting: true })
    expect(wrapper.get('[role="status"]').text()).toBe('Alice 轉錄中... 已錄 0 秒')
    expect(wrapper.text()).not.toContain(zhTW.jitsi.transcribing)

    i18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="status"]').text()).toBe('Alice is transcribing... Recorded 0s')
    i18n.global.locale.value = 'ja'
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="status"]').text()).toBe('Alice が文字起こし中... 録音 0 秒')

    publish(path, {})
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.text()).toContain(ja.jitsi.transcribing)
    wrapper.unmount()
  })

  it('切換日期與離開頁面時取消舊監聽', async () => {
    const { wrapper } = mountMeeting()
    const oldPath = firebaseMocks.onValue.mock.calls[0][0]
    await wrapper.vm.onDateChange('2026-09-01')
    expect(unsubscribes[0]).toHaveBeenCalledOnce()
    expect(firebaseMocks.onValue).toHaveBeenLastCalledWith('/meetings/20260901', expect.any(Function))

    publish(oldPath, { recordingSpeaker: '舊會議', recordingStartTime: Date.now() })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    publish('/meetings/20260901', { recordingSpeaker: '新會議', recordingStartTime: Date.now() })
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[role="status"]').text()).toContain('新會議')
    wrapper.unmount()
    expect(unsubscribes[1]).toHaveBeenCalledOnce()
  })
})
