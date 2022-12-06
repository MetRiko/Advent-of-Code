const fs = require('fs');

const testData = `
F10
N3
F7
R90
F11
`

const testData2 = `
W10
E10
N10
S10
`

const seats = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => (([_, l, n]) => [l, parseInt(n)])(line.match(/([A-Z])(\d+)/)))
// const seats = testData.trim().split('\n').map(line => (([_, l, n]) => [l, parseInt(n)])(line.match(/([A-Z])(\d+)/)))
// const seats = testData2.trim().split('\n').map(line => (([_, l, n]) => [l, parseInt(n)])(line.match(/([A-Z])(\d+)/)))

const dirs = [
	[1, 0],
	[0, -1],
	[-1, 0],
	[0, 1]
]

const add = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2] 
const times = ([x1, y1], v) => [x1 * v, y1 * v] 

const getDistance = () => {
	let pos = [0, 0]
	let dir = 0

	const move = (letter, value) => {
		switch (letter) {
			case 'N': pos = add(pos, times(dirs[3], value)); break;
			case 'S': pos = add(pos, times(dirs[1], value)); break;
			case 'E': pos = add(pos, times(dirs[0], value)); break;
			case 'W': pos = add(pos, times(dirs[2], value)); break;
			case 'L': dir = (dir + 4 - value/90) % 4; break;
			case 'R': dir = (dir + value/90) % 4; break;
			case 'F': pos = add(pos, times(dirs[dir], value)); break;
		}
	}
	seats.forEach(([letter, value]) => move(letter, value))
	console.log(pos)
	return Math.abs(pos[0]) + Math.abs(pos[1])
}

console.log("Distance:", getDistance())

const getDistance2 = () => {
	dir = [10, 1]
	pos = [0, 0]

	const rotate = ([x, y], n) => {
		switch (n) {
			case 0: return [x, y]
			case 1: return [y, -x]
			case 2: return [-x, -y]
			case 3: return [-y, x]
		}
		return undefined
	}

	const move = (letter, value) => {
		switch (letter) {
			case 'N': dir[1] += value; break;
			case 'S': dir[1] -= value; break;
			case 'E': dir[0] += value; break;
			case 'W': dir[0] -= value; break;
			case 'L': dir = rotate(dir, (4 - value/90) % 4); break;
			case 'R': dir = rotate(dir, (value/90) % 4); break;
			case 'F': pos = add(pos, times(dir, value)); break;
		}
	}

	console.log(pos, dir)
	seats.forEach(([letter, value]) => {
		move(letter, value)
		console.log(pos, dir)
	})
	console.log(pos)
	return Math.abs(pos[0]) + Math.abs(pos[1])
}

console.log("Distance2:", getDistance2())