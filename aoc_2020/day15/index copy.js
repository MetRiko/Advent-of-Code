const fs = require('fs');
const { getUnpackedSettings } = require('http2');

const testData = `
0,3,6
`

// const data = testData.trim().split('\n')  
const data = fs.readFileSync('input.txt').toString().trim().split(',').map(x => parseInt(x))
// const data = testData.trim().split(',').map(x => parseInt(x))


const getSpokenNumber = (startingNumbers, lastTurn) => {
	let spokenNumbers = startingNumbers.slice(0, startingNumbers.length - 1).reduce((map, num, idx) => ({...map, [num]: idx+1}), {})
	let turn = startingNumbers.length
	let lastSpoken = startingNumbers[startingNumbers.length - 1]

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

// console.log(getSpokenNumber(data, 2020))
console.log(getSpokenNumber(data, 30000000))

