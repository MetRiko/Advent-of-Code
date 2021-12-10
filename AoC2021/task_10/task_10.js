import fs from 'fs'

// Utils

const input = fs.readFileSync('input.txt', 'utf8').trim().split(/\r?\n/)

const pairs = {
	'(': {opening: true, pairId: 1, pairChar: ')'},
	'[': {opening: true, pairId: 2, pairChar: ']'},
	'{': {opening: true, pairId: 3, pairChar: '}'},
	'<': {opening: true, pairId: 4, pairChar: '>'},
	')': {opening: false, pairId: 1, pairChar: '('},
	']': {opening: false, pairId: 2, pairChar: '['},
	'}': {opening: false, pairId: 3, pairChar: '{'},
	'>': {opening: false, pairId: 4, pairChar: '<'}
}

const countSyntax = line => {
	const stack = []
	const countedCorrupted = { ')': 0, ']': 0, '}': 0, '>': 0 }

	for (let i = 0; i < line.length; ++i) {
		const char = pairs[line[i]]
		if (char.opening == true) {
			stack.push(line[i])
		}
		else {
			if (pairs[stack[stack.length - 1]].pairId != char.pairId) {
				countedCorrupted[line[i]] += 1
			}
			stack.pop()
		}
	}
	stack.reverse()
	const closingSequence = stack.map(char => pairs[char].pairChar)
	const corrupted = Object.values(countedCorrupted).some(v => v > 0)
	return { corrupted, closingSequence, ...countedCorrupted }
}

const task_1 = () => {
	const sums = input.map(line => countSyntax(line)).reduce((sums, result) => {
		Object.keys(sums).forEach(key => sums[key] += result[key])
		return sums
	}, { ')': 0, ']': 0, '}': 0, '>': 0 })

	const syntaxScore = sums[')'] * 3 + sums[']'] * 57 + sums['}'] * 1197 + sums['>'] * 25137
	console.log(syntaxScore)
}

const task_2 = () => {
	const scoreTable = { ')': 1, ']': 2, '}': 3, '>': 4 }
	const scores = input
		.map(line => countSyntax(line))
		.filter(({corrupted}) => !corrupted)
		.map(({closingSequence}) => closingSequence.reduce((sum, char) => sum * 5 + scoreTable[char], 0))

	scores.sort((a, b) => b - a)

	const answer = scores[Math.floor(scores.length / 2)]
	console.log(answer)
}

// task_1()
task_2()