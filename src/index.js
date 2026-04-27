/*
    pipe
      - call any function
      - call fakeApi
      - call some other function

*/

import { api } from './api'
import * as R from 'ramda'
import fetch from 'cross-fetch'

const log = console.log

const removeOne = (data) => {
  log('removeOne')
  return R.without(['one'], data)
}

const removeTwo = (data) => {
  return R.without(['two'], data)
}

function addFour(data) {
  log('add 4')
  return R.append('four', data)
}

const getData = async (data) => {
  // const r = async () => await api.views.read('all-data-by-description', false)
  const r = await fetch('http://localhost:3030/health')
  const json = await r.json()
  // log('getData: r', r)
  // log('getData: json', json)
  const ret = R.mergeRight(json, { msg: data })
  log('getData: ret', ret)
  return ret
}

const _log = (message) => (value) => console.log(message, value)

// const b = R.pipe(
//   R.tap(_log('1')),
//   removeOne,
//   R.tap(_log('2')),
//   getData,
//   R.tap(_log('3')),
//   R.andThen(R.head(addFour)),
//   R.tap(_log('4'))
// )(['one', 'two', 'three'])

// const b = R.pipe(getData, R.tap(_log('1')), R.andThen(R.head(addFour)))()

/*

In this example getData is an async call. 

*/
const _log = (message) => (value) => console.log(message, value)

const callIt = async () => {
  const a = await R.pipe(
    getData,
    R.andThen(R.identity),
    R.andThen(R.tap(_log('zzz')))
  )('hello') //.then((x) => console.log(x))
  log('a', a)
  // a { status: 'All good here.', msg: 'hello' }
}
callIt()

/*

Have been looking for a way to call an async function (api call)
from within a pipe and haven't found it. I'm wondering how and if I should just find a way around it.
When google doesn't come up with an answer I'm left wondering if what I'm trying to do isn't such a good idea.

Here is a contrived example where `someAcyncApiCall` gets some data and adds it to the array.
```
R.pipe(
  removeOne, 
  someAsyncApiCall, 
  addFour
)(['one', 'two', 'three'])
```

*/
