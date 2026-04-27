// Libaries
const R = require('ramda')
const fetch = require('node-fetch')
const Promise = require('bluebird')

// Input
const data = {
  array: [
    ['#', 'FirstName', 'LastName'],
    ['1', 'tim', 'foo'],
    ['2', 'kim', 'bar']
  ],
  header: 'FirstName',
  more: 'stuff',
  goes: 'here'
}

// Static and Promise Resolver (with Helper Function)
const transposeObj = (obj, len = Object.values(obj)[0].length) =>
  [...Array(len)].map((_, i) =>
    Object.entries(obj).reduce((a, [k, v]) => ({ ...a, [k]: v[i] }), {})
  )

const mergeCallback = async (
  { array: [headers, ...rows], header, ...rest },
  callback
) => {
  const index = R.indexOf(header, headers)
  const result = await Promise.map(rows, (row) => {
    return callback(row[index])
  })
    .then((x) => ({ changes: x.map((v) => transposeObj(v.changes)) }))
    .then(({ changes }) => ({
      allHeaders: R.flatten([
        ...headers,
        R.chain((t) => R.chain(Object.keys, t), [...changes])
          .filter((k) => !headers.includes(k))
          .filter((x, i, a) => a.indexOf(x) == i)
      ]),
      changes
    }))
    .then(({ changes, allHeaders }) => ({
      resultRows: R.chain(
        (row, i = R.indexOf(row, [...rows])) =>
          changes[i].map((change) =>
            Object.entries(change).reduce(
              (r, [k, v]) => [
                ...r.slice(0, allHeaders.indexOf(k)),
                v,
                ...r.slice(allHeaders.indexOf(k) + 1)
              ],
              row.slice(0)
            )
          ),
        [...rows]
      ),
      allHeaders
    }))
    .then(({ resultRows, allHeaders, array }) => ({
      array: [allHeaders, ...resultRows],
      header,
      ...rest
    }))
  return result
}

// Example Callbacks and their services
const adapterPromise1 = async (name) => {
  const response = await fetch(
    `https://api.abalin.net/get/getdate?name=${name}&calendar=us`
  ).then((res) => res.json())
  return {
    changes: {
      nameday: R.pluck('day', response.results),
      namemonth: R.pluck('month', response.results)
    }
  }
}
const servicePromise1 = (input) => mergeCallback(input, adapterPromise1)

const adapterPromise2 = async (name) => {
  const response = await fetch(
    `https://api.genderize.io?name=${name}`
  ).then((res) => res.json())
  return {
    changes: {
      gender: R.of(response.gender)
    }
  }
}
const servicePromise2 = (input) => mergeCallback(input, adapterPromise2)

const adapterStatic1 = (name) => ({
  changes: { NameLength: R.of(R.length(name)) }
})
const serviceStatic1 = (input) => mergeCallback(input, adapterStatic1)
