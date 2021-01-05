const fs = require('fs');
const Set = require('collections/set')

const extractElements = rule => (([left, ...bags]) => ({[left[0]]: bags.map(([_,num,name])=>[name, parseInt(num)])}))([...rule.matchAll(/^\w+\s\w+|(\d+)\s(\w+\s\w+)/g)])

const rules = Object.assign({}, ...fs.readFileSync('input.txt').toString().trim().split('\n').map(extractElements))
const revertedRules = Object.entries(rules).reduce((map, [left, bags]) => bags.reduce((map, [name, num]) => (map[name] = (map[name] || []).concat(left)) && map, map), {})

let search = new Set(['shiny gold'])
let found = new Set([])

while (search.size > 0) {
	found = found.union(search = new Set([].concat(...search.map(_ => revertedRules[_]).filter(_=>_))))
}

search = next2(['shiny gold', 1])
let sum = 0
while (search.length > 0) {
	sum += search.reduce((sum, [name, num]) => sum + num, 0)
	search = [].concat(...search.map(([bagName, number]) => rules[bagName].map(([name, num]) => [name, num * number])))
}

console.log("found:", found.size, "sum:", sum)








