const fs = require('fs')

// const rawdata = fs.readFileSync('input.txt').toString().split('\n')
// rawdata.pop()

// 2-7 p: pbhhzpmppb

// const data = rawdata.map(str => str.split(/[- :]+/g).map((v,i) => i < 2 ? parseInt(v) : v))

const data = fs.readFileSync('input.txt').toString().split('\n').map(str => str.split(/[- :]+/g).map((v,i) => i < 2 ? parseInt(v) : v))
data.pop()

const isBetween = (value, from, to) => value >= from && value <= to
const valid = data.filter(([from, to, char, pass]) => isBetween([...pass].filter(c => c == char).length, from, to))

console.log("valid:", valid.length)

const good = data.filter(([pos1, pos2, char, pass]) => pass[pos1 - 1] === char ^ pass[pos2 - 1] === char)
const bad = data.filter(([pos1, pos2, char, pass]) => !(pass[pos1 - 1] === char ^ pass[pos2 - 1] === char))

console.log("good:", good.length)
console.log(good.filter((_,i) => i < 10))
console.log("bad:", bad.length)
console.log(bad.filter((_,i) => i < 10))