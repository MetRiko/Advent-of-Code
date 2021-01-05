const fs = require('fs')
const Set = require('collections/set')
// const Set = require('collections/fast-set')

const testData = `
sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew
`

const inputData = fs.readFileSync('input.txt').toString() //^(\w+\s[^(])*(\w+)

// const paths = testData.trim().split('\n').map(line => line.match(/se|sw|nw|ne|w|e/g))
const paths = inputData.trim().split('\n').map(line => line.match(/se|sw|nw|ne|w|e/g))

const dirs = {
	se: [1, 1],
	sw: [0, 1],
	nw: [-1, -1],
	ne: [0, -1],
	w: [-1, 0],
	e: [1, 0]
}

const sumVec2 = (a, b) => [a[0] + b[0], a[1] + b[1]]
// const hashPos = pos => (pos[0] + 10_000) + (pos[1] + 10_000) * 100_000
// const hash2Pos = hash => {
// 	const y = Math.round(hash / 100_000)
// 	const x = hash - y * 100_000
// 	return [x - 10_000, y - 10_000]
// }
const hashPos = pos => `${pos[0]},${pos[1]}`
const hash2Pos = hash => {
	// console.log(hash)
	const [x, y] = hash.split(',').map(v => parseInt(v))
	return [x, y]
}

const posFromPath = path => path.reduce((pos, nextMove) => sumVec2(pos, dirs[nextMove]), [0, 0])

const countFlips = paths.map(path => posFromPath(path)).reduce((map, pos) => {
	const hash = hashPos(pos)
	map.set(hash, map.get(hash) + 1 || 1)
	return map
}, new Map())

const countBlackTiles = Object.values(countFlips).filter(flips => flips % 2 === 1).length
// console.log(countBlackTiles)

const poss = [
	[0, 0],
	[0, 1],
	[1, 0],
	[1, 1],
	[2, 2],
	[0, -1],
	[-1, 0],
	[-1, -1],
	[-2, -2],
]

// console.log(poss)
// console.log(poss.map(pos => hashPos(pos)))
// console.log(poss.map(pos => hashPos(pos)).map(hash => hash2Pos(hash)))

const solve = async () => {

	const offsets = Object.values(dirs)

	// const adjacentTilesMap = new Map()
	// const getAdjacentTiles = tile => {
	// 	let tiles = adjacentTilesMap.get(tile)
	// 	if (tiles === undefined) {
	// 		const pos = hash2Pos(tile)
	// 		tiles = offsets.map(offset => hashPos(sumVec2(pos, offset)))
	// 		adjacentTilesMap.set(tile, tiles)
	// 	}
	// 	return tiles
	// }

	const getAdjacentTiles = tile => {
		const pos = hash2Pos(tile)
		return offsets.map(offset => hashPos(sumVec2(pos, offset)))
	}

	// const getWhiteTiles = blackTiles => new Set(blackTiles.map(tile => getAdjacentTiles(tile)).flat()).difference(blackTiles)
	const getWhiteTiles = blackTiles => {

		const tiles = []

		for (const tile of blackTiles) {
			const adjacentTiles = getAdjacentTiles(tile)

			for (const adjacentTile of adjacentTiles) {
				if (blackTiles.has(adjacentTile) == false) {
					tiles.push(adjacentTile)
				}
			}
		}
		return new Set(tiles)
	}

	let blackTiles = new Set([...countFlips.entries()].filter(([_, value]) => value % 2 === 1).map(([key, _]) => key))

	// console.log(countFlips)
	// console.log(blackTiles)
	// console.log(blackTiles.map(tile => hash2Pos(tile)))


	const checkFirstRule = tile => {
		const adjacentTiles = getAdjacentTiles(tile)
		const countBlackTiles = blackTiles.difference([tile]).intersection(adjacentTiles).length
		return countBlackTiles === 0 || countBlackTiles > 2
	}

	const checkSecondRule = tile => {
		const adjacentTiles = getAdjacentTiles(tile)
		const countBlackTiles = blackTiles.difference([tile]).intersection(adjacentTiles).length
		return countBlackTiles === 2
	}

	console.log("Day 0", blackTiles.length)
	// console.log(blackTiles)
	for (let i = 0; i < 100; ++i) {

		const newBlackTiles = []
		const deletedBlackTiles = []

		const promises = []

		const p1 = new Promise((resolve, reject) => {
			for (const tile of blackTiles) {
				if (checkFirstRule(tile)) deletedBlackTiles.push(tile)
				resolve(null)
			}
		})

		const p2 = new Promise((resolve, reject) => {
			const whiteTiles = getWhiteTiles(blackTiles)
			for (const tile of whiteTiles) {
				if (checkSecondRule(tile)) newBlackTiles.push(tile)
				resolve(null)
			}
		})

		await Promise.all([p1, p2])

		// console.log('a')
		// blackTiles.forEach(tile => {
		// 	if (checkFirstRule(tile)) {
		// 		deletedBlackTiles.push(tile)
		// 	}
		// })
		// console.log('b')


		// const whiteTiles = getWhiteTiles(blackTiles)
		// whiteTiles.forEach(tile => {
		// 	if (checkSecondRule(tile)) {
		// 		newBlackTiles.push(tile)
		// 	}
		// })

		// console.log(...deletedBlackTiles)
		// console.log(...newBlackTiles)

		blackTiles = blackTiles.difference(deletedBlackTiles).union(newBlackTiles)

		console.log(`Day ${i + 1}`, blackTiles.length)
		// console.log(blackTiles)
	}
}

solve()
