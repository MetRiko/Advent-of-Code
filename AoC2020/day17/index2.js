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
	for (let w = 0; w < size; ++w) {
		cube[w] = new Array(size)
		for (let z = 0; z < size; ++z) {
			cube[w][z] = new Array(size)
			for (let y = 0; y < size; ++y) {
				cube[w][z][y] = new Array(size)
				for (let x = 0; x < size; ++x) cube[w][z][y][x] = '.'
			}
		}
	}
	return cube
}

const mapCube = (cube, callback) => {
	const newCube = generateEmptyCube(cube.length)
	for (let w = 0; w < cube.length; ++w) {
		for (let z = 0; z < cube.length; ++z) {
			for (let y = 0; y < cube.length; ++y) {
				for (let x = 0; x < cube.length; ++x) {
					newCube[w][z][y][x] = callback(cube[w][z][y][x], x, y, z, w)
				}
			}
		}
	}
	return newCube
}

const initCube = (data, maxSize) => {

	const newCube = mapCube(generateEmptyCube(maxSize), (value, x, y, z, w) => {
		const dw = Math.floor(maxSize / 2)
		const dz = Math.floor(maxSize / 2)
		const dy = Math.floor((maxSize - data.length) / 2)
		const dx = Math.floor((maxSize - data[0].length) / 2)
		if (dz === z && dw === w) return data[y - dy]?.[x - dx] === '#' ? '#' : '.'
		else return '.'
	})

	return newCube
}


// const printCube = cube => {
// 	cube.forEach((slice, z) => {
// 		console.log('Slice:', z)
// 		slice.forEach((line, y) => console.log(line.join('')))
// 	})
// }

const nextState = (cube, x, y, z, w) => {

	const offsets = []
	for (let w = -1; w <= 1; ++w) for (let z = -1; z <= 1; ++z) for (let y = -1; y <= 1; ++y) for (let x = -1; x <= 1; ++x) {
		if (x !== 0 || y !== 0 || z !== 0 || w !== 0) offsets.push([x, y, z, w])
	}

	const neighbours = offsets.reduce((count, [dx, dy, dz, dw]) => cube[w + dw]?.[z + dz]?.[y + dy]?.[x + dx] === '#' ? count + 1 : count, 0)

	const state = cube[w][z][y][x]
	const newState = (() => {
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
for (let i = 0; i < 6; ++i) {
	cube = mapCube(cube, (value, x, y, z, w) => nextState(cube, x, y, z, w))
}

let countActive = 0
mapCube(cube, (value, x, y, z, w) => {
	if (value === '#') ++countActive
	return value
})


console.log("Part 2 - Sum for 4th dimension:", countActive)


