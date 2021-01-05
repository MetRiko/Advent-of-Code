const fs = require('fs');
const { getUnpackedSettings } = require('http2');

const testData = `
939
7,13,x,x,59,x,31,19
`

const minBy = (arr, func) => { const min = Math.min(...arr.map(func)); return arr.find(item => func(item) === min)}

// const data = (([time, buses]) => ({time: parseInt(time), buses: buses.split(',').map(bus => parseInt(bus) || null)}))(testData.trim().split('\n'))
const data = (([time, buses]) => ({time: parseInt(time), buses: buses.split(',').map(bus => parseInt(bus) || null)}))(fs.readFileSync('input.txt').toString().trim().split('\n'))

// .map(line => (([_, l, n]) => [l, parseInt(n)])(line.match(/([A-Z])(\d+)/)))

// console.log(data)


// console.log((([time, bus]) => time * bus)(data.buses.filter(x => x).map(bus => ([bus, bus - (data.time % bus)])).sort((a, b) => a[1] - b[1])[0]))




const startTime = data.time
const nearestTimes = data.buses.filter(x => x).map(bus => ([bus, bus - (startTime % bus)]))

const best = nearestTimes.sort((a, b) => a[1] - b[1])[0]

// console.log(nearestTimes.sort((a, b) => a[1] - b[1]))
// console.log(best[0] * best[1])

// const fs = require('fs');
// const data = (([time, buses]) => ({time: parseInt(time), buses: buses.split(',').map(bus => parseInt(bus) || null)}))(fs.readFileSync('input.txt').toString().trim().split('\n'))
// console.log((([time, bus]) => time * bus)(data.buses.filter(x => x).map(bus => ([bus, bus - (data.time % bus)])).sort((a, b) => a[1] - b[1])[0]))

const calculateMultiple = (size, base) => { 
	const array = new Array(size)
	let itr = 0
	for (let i = 0; i < size; ++i) {
		array[itr] = i
		itr = (itr + base) % size
	}
	return array
}

const calculateCycles = (size, base) => { 
	const array = new Array(size)
	let itr = 0
	let value = 0
	for (let i = 0; i < size; ++i) {
		value = itr + base >= size ? value + 1 : value
		array[itr] = value
		itr = (itr + base) % size
	}
	return array
}

const multi_19_for_17 = calculateMultiple(19, 17)
const cycles_19_for_17 = calculateCycles(19, 17)

const createComparisionTable = (size, base) => { 
	multi = calculateMultiple(size, base)
	cycles = calculateCycles(size, base)
	const array = multi.map((m, i) => ([i, m, cycles[i]]))
	return array

}

// 17, x, 13, 19
const ct_13 = createComparisionTable(17, 13)
const ct_19 = createComparisionTable(17, 19)

function* genNext(size, base, tab, offset) {

	// let val = 0
	let n = 0
	// console.log("S:", offset, tab)
	let p = tab.find(([i, v, c]) => i == offset % size)[1]
	// console.log(`${base} * ${size} * n + ${base} * ${p} - ${offset}`)
	console.log(`${base * size} * n + ${base * p - offset} | ${offset}`)
	while(true) {
		yield BigInt(base * size * n + base * p)
		++n
	}
}

// const gen13 = genNext(17, 13, ct_13, 2)

// console.log(gen13.next().value)
// console.log(gen13.next().value)
// console.log(gen13.next().value)

// const gen19 = genNext(17, 19, ct_19, 3)

// console.log(gen19.next().value)
// console.log(gen19.next().value)
// console.log(gen19.next().value)

