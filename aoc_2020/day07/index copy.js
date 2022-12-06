const fs = require('fs');
const Set = require('collections/set')

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

const extractElements = rule => (([leftName, ...bags]) => ({
	[leftName]: bags.map(bag => (([_, num, name]) => [name, parseInt(num)])(bag.match(/(\d+)\s(.*)/)))
}))(rule.match(/^\w+\s\w+|\d+\s\w+\s\w+/g))

// console.log(extractElements('shiny gold bags contain 2 dark red bags.'))

const rules = testData.trim().split('\n').reduce((rules, rule) => ({...rules, ...extractElements(rule)}), {})
// const rules = testData2.trim().split('\n').reduce((rules, rule) => ({...rules, ...extractElements(rule)}), {})
// const rules = fs.readFileSync('input.txt').toString().trim().split('\n').reduce((rules, rule) => ({...rules, ...extractElements(rule)}), {})

const revertedRules = Object.entries(rules).filter(([leftName, bags]) => bags.length).reduce(
	(map, [leftName, bags]) => bags.reduce((map, [name, num]) => ({...map, [name]: map[name] ? [...map[name], leftName] : [leftName]}), map),
{})

console.log(rules)
// console.log(revertedRules)

const next = bagName => revertedRules[bagName]

let searchingBags = new Set(next('shiny gold'))
let foundBags = new Set([])

while (searchingBags.size > 0) {
// for (let i = 0; i <= 2; ++i) {
	foundBags = foundBags.union(searchingBags)//new Set([...foundBags, ...searchingBags])
	searchingBags = new Set([].concat(...searchingBags.map(next).filter(_=>_)))
}

// console.log("found:", foundBags.size)
// console.log(foundBags)

const next2 = ([bagName, number]) => rules[bagName].map(([name, num]) => [name, num * number])

searchingBags = next2(['shiny gold', 1])
let sum = 0

console.log(searchingBags)
while (searchingBags.length > 0) {
	// for (let i = 0; i <= 2; ++i) {
	sum += searchingBags.reduce((sum, [name, num]) => sum + num, 0)
	searchingBags = [].concat(...searchingBags.map(next2))
	console.log(searchingBags)
}

console.log("sum:", sum)








