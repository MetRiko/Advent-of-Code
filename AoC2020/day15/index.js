const fs = require('fs');
const FastMap = require('collections/map')

const testData = `
0,3,6
`

const stritchData = `
0,8,15,2,12,1,4
`

// const data = fs.readFileSync('input.txt').toString().trim().split(',').map(x => parseInt(x))
// const data = testData.trim().split(',').map(x => parseInt(x))
const data = stritchData.trim().split(',').map(x => parseInt(x))


const getSpokenNumber = (startingNumbers, lastTurn) => {
	let spokenNumbers = startingNumbers.slice(0, startingNumbers.length - 1).reduce((map, num, idx) => ({ ...map, [num]: idx + 1 }), {})
	let turn = startingNumbers.length
	let lastSpoken = startingNumbers[startingNumbers.length - 1]
	const x = 'asd'.match(/sa/)

	while (turn < lastTurn) {

		const isSpoken = spokenNumbers[lastSpoken]
		// console.log('t:', turn, 'ls:', lastSpoken, ": ",isSpoken)
		spokenNumbers[lastSpoken] = turn

		if (isSpoken) {
			lastSpoken = turn - isSpoken
		}
		else {
			lastSpoken = 0
		}
		++turn

		if (turn % 1000000 === 0) {
			console.log(turn, '/', lastTurn)
		}

	}

	return lastSpoken
}

const getSpokenNumber2 = (startingNumbers, lastTurn) => {
	let spokenNumbers = new Map(startingNumbers.slice(0, startingNumbers.length - 1).map((num, idx) => [num, idx + 1]))
	let turn = startingNumbers.length
	let lastSpoken = startingNumbers[startingNumbers.length - 1]
	let x = 'asd'.match(/asdasd/)

	while (turn < lastTurn) {
		const isSpoken = spokenNumbers.get(lastSpoken)
		spokenNumbers.set(lastSpoken, turn)
		lastSpoken = isSpoken ? turn - isSpoken : 0
		++turn
	}

	return lastSpoken
}

const getSpokenNumber3 = (startingNumbers, lastTurn) => {
	let spokenNumbers = new Array(30000000)
	startingNumbers.slice(0, startingNumbers.length - 1).forEach((num, idx) => spokenNumbers[num] = idx + 1)
	let turn = startingNumbers.length
	let lastSpoken = startingNumbers[startingNumbers.length - 1]

	while (turn < lastTurn) {
		const isSpoken = spokenNumbers[lastSpoken]
		spokenNumbers[lastSpoken] = turn
		if (isSpoken) {
			lastSpoken = turn - isSpoken
		}
		else {
			lastSpoken = 0
		}
		++turn
		// if (max < lastSpoken) max = lastSpoken
		// if (turn % 1000000 === 0) {
		// 	console.log(turn, '/', lastTurn)
		// 	console.log(lastSpoken)
		// }

	}
	return lastSpoken
}

// console.log("JS objects:")
// console.time("alg1");
// console.log(getSpokenNumber(data, 30000000))
// console.timeEnd("alg1")

console.log("Algorithm 2:")
console.time("alg2");
console.log(getSpokenNumber2(data, 30000000))
console.timeEnd("alg2")

console.log("Algorithm 3:")
console.time("alg3");
console.log(getSpokenNumber3(data, 30000000))
console.timeEnd("alg3")
