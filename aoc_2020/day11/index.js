const fs = require('fs');
const Set = require('collections/set')

const testData = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`

const seats = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split('').map(c => [c, c]))
// const seats = testData.trim().split('\n').map(line => line.split('').map(c => [c, c]))

let iteration = 0

const getChar = (x, y) => seats[y]?.[x]?.[iteration % 2]
const setChar = (x, y, c) => seats[y][x][(iteration + 1) % 2] = seats[y][x][(iteration + 1) % 2] !== '.' ? c : seats[y][x][(iteration + 1) % 2]

const offsets = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	//[0, 0],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
]
const countOccupiedSeats = (x, y) => offsets.reduce((count, [ox, oy]) => getChar(x+ox, y+oy) === '#' ? count + 1 : count, 0)
const countDiagonalOccupiedSeats = (x, y) => {
	const findOccupiedForSingleDiagonal = (x, y, [ox, oy]) => {
		let count = 1
		while (true) {
			const char = getChar(x+ox*count, y+oy*count)
			if (char === '#') return true
			else if (char === undefined || char === 'L') return false
			++count
		}
	}
	return offsets.reduce((count, offset) => findOccupiedForSingleDiagonal(x, y, offset) === true ? count + 1 : count, 0)
}

const makeIteration = () => {
	let changes = 0
	for (let y = 0; y < seats.length; ++y) {
		for (let x = 0; x < seats[y].length; ++x) {
			// if (getChar(x, y) === 'L' && countOccupiedSeats(x, y) === 0) {
			if (getChar(x, y) === 'L' && countDiagonalOccupiedSeats(x, y) === 0) {
				setChar(x,y,'#')
				++changes 
			}
			// else if (getChar(x, y) === '#' && countOccupiedSeats(x, y) >= 4) {
			else if (getChar(x, y) === '#' && countDiagonalOccupiedSeats(x, y) >= 5) {
				setChar(x,y,'L')
				++changes 
			}
			else setChar(x,y,getChar(x, y))
			
		}
	}
	++iteration
	return changes
}

const printData = () => console.log(`Iteration = ${iteration}\n${seats.map(line => line.map(char => char[iteration % 2]).join('')).join('\n')}\n`)

// printData()
while (makeIteration() !== 0);// printData()
// printData()

const countOccupied = () => seats.reduce((sum, line, y) => sum + line.reduce((sum, _, x) => getChar(x,y) === '#' ? sum + 1 : sum, 0), 0)

console.log("Occupied:", countOccupied())