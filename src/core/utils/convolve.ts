
/**
 * 卷积的一种实现，特别地，这个函数对左右两边进行 padding 处理。
 *
 * @param array 被卷数组
 * @param weights 卷积核
 * @returns 卷积后的数组，大小和被卷数组一致
 **/
export function convolve (array: number[], weights: number[]) {
  if (weights.length % 2 !== 1) { throw new Error('weights array must have an odd length') }

  const al = array.length
  const wl = weights.length
  const offset = ~~(wl / 2)
  const output = new Array<number>(al)

  for (let i = 0; i < al; i++) {
    const kmin = 0
    const kmax = wl - 1

    output[i] = 0
    for (let k = kmin; k <= kmax; k++) {
      let idx = i - offset + k
      if (idx < 0) idx = 0
      if (idx >= array.length) idx = array.length - 1
      output[i] += array[idx] * weights[k]
    }
  }

  return output
}
