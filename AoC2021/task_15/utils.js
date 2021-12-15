// Utils
const range = size => ([...Array(size).keys()])
Array.prototype.do = function(fun) { return fun(this) }
const incrementCounter = (counter, key, value = 1) => (counter[key] ? counter[key] += value : counter[key] = value, counter)
const hash = (x, y) => y * 100000 + x
const dehash = hash => [hash % 100000, Math.floor(hash / 100000)]

Math.max = arr => {
	let maxVal = +arr[0]
	for (let i = 0; i < arr.length; ++i) {
		const val = +arr[i]
		if (maxVal < val) maxVal = val
	}
	return maxVal
}

export {
	range, incrementCounter, hash, dehash
}