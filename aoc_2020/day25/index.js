const fs = require('fs')
const Set = require('collections/set')
// const Set = require('collections/fast-set')

const testData = `
5764801
5764801
`

const inputData = fs.readFileSync('input.txt').toString() //^(\w+\s[^(])*(\w+)

// const publicKeys = testData.trim().split('\n').map(x => parseInt(x))
const publicKeys = inputData.trim().split('\n').map(x => parseInt(x))

const transform = (subject, loopSize) => {
	let value = 1
	for (let i = 0; i < loopSize; ++i) {
		value *= subject
		value %= 20201227
	}
	return value
}


const [key1, key2] = publicKeys
const privateKeys = [null, null]
let value = 1

let state = 0
let i = 0
while (true) {
	value *= 7
	value %= 20201227

	if (key1 === value) {
		const loopSize = i + 1
		privateKeys[0] = transform(key2, loopSize)
		console.log('Public Key1', key1, ' - ', 'loopSize:', i + 1)
		++state
		if (state >= 2) break
	}

	if (key2 === value) {
		const loopSize = i + 1
		privateKeys[1] = transform(key1, loopSize)
		console.log('Public Key2', key2, ' - ', 'loopSize:', i + 1)
		++state
		if (state >= 2) break
	}
	++i
}

console.log("Part 1 - Encryption key:", privateKeys[0])

// const paths = inputData.trim().split('\n').map(line => line.match(/se|sw|nw|ne|w|e/g))
