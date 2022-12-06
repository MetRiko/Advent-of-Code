import fs from 'fs'

// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }
const incrementCounter = (counter, key, value = 1) => (counter[key] ? counter[key] += value : counter[key] = value, counter)

const { template, connections } = fs.readFileSync('input.txt', 'utf8').split(/\r?\n\r?\n/).do(([template, lines]) => ({
	template: template.split(''),
	connections: [...lines.matchAll(/(\w+) -> (\w)/gm)].reduce((obj, [_, pair, char]) => (obj[pair] = char, obj), {})
}))

const step = (activityTable) => {
	const nextActivityTable = {}
	Object.entries(activityTable).forEach(([pair, repeats]) => {
		const char = connections[pair]
		incrementCounter(nextActivityTable, pair[0] + char, repeats)
		incrementCounter(nextActivityTable, char + pair[1], repeats)
	})
	return nextActivityTable
}


const task = steps => {
	const templatePairs = range(template.length - 1).map(i => template[i] + template[i + 1])
	let activityTable = templatePairs.reduce((table, pair) => incrementCounter(table, pair, 1), {})
	let countedElements = template.reduce((counter, char) => incrementCounter(counter, char, 1), {})

	for (let i = 0; i < steps; ++i) {
		countedElements = Object.entries(activityTable).reduce((counter, [pair, repeats]) => 
			incrementCounter(counter, connections[pair][0], repeats), countedElements)
		activityTable = step(activityTable)
	}

	const min = Math.min(...Object.values(countedElements))
	const max = Math.max(...Object.values(countedElements))
	console.log(max - min)
}

const task_1 = () => task(10)
const task_2 = () => task(40)

// task_1()
task_2()