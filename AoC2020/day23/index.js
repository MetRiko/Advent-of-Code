const fs = require('fs');
const List = require('collections/list');

const testData = `
389125467
`.trim()

const inputData = fs.readFileSync('input.txt').toString().trim() //^(\w+\s[^(])*(\w+)

// const cups = testData.split('').map(x => parseInt(x))
const cups = inputData.split('').map(x => parseInt(x))


const shuffleCups = (cups, n) => {

	cups = [...cups]

	const allCups = [...cups]

	let currentCup = cups[0]

	const calculateDestination = (pickedCups) => {
		let dest = (allCups.length + currentCup - 1 - 1) % allCups.length + 1
		while (pickedCups.has(dest)) dest = (allCups.length + dest - 1 - 1) % allCups.length + 1
		return dest
	}

	const toIndex = idx => idx % allCups.length

	const pickupCups = (from, n) => {
		pickedCups = []
		for (let i = 0; i < n; ++i) {
			const idx = toIndex(from + i)
			pickedCups.push(cups[idx])
		}
		cups = cups.filter(cup => !pickedCups.has(cup))
		return pickedCups
	}

	const putCapsNextTo = (pickedCups, dest) => {
		cups.splice(cups.indexOf(dest) + 1, 0, ...pickedCups)
	}

	const printCups = () => {
		let str = cups.map(cup => cup === currentCup ? `(${cup})` : `${cup}`).join(' ')
		console.log('cups:', str)
	}

	for (let i = 0; i < n; ++i) {

		console.log(i)

		// console.log(`-- move ${i + 1} --`)
		// printCups()

		const pickedCups = pickupCups(cups.indexOf(currentCup) + 1, 3)
		// console.log('pick up:', pickedCups)

		const dest = calculateDestination(pickedCups)
		// console.log('destination:', dest)

		putCapsNextTo(pickedCups, dest)
		currentCup = cups[toIndex(cups.indexOf(currentCup) + 1)]

		// console.log()
	}

	console.log('-- final --')
	printCups()

	while (cups[0] !== 1) {
		cups.push(cups.shift())
	}

	console.log(cups.slice(1).join(' '))
}

const shuffleCupsV2 = (cups, n) => {

	cups = new List([...cups])

	const maxLabel = cups.length

	// let currentCup = cups.head


	const next = node => {
		node = node.next
		if (node.value === undefined) node = node.next
		return node
	}

	const prev = node => {
		node = node.prev
		if (node.value === undefined) node = node.prev
		return node
	}

	let currentCup = cups.head.next

	const nodesMap = (() => {
		const map = new Map()
		let itr = cups.head.next
		while (itr.value !== undefined) {
			map.set(itr.value, itr)
			itr = itr.next
		}
		return map
	})()

	// console.log(nodesMap)

	const find = value => {
		const ret = nodesMap.get(value)
		// console.log(nodesMap)
		// console.log(value)
		return ret
	}

	// let lastFound = next(next(next(currentCup)))
	// const find = (value) => {
	// 	let step = 0
	// 	let itr = lastFound
	// 	do {
	// 		if (itr.value === value) {
	// 			// console.log('steps:', step)
	// 			lastFound = next(itr)
	// 			return itr
	// 		}
	// 		itr = prev(itr)
	// 		++step
	// 	} while (itr !== lastFound)
	// 	return null
	// }

	const calculateDestination = (pickedCups) => {
		let destValue = (maxLabel + currentCup.value - 1 - 1) % maxLabel + 1
		while (pickedCups.has(destValue)) destValue = (maxLabel + destValue - 1 - 1) % maxLabel + 1
		return find(destValue)
	}

	const pickupCups = (n) => {
		pickedCups = []
		for (let i = 0; i < n; ++i) {
			const itr = next(currentCup)
			pickedCups.push(itr.value)
			itr.delete()
		}
		// cups = cups.filter(cup => !pickedCups.has(cup))
		return pickedCups
	}

	const putCupsNextTo = (pickedCups, destNode) => {
		let node = next(destNode)
		pickedCups.forEach(cup => {
			const newNode = new List.prototype.Node(cup)
			node.addBefore(newNode)
			nodesMap.set(cup, newNode)
		})
	}

	const printCups = () => {
		let str = cups.map(cup => cup === currentCup.value ? `(${cup})` : `${cup}`).join(' ')
		console.log('cups:', str)
	}

	for (let i = 0; i < n; ++i) {

		if (i % 100_000 === 0)
			console.log(`-- move ${i + 1} --`)
		// printCups()

		const pickedCups = pickupCups(3)
		// console.log('pick up:', pickedCups)

		const destNode = calculateDestination(pickedCups)
		// console.log('destination:', destNode.value)

		putCupsNextTo(pickedCups, destNode)
		currentCup = next(currentCup)

		// console.log()
	}

	console.log('-- final --')
	// printCups()

	let itr = cups.find(1)
	const list = []
	for (let i = 0; i < cups.length; ++i) {
		list.push(itr.value)
		itr = next(itr)
	}

	// console.log(list.join(' '))

	return list

	// while (cups[0] !== 1) {
	// 	cups.push(cups.shift())
	// }

	// console.log(cups.slice(1).join(' '))
}

const list1 = shuffleCupsV2(cups, 100)
const answer1 = list1.slice(1).join('')
console.log("Part 1 - shuffle cups 100 times:", answer1)

const oneMilCups = [...cups, ...new Array(1_000_000 - 9).fill(null).map((_, idx) => idx + 9 + 1)]
// console.log(oneMilCups)
const list2 = shuffleCupsV2(oneMilCups, 10_000_000)
console.log("Part 2 - shuffle 1_000_000 cups 10_000_000 times:", list2[1] * list2[2])




// shuffleCups(oneMilCups, 10_000_000)