const fs = require('fs');

const testData = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`

const stream = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => parseInt(line))
// const stream = testData.trim().split('\n').map(line => parseInt(line))

const preamble = 25
let pivotLeft = 0
let pivotRight = pivotLeft + preamble - 1
let nextNumber = stream[pivotRight + 1]

const printRange = (from, to) => console.log(stream.slice(from, to + 1))

const next = () => {
	++pivotLeft
	++pivotRight
	nextNumber = stream[pivotRight + 1]
	return pivotRight < stream.length
}

const checkPrev = number => !stream.slice(0, pivotLeft).some(value => value === number)

const checkSum = number => {
	for (let i = pivotLeft; i <= pivotRight; ++i) {
		for (let j = i + 1; j <= pivotRight; ++j) {
			if (number === stream[i] + stream[j]) return true
		}
	}
	return false
}

// console.log(checkPrev(20))
// next()
// console.log(checkPrev(20))
// next()
// console.log(checkPrev(20))
// next()
// console.log(checkPrev(20))


// while (checkPrev(nextNumber) && checkSum(nextNumber)) { next() }
// while (checkSum(nextNumber)) { next() }
// while (true) { 
// 	const a = checkPrev(nextNumber) 
// 	const b = checkSum(nextNumber)
// 	printRange()
// 	console.log(a, b)
// 	console.log("nextNumber:", nextNumber)
// 	if (!a || !b) break;
// 	next() 
// }

// console.log(stream[pivotRight + 1])



const findContigousSet = number => {
	let leftPivot = 0
	let rightPivot = 0
	let sum = stream[0]

	const popBack = () => {
		sum -= stream[leftPivot] 
		++leftPivot
		return sum
	}

	const pushFront = () => {
		++rightPivot
		sum += stream[rightPivot]
		return sum
	}

	while (sum !== number) { sum = sum > number ? popBack() : pushFront() }

	return stream.slice(leftPivot, rightPivot + 1)	
}

// 756008079
const set = findContigousSet(756008079)
const min = Math.min(...set)
const max = Math.max(...set)
console.log(min + max)