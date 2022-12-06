const fs = require('fs');
const Set = require('collections/set')

// const data = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(group => group.split('\n'))

// const countIfAny = group => new Set(group.join('').split('')).size
// console.log(data.reduce((sum, group) => sum + countIfAny(group), 0))

// const countForEvery = group => group.join('').split('').reduce((map, question) => ({...map, [question]: map[question] + 1 || 1}), {})
// console.log(data.reduce((sum, group) => sum + Object.values(countForEvery(group)).filter(answered => answered === group.length).length, 0))

const groups = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(group => group.split('\n'))

const countA = groups.reduce((sum, group) => sum + new Set([...group.join('')]).size, 0)

const fullSet = new Set([...'abcdefghijklmnopqrstuvwxyz'])
const countB = groups.reduce((sum, group) => sum + group.reduce((set, questions) => new Set([...set].filter(x => questions.has(x))), fullSet).size, 0)

const intersect = (a, b) => new Set([...a].filter(x => b.has(x)))
const countB = groups.reduce((sum, group) => sum + group.reduce((set, questions) => intersect(set, new Set([...questions])), fullSet).size, 0)

console.log(countA, countB)

// const fs = require('fs');
// const Set = require('collections/set')

// const groups = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(group => group.split('\n'))
// const countA = groups.reduce((sum, group) => sum + new Set([...group.join('')]).size, 0)
// const fullSet = new Set([...'abcdefghijklmnopqrstuvwxyz'])
// const countB = groups.reduce((sum, group) => sum + group.reduce((set, questions) => set.intersection([...questions]), fullSet).size, 0)

// console.log(countA, countB)
