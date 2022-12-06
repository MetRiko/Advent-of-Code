import { sign } from 'crypto'
import fs from 'fs'
import { range, hash, dehash } from './utils.js'

const input = [...fs.readFileSync('input.txt', 'utf8').matchAll(/-?\d+/gm)].do(([[l], [r], [b], [t]]) => ({left: +l, top: +t, bottom: +b, right: +r}))

const triangular = n => n * (n + 1) * 0.5

const maxY = triangular(input.bottom)
console.log(maxY)

const findMaxSteps = () => {
	let step = 1
	while (triangular(step) < input.right) ++step
	return step + 4
}


const boundryCheck = (x, y) => {
	return x >= input.left && x <= input.right && y <= input.top && y >= input.bottom
}

const checkForNSteps = (velX, velY, n) => {
	let x = 0, y = 0
	for (let i = 0; i < n; ++i) {
		x += velX
		y += velY
		velX = velX - Math.sign(velX)
		velY -= 1
		if (boundryCheck(x, y)) return true
	}
	return false
}

const maxN = findMaxSteps()
const pairs = []

for (let x = 0; x <= input.right; ++x) {
	for (let y = -10000; y <= 10000; ++y) {
		if (checkForNSteps(x, y, 1000)) pairs.push([x, y])
	}
}

console.log(pairs)
console.log(pairs.length)