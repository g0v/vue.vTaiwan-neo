import { firstSuccessThenFallback } from '@/utils/firstSuccessThenFallback'

// 範例測試：驗證 Vitest 設定可運作，同時覆蓋 firstSuccessThenFallback 的主要行為。
// 用 setTimeout 控制各請求完成的先後，讓「先完成者先被處理」的順序可預期。
const resolveAfter = <T>(value: T, ms: number) => () => new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
const rejectAfter = (error: unknown, ms: number) => () => new Promise<never>((_, reject) => setTimeout(() => reject(error), ms))

describe('firstSuccessThenFallback', () => {
  it('回傳最先完成之請求經 processFn 處理後的結果', async () => {
    const result = await firstSuccessThenFallback([resolveAfter('a', 5), resolveAfter('b', 30)], value => value.toUpperCase())
    expect(result).toBe('A')
  })

  it('先完成的請求失敗時，改用後續成功的請求（request fallback）', async () => {
    const result = await firstSuccessThenFallback([rejectAfter(new Error('boom'), 5), resolveAfter('ok', 30)], value => value)
    expect(result).toBe('ok')
  })

  it('processFn 對某個結果丟錯時，改用下一個可處理的結果（process fallback）', async () => {
    const result = await firstSuccessThenFallback([resolveAfter('bad', 5), resolveAfter('good', 30)], value => {
      if (value === 'bad') throw new Error('不接受 bad')
      return value
    })
    expect(result).toBe('good')
  })

  it('所有候選都失敗時丟出錯誤', async () => {
    await expect(firstSuccessThenFallback([rejectAfter(new Error('e1'), 5), rejectAfter(new Error('e2'), 10)], value => value)).rejects.toThrow('所有候選結果都失敗了')
  })

  it('成功後會呼叫 controller.abort() 以取消其餘請求', async () => {
    const controller = new AbortController()
    const abortSpy = vi.spyOn(controller, 'abort')
    await firstSuccessThenFallback([resolveAfter('done', 5)], value => value, controller)
    expect(abortSpy).toHaveBeenCalledOnce()
  })
})
