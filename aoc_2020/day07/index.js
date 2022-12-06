const fs = require('fs');
const Set = require('collections/set')

// const repeat = c => (f, x) => {while (c(x)) { x = f(x) } return x}
// const loop = (f, x) => {while (x[0]) { x = f(x[1]) } return x[1]}
// const until = bool => value => [bool, value]

const testData = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`

const testData2 = `
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
`

const extractElements = rule => (([left, ...bags]) => ({[left[0]]: bags.map(([_,num,name])=>[name, parseInt(num)])}))([...rule.matchAll(/^\w+\s\w+|(\d+)\s(\w+\s\w+)/g)])

// const rules = Object.assign({}, ...testData.trim().split('\n').map(extractElements))
// const rules = Object.assign({}, ...testData2.trim().split('\n').map(extractElements))
const rules = Object.assign({}, ...fs.readFileSync('input.txt').toString().trim().split('\n').map(extractElements))
const revertedRules = Object.entries(rules).reduce((map, [left, bags]) => bags.reduce((map, [name, num]) => (map[name] = (map[name] || []).concat(left)) && map, map), {})

let searchingBags = new Set(['shiny gold'])
let foundBags = new Set([])

while (searchingBags.size > 0) {
	foundBags = foundBags.union(searchingBags = new Set([].concat(...searchingBags.map(_ => revertedRules[_]).filter(_=>_))))
}
console.log("found:", foundBags.size)

searchingBags = next2(['shiny gold', 1])
let sum = 0
while (searchingBags.length > 0) {
	sum += searchingBags.reduce((sum, [name, num]) => sum + num, 0)
	searchingBags = [].concat(...searchingBags.map(([bagName, number]) => rules[bagName].map(([name, num]) => [name, num * number])))
}
console.log("sum:", sum)








