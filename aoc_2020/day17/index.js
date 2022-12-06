const fs = require('fs');
const FastMap = require('collections/map');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

const testData = `
.#.
..#
###
`

const data = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => line.split(''))
// const data = testData.trim().split('\n').map(line => line.split(''))

const generateEmptyCube = size => {
	const cube = new Array(size)
	for (let z = 0; z < size; ++z) {
		cube[z] = new Array(size)
		for (let y = 0; y < size; ++y) {
			cube[z][y] = new Array(size)
			for (let x = 0; x < size; ++x) cube[z][y][x] = '.'
		}
	}
	return cube
}

const mapCube = (cube, callback) => {
	const newCube = generateEmptyCube(cube.length)
	for (let z = 0; z < cube.length; ++z) {
		for (let y = 0; y < cube.length; ++y) {
			for (let x = 0; x < cube.length; ++x) {
				newCube[z][y][x] = callback(cube[z][y][x], x, y, z)
			}
		}
	}
	return newCube
}

const initCube = (data, maxSize) => {

	const newCube = mapCube(generateEmptyCube(maxSize), (value, x, y, z) => {
		const dz = Math.floor(maxSize / 2)
		const dy = Math.floor((maxSize - data.length) / 2)
		const dx = Math.floor((maxSize - data[0].length) / 2)
		if (dz === z) return data[y - dy]?.[x - dx] === '#' ? '#' : '.'
		else return '.'
	})

	return newCube
}


const printCube = cube => {
	cube.forEach((slice, z) => {
		console.log('Slice:', z)
		slice.forEach((line, y) => console.log(line.join('')))
	})
}

const nextState = (cube, x, y, z) => {

	const offsets = []
	for (let z = -1; z <= 1; ++z) for (let y = -1; y <= 1; ++y) for (let x = -1; x <= 1; ++x) {
		if (x !== 0 || y !== 0 || z !== 0) offsets.push([x, y, z])
	}

	const neighbours = offsets.reduce((count, [dx, dy, dz]) => cube[z + dz]?.[y + dy]?.[x + dx] === '#' ? count + 1 : count, 0)

	const state = cube[z][y][x]
	const newState = (() => {
		// console.log(neighbours)

		if (state === '#') {
			if (neighbours !== 2 && neighbours !== 3) return '.'
			else return '#'
		}
		else {
			if (neighbours === 3) return '#'
			else return '.'
		}
	})(state)

	return newState


}

let cube = initCube(data, 20)
// printCube(cube)
// console.log('-----------------------')

for (let i = 0; i < 6; ++i) {
	cube = mapCube(cube, (value, x, y, z) => nextState(cube, x, y, z))
}

printCube(cube)

let countActive = 0
mapCube(cube, (value, x, y, z) => {
	if (value === '#') ++countActive
	return value
})


console.log("Part 1 - Sum for 3rd dimension:", countActive)

// printCube(cube)
// console.log('-----------------------')

