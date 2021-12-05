import fs from 'fs'

// Utils
const abs = v => Math.abs(v)
const sign = v => Math.sign(v)

const input = fs.readFileSync('input.txt', 'utf8').trim().split(/\r?\n/).map(line => line.split(/,|(\s->\s)/)).map(([x1, _1, y1, _2, x2, _3, y2]) => ([+x1, +y1, +x2, +y2]))

const countCrossedPointsForPairs = pairs => pairs.reduce((counter, [x1, y1, x2, y2]) => {
	const dx = x2 - x1, dy = y2 - y1
	const len = Math.max(abs(dx), abs(dy))
	for (let i = 0; i <= len; ++i) {
		const key = (y1 + sign(dy) * i) * 100000 + x1 + sign(dx) * i
		counter[key] ? ++counter[key] : counter[key] = 1
	}
	return counter
}, {})

const answers = [input, input.filter(p => p[0] == p[2] || p[1] == p[3])].map(pairs => Object.values(countCrossedPointsForPairs(pairs)).filter(v => v > 1).length)
console.log(answers)

