import fs from 'fs'

// Utils
let intersection = (arrA, arrB) => arrA.filter(x => arrB.includes(x))
let difference = (arrA, arrB) => arrA.filter(x => !arrB.includes(x)).concat(arrB.filter(x => !arrA.includes(x)));
let union = (arrA, arrB) => ([...new Set([...arrA, ...arrB])])

const input = fs.readFileSync('input.txt', 'utf8').trim().split(/\r?\n/).map(l => l.split('|').map(seg => seg.trim().split(' ').map(segments => segments.split(''))))


const digitsByACDSegments = {
	5: '0', //101
	1: '2', //001
	4: '3', //100
	2: '5', //010
	3: '6', //011
	6: '9'  //110
			//ACD
}
const digitsBySegmentsAmount = {
	2: '1',
	4: '4',
	3: '7',
	7: '8'
}

const getDigit = (segments, segments_A, segments_B, segments_C, segments_D) => {

	const digit = digitsBySegmentsAmount[segments.length]
	if (digit != null) return digit

	let hasA = (intersection(segments, segments_A).length == segments_A.length) * 4
	let hasC = (intersection(segments, segments_C).length == segments_C.length) * 2
	let hasD = (intersection(segments, segments_D).length == segments_D.length) * 1
	
	return digitsByACDSegments[hasA + hasC + hasD]
}

const getNumber = (uniqueDigits, numberDigits) => {
	const segments_1 = uniqueDigits.find(digits => digits.length == 2)
	const segments_4 = uniqueDigits.find(digits => digits.length == 4)
	const segments_7 = uniqueDigits.find(digits => digits.length == 3)
	const segments_8 = uniqueDigits.find(digits => digits.length == 7)

	const segments_A = [...segments_1]
	const segments_B = difference(segments_7, segments_A)
	const segments_C = difference(segments_4, segments_A)
	const segments_D = difference(segments_8, [...segments_A, ...segments_B, ...segments_C])

	const digitsSequences = uniqueDigits.map(segments => [getDigit(segments, segments_A, segments_B, segments_C, segments_D), segments])

	const digits = numberDigits.map(segments => digitsSequences.find(([_, digitSegments]) => union(segments, digitSegments).length == digitSegments.length && segments.length == digitSegments.length)[0])
	
	return +digits.join('')
}

const task_2 = () => {
	const sum = input.reduce((sum, [uniqueDigits, numberDigits]) => sum + getNumber(uniqueDigits, numberDigits), 0)
	console.log(sum)
}

const task_1 = () => {
	const groups = input.reduce((obj, [_, segs]) => segs.reduce((objr, seg) => (objr[seg.length] = objr[seg.length] ? objr[seg.length] + 1 : 1, objr), obj), {})
	console.log(groups[2] + groups[3] + groups[4] + groups[7])
}

// task_1()
task_2()