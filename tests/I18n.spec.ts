describe('i18n', () => {
  beforeEach(() => {
    vi.resetModules()
    const values = new Map<string, string>()
    vi.stubGlobal('localStorage', {
      get length() {
        return values.size
      },
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    } satisfies Storage)
    document.documentElement.lang = 'zh-TW'
  })

  afterEach(() => vi.unstubAllGlobals())

  it('restores the saved locale and synchronizes the document language', async () => {
    localStorage.setItem('locale', 'ja')

    const { default: i18n } = await import('@/i18n')

    expect(i18n.global.locale.value).toBe('ja')
    expect(document.documentElement.lang).toBe('ja')
  })

  it('updates the locale, storage, and document language together', async () => {
    const { default: i18n, setLocale } = await import('@/i18n')

    setLocale('en')

    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })
})
