const fs = require('fs');
const { parse } = require('path');

// FFFBFFFRRL

// const testData = [
// 	'BBBBFBFRLL'
// ]

const data = fs.readFileSync('input.txt').toString().trim().split('\n').map(card => card.match(/([FB]+)([RL]+)/).slice(1, 3).map(half => half.split('')))//card.split(''))
// const data = testData.map(card => card.match(/([FB]+)([RL]+)/).slice(1, 3).map(half => half.split('')))//card.split(''))

const getUpperHalf = ([from, to]) => [from, from + (to - from + 1) / 2 - 1]
const getLowerHalf = ([from, to]) => [from + (to - from + 1) / 2, to]

// FBFBBFFRLR

const calculateRow = (range, chars) => chars.reduce((range, char) => char === 'B' ? getLowerHalf(range) : getUpperHalf(range), [0, 127])

const seats = data.map(pass => {
	const row = pass[0].reduce((range, char) => char === 'B' ? getLowerHalf(range) : getUpperHalf(range), [0, 127])
	const column = pass[1].reduce((range, char) => char === 'R' ? getLowerHalf(range) : getUpperHalf(range), [0, 7])
	const id = row[0] * 8 + column[0]
	// if (id === 980) console.log(row[0], column[0], id, pass)
	return id
})

// BBBBFBFRLL

// const maxId = Math.max(...seats)

// console.log(seats.sort().filter((_, i) => i < 10 || i > seats.length - 40))
console.log(seats.sort((a,b) => a - b).filter((_, i) => i < 20 || i > seats.length - 20))

for (let i = 1; i < seats.length - 1; ++i) {
	if (seats[i - 1] !== seats[i] - 1 || seats[i + 1] !== seats[i] + 1) {
		console.log(seats[i - 1], seats[i], seats[i + 1])
	}
}