function indexOfMin(arr) {
    var min = arr[0];
    var minIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

const dat = [17, null, 13, 19]
// const dat = [1789,37,47,1889]

const solve = (dat) => { 
	const size = dat[0]
	const offsets = dat.slice(1, dat.length).map((num, i) => num ? BigInt(i + 1) : null).filter(x => x)
	let values = offsets.map(x => 0n)
	const gens = dat.slice(1, dat.length).map((num, i) => num ? genNext(size, num, createComparisionTable(size, num), i + 1) : null).filter(x => x)

	console.log(offsets)

	const check = () => {
		const baseValue = values[0] - offsets[0]
		let i = 0
		for (val of values) {
			if (val - offsets[i] !== baseValue) {
				// console.log("----", val, i, baseValue)
				return false
			}
			++i
		}
		return true
	}

	// console.log(values)
	let minIdx = 0
	// for(let i = 0; i < 12; ++i) {
	let testi = 0
	while(true) {
		min = indexOfMin(values)
		values[min] = gens[min].next().value
		// console.log(min, values)
		if (check()) break
		++testi
		if (testi > 10000000) {
			testi = 0
			console.log(values)
		}
	}

	console.log(values)
	console.log(values[0] - offsets[0])

}

// console.log(data.buses)
// solve(data.buses)
// solve(dat)

// solve([17,null,13,19]) //3417

// solve([67,7,59,61]) //754018
// offset a = 2
// 221 * a + 102 = 323 * b + 187

// solve([67,null,7,59,61]) //779210
// offset a = 

// solve([67,7,null,59,61]) //1261476
// offset a = 

// solve([1789,37,47,1889]) //1202161486
// offset a = 

// solve([7,13,null,null,59,null,31,19]) //1068781
// offset a = 



// 67,7,59,61
// 7 -> 1
// 59 -> 2
// 61 -> 3

// console.log(createComparisionTable(67, 7))
// console.log(createComparisionTable(67, 59))
// console.log(createComparisionTable(67, 61))

// 5 44 30

// 5 11 2 2 5 2 3

// console.log(multi_19_for_17.join())
// console.log(cycles_19_for_17.join())


// const calculateCycles()

// 2 x 17 x 67 x 331
// 11254 x 67

// t % 67 == 0
// (t + 1) % 7 == 0 =>   t = (7*a - 1)    = 7*48*n - 1
// (t + 2) % 59 == 0 =>  t = (59*b - 2)   = 59*50*n - 2
// (t + 3) % 61 == 0 =>  t = (61*c - 3)   = 61*33*n - 3

// t % 7 == 6



// 
 

// for: 17,x,13,19 

// console.log(createComparisionTable(19, 13).join('|'))
// console.log(createComparisionTable(19, 17).join('|'))

//3419 / 13 = 263

// answer: t = 3420
// t % 19 == 0
// (t - 1) % 13 == 0 =>  
// (t - 3) % 17 == 0 =>  

// t - 1 = 13*(13*10*2 + 3)

// 8
// 10


// 17 * n0 + 17 * 0
// 13 * 17 * n1 + 13 * 8
// 19 * 17 * n2 + 19 * 10

// 247 * 17 + 13 * 8
// 247 * 17 + 19 * 10


// 3419 - 13 * 8  = 3315 => n1 = 15
// 3420 - 19 * 10 = 3230 => n2 = 10


// 201 = 67 * 3


// 3419 - 104 = 3315 / 15 => 221
// 3420 - 190 = 3230 / 10 => 323


// t = 13*17*a+13*8-2
// t = 19*17*b+19*10-3

// t = 221a + 102
// t = 323b + 187

// 17,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,13,19,x,x,x,23,x,x,x,x,x,x,x,787,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29



// 13 * 17 * n1 + 13 * 8
// 19 * 17 * n2 + 19 * 10

const a = 1184082076794n //2509001566513 n

const t = 697n * a + 34n
console.log("t=", t) //825305207525452

// 697 * a + 34 = 8891 * b + -17 = 221 * c + 17 = 323 * d + -17 = 391 * e + -17 = 13379 * f + 10183 = 629 * g + -17 = 493 * h + 68


// t = 41 * 17 * a + 41 * 1 - 7
// t = 523 * 17 * b + 523 * 0 - 17
// t = 13 * 17 * c + 13 * 4 - 35
// t = 19 * 17 * d + 19 * 1 - 36
// t = 23 * 17 * e + 23 * 1 - 40
// t = 787 * 17 * f + 787 * 13 - 48
// t = 37 * 17 * g + 37 * 1 - 5
// t = 29 * 17 * h + 29 * 5 - 77

// t = 697 * a + 34
// t = 8891 * b + -17
// t = 221 * c + 17
// t = 323 * d + -17
// t = 391 * e + -17
// t = 13379 f n + 10183
// t = 629 * g + -17
// t = 493 * h + 68