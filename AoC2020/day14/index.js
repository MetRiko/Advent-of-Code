const fs = require('fs');
const { getUnpackedSettings } = require('http2');

const testData = `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`
const testData2 = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`

// const data = testData2.trim().split('\n')  
// const data = testData.trim().split('\n')  
const data = fs.readFileSync('input.txt').toString().trim().split('\n')  
		.map(line => { 
			const mask = line.match(/mask = (\w*)/)
			if (mask) return ['mask', mask[1]]
			const mem = line.match(/mem\[(\w*)\] = (\d*)/)
			if (mem) return ['mem', mem[1], BigInt(mem[2])]
		})

// console.log(data.filter((_, i) => i > data.length - 10))

const splitToMasks = mask => {
	const ones = mask.split('').map(x => x === '1' ? x : '0').join('')
	const zeros = mask.split('').map(x => x === '0' ? x : '1').join('')
	console.log(zeros, ones)

	return [BigInt('0b' + zeros), BigInt('0b' + ones)]
	// console.log(ones, zeros)
	// console.log(parseInt(ones), parseInt(zeros))
}

const applyMasks = (value, zeros, ones) => (value | ones) & zeros

// splitToMasks(data[0][1])

const solve = data => {
	let mem = {}

	let zerosMask = 0
	let onesMask = 0 
	

	for (line of data) {
		// console.log(line)
		if (line[0] === 'mask') {
			[zerosMask, onesMask] = splitToMasks(line[1])
		}
		else {
			// console.log(line[1], line[2], onesMask, zerosMask)
			mem[line[1]] = applyMasks(line[2], zerosMask, onesMask) 
			// console.log(mem[line[1]])
		}
		// console.log(zerosMask, onesMask)
	}
	return mem

}

// const answer = solve(data)
// console.log(answer)
// console.log(Object.values(answer).reduce((sum, val) => sum + val, BigInt(0)))

const applyMaskAndGetPermutations = (value, mask) => {
	value = value.toString(2).padStart(36, '0').split('')
	mask = mask.split('')
	// console.log(x)
	// console.log(mask)
	let xses = []
	let result = new Array(36)
	for (let i = 0; i < 36; ++i) {
		const v = value[i]
		const m = mask[i]
		if (m === 'X') {
			result[i] = 'X'
			xses.push(i)
		}
		else if (m === '1' || v === '1') result[i] = '1'
		else result[i] = '0' 
	}
	console.log('value:', value.join(''))
	console.log('mask:', mask.join(''))
	console.log('result:', result.join(''))

	let permutations = []

	for (let i = 0; i < Math.pow(2, xses.length); ++i) {
		const b = i.toString(2).padStart(xses.length, '0').split('')
		b.forEach((bit, i) => {
			const index = xses[i]
			result[index] = bit
		})
		permutations.push(parseInt(result.join(''), 2))
		// console.log(result.join(''), parseInt(result.join(''), 2))
	}
	return permutations
}

// const permutations = applyMaskAndGetPermutations(42, '000000000000000000000000000000X1001X')
// console.log(permutations)

const solve2 = data => {
	let mem = {}

	// let zerosMask = 0
	// let onesMask = 0 
	let mask = ''

	for (line of data) {
		console.log(line)
		if (line[0] === 'mask') {
			mask = line[1]
		}
		else {
			// console.log(line[1], line[2], onesMask, zerosMask)
			const permutations = applyMaskAndGetPermutations(parseInt(line[1]), mask)
			permutations.forEach(addr => {
				mem[addr] = line[2]
			})
			// mem[line[1]] = applyMasks(line[2], zerosMask, onesMask) 
			// console.log(mem[line[1]])
		}
		// console.log(zerosMask, onesMask)
	}
	return mem

}

// console.log(solve2(data))
console.log(Object.values(solve2(data)).reduce((sum, val) => sum + val, BigInt(0)))

// const convertToBitmask = str => {
// 	let mask = new Array(64).map(x => false)
// 	let value = parseInt(str)
// 	let itr = mask.length - 1 
// 	while (value) {
// 		mask[itr] = Boolean(value % 2)
// 		mask[itr] = (mask[itr] / 2)
// 		--itr
// 	}
// }

