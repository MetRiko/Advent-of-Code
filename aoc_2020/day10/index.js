const fs = require('fs');
const Set = require('collections/set')

const testData2 = `
16
10
15
5
1
11
7
19
6
12
4
`

const testData = `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`

// const data = fs.readFileSync('input.txt').toString().trim().split('\n').map(line => parseInt(line))
// const data = testData.trim().split('\n').map(line => parseInt(line))
const data = testData2.trim().split('\n').map(line => parseInt(line))


const sorted = [0, ...data.sort((a, b) => a - b)]

// const values = sorted.reduce((values, v, i) => [...values, sorted[i+1] - v], [])

let deltaValues = []
let mappedValues = {
	1: 0, 2: 0, 3: 1
}

for (let i = 1; i < sorted.length; ++i) {
	const delta = sorted[i] - sorted[i-1]
	++mappedValues[delta]
	deltaValues.push(delta)
}
deltaValues.push(3)

console.log(sorted.toString())
console.log(' ', deltaValues.toString())
console.log(mappedValues, "1 * 3 =>", mappedValues[1] * mappedValues[3])

let bestValues = [0]
let sum = 0

let alts = []

for (let i = 0; i < deltaValues.length; ++i) {
	sum += deltaValues[i]
	if (sum > 3) {
		bestValues.push(sorted[i - 1 + 1])
		// if (sum-3 > 1) 
		alts.push(sorted[i])
		// console.log(sorted[i])
		sum = deltaValues[i]	
	}
	else  alts.push(`(${sorted[i]})`) //console.log(`(${sorted[i]})`)
}

// console.log(bestValues)
// console.log("Count:", bestValues.length)
// console.log("Alts:", alts.toString())




const elementsTo3 = (index) => {
	const val = sorted[index]
	const [a, b, c] = sorted.slice(index+1, index+4) 
	if (c && c - val <= 3) return 3
	else if (b && b - val <= 3) return 2
	else if (a && a - val <= 3) return 1
	return 0
}

const possib = sorted.map((_, i) => elementsTo3(i))

console.log("Possib:", possib.join())

let result = 1
for (let i = 0; i < possib.length; ++i) {

	const [a, b, c] = possib.slice(i, i+3) 

	if (a === 3 && b === 3 && c === 2) {
		result *= 7
		i += 3
	}
	else if (a === 3 && b === 2) {
		result *= 4
		i += 2
	}
	else if (a === 2) {
		result *= 2
		i += 1
	}
}

console.log("result:", result)






// const setA = new Set(sorted)
// const setB = new Set(bestValues)
// console.log(setA.difference(setB))

// 0 1 4 5 6 7 10 11 12 15 16 19
//  1 3 1 1 1 3  1  1  3  1  3
//  1 3 1 1 1 3  1  2  2  2  3

//  1 3 1 1 1 3  1  1  3  1  3
//   2 2 0 0 2 2   0  2  2  2          2^3
//  2 2 1 1 2 2  1  2  2  2  2   2^3

//  1 3 1 1 1 3  1  1  3  1  3

//   1 4     7 10    12 15 16 19

// 1..3 -> go  
// 4..6 -> add prev, reset to base

//   0 1 2 3 4 7 8 9 10 11 14 17 18 19 20 23 24 25 28 31 32 33 34 35 38 39 42 45 46 47 48 49
//    1 1 1 1 3 1 1 1  1  3  3  1  1  1  3  1  1  3  3  1  1  1  1  3  1  3  3  1  1  1  1
//    1 1 1 1 3 1 1 1  1  3  3  1  1  1  3  1  1  3  3  1  1  1  1  3  1  3  3  1  1  1  1
//s= 
//   3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,  48, 49


//    1 1 1 2 2 1 1 1  2  2  2  2  1  2  2  1  2  2  2  2  1  1  2  2  2  2  2  2  1  1  1  13 18


// 3
// 3 x 
// 2 x x
// 3 x x x
// 3 x x x x
