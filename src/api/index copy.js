/*
    pipe
      - call any function
      - call fakeApi
      - call some other function

*/

import * as R from 'ramda'

const log = console.log

// function myFunc(arg) {
//   console.log(`arg was => ${arg}`)
// }

// setTimeout(myFunc, 2000, 'funky')

const removeOne = (data) => {
  return R.without(['one'], data)
}

const removeTwo = (data) => {
  return R.without(['two'], data)
}

function addFour(data) {
  return R.append('four', data)
}

// works
const setTimeoutAsync = (cb, delay, data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb(data))
    }, delay)
  })

const x = R.pipe(removeOne, removeTwo)(['one', 'two', 'three'])
log('x', x)

const a = setTimeoutAsync(addFour, 2000, ['one', 'two', 'three']).then((a) =>
  log('a', a)
)
// --------------------------------------------------------

const setTimeoutAsync2 = (cb, delay, data) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(cb(data))
    }, delay)
  })
return async (data) => setTimeout(addFour)

/* eslint-disable */
// @ts-ignore
setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): NodeJS.Timeout

setTimeout(handler: TimerHandler, timeout?: number, ...arguments: any[]): number

/* so i think the setTimout should be inside of addFour */
