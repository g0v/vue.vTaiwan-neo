type RequestFn<T> = () => Promise<T>
type ProcessFn<T, R> = (value: T) => R

type FulfilledItem<T> = {
  index: number
  status: 'fulfilled'
  value: T
}

type RejectedItem = {
  index: number
  status: 'rejected'
  error: unknown
}

type QueueItem<T> = FulfilledItem<T> | RejectedItem

type RequestError = {
  stage: 'request'
  index: number
  error: unknown
}

type ProcessError = {
  stage: 'process'
  index: number
  error: unknown
}

type Deferred = {
  promise: Promise<void>
  resolve: () => void
  reject: (reason?: unknown) => void
}

function createDeferred(): Deferred {
  let resolve!: () => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

export async function firstSuccessThenFallback<T, R>(requestFns: RequestFn<T>[], processFn: ProcessFn<T, R>, controller?: AbortController): Promise<R> {
  const queue: QueueItem<T>[] = []
  let finishedCount = 0
  let nextItem = createDeferred()

  const notify = (item: QueueItem<T>) => {
    queue.push(item)
    nextItem.resolve()
  }

  for (const [index, fn] of requestFns.entries()) {
    fn()
      .then(value => {
        if (controller?.signal.aborted) return
        notify({ index, status: 'fulfilled', value })
      })
      .catch((error: unknown) => {
        if (controller?.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) return
        notify({ index, status: 'rejected', error })
      })
      .finally(() => {
        finishedCount++
        // 喚醒等待中的主迴圈：finishedCount 在此才遞增，若不喚醒，最後一個請求結束時
        // 主迴圈會用到尚未更新的計數，於是又去 await 一個沒人會 resolve 的 deferred（全部失敗時死鎖）。
        nextItem.resolve()
      })
  }

  const errors: (RequestError | ProcessError)[] = []

  while (finishedCount < requestFns.length || queue.length > 0) {
    if (queue.length === 0) {
      await nextItem.promise
      nextItem = createDeferred()
    }

    while (queue.length > 0) {
      const item = queue.shift()!

      if (item.status === 'rejected') {
        errors.push({ stage: 'request', index: item.index, error: item.error })
        continue
      }

      try {
        const result = processFn(item.value)
        controller?.abort()
        return result
      } catch (error: unknown) {
        errors.push({ stage: 'process', index: item.index, error })
      }
    }
  }

  throw new Error('所有候選結果都失敗了')
}
