const fs = require('fs');
const Set = require('collections/set')

const testData = `
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)
`.trim()

const inputData = fs.readFileSync('input.txt').toString().trim() //^(\w+\s[^(])*(\w+)

const data = inputData.split('\n').map(line =>
	// const data = testData.split('\n').map(line =>
	(([ingrs, allers]) => [ingrs.split(' '), allers.split(', ')])([...line.matchAll(/^[\w+\s]+\b|(?<=contains )[\w\s,]+/g)].map(g => g[0]))
)


const generateList = data => data.reduce((list, [ingrs, allers], foodIdx) => {

	ingrs.forEach(ingr => {
		const current = list[ingr] || { possibleAllers: new Set(), occurence: new Array(data.length).fill(false) }

		current.possibleAllers = current.possibleAllers.union(allers)
		current.occurence[foodIdx] = true
		current.occurenceAmount = current.occurenceAmount + 1 || 1

		list[ingr] = current
	})

	return list

}, {})

const countAllersFromList = list => Object.values(list).map(o => [...o.possibleAllers]).flat().reduce((obj, aller) => {
	obj[aller] = obj?.[aller] + 1 || 1
	return obj
}, {})

const allIngrs = [...new Set(data.map(([ingrs, _]) => ingrs).flat())]
const allAllers = [...new Set(data.map(([_, allers]) => allers).flat())]

const possibleAllers = allIngrs.map(_ => [])//ingr => [...allAllers])

const foods = data.map(([ingrs, allers]) => ({
	ingrs: allIngrs.map(ingr => ingrs.has(ingr)),
	allersList: allers
}))

for (let aller of allAllers) {

	const foodsWithAller = foods.filter(({ allersList }) => allersList.has(aller)).map(({ ingrs }) => ingrs)

	// console.log(aller)
	// console.log(foodsWithAller)

	const ingrsWithAller = foodsWithAller.reduce((result, food) => result.map((r, i) => r && food[i]), new Array(allIngrs.length).fill(true))

	// console.log(andOpResult)

	ingrsWithAller.map((bool, idx) => bool ? idx : null).filter(x => x !== null).forEach(ingrIdx => {
		possibleAllers[ingrIdx].push(aller)
	})

}

const ingrsWithoutAller = possibleAllers.map((allers, ingrIdx) => allers.length === 0 ? ingrIdx : null).filter(x => x !== null).map(ingrIdx => allIngrs[ingrIdx])
// console.log(ingrsWithoutAller)

const ingrsWithAller = allIngrs.filter(ingr => !ingrsWithoutAller.has(ingr))
console.log(ingrsWithAller)

const countIngrsWithoutAller = data.map(([ingrs, allers]) => ingrs).flat().reduce((count, ingr) => ingrsWithoutAller.has(ingr) ? count + 1 : count, 0)
// console.log(countIngrsWithoutAller)

console.log("Part 1 - countIngrsWithoutAller:", countIngrsWithoutAller)


let allersLeft = [...possibleAllers]
// console.log(allersLeft)

const completeIngrsListWithAllers = []
while (true) {

	let allerToRemove = null
	for (let i = 0; i < allersLeft.length; ++i) {
		const allers = allersLeft[i]
		if (allers.length === 1) {
			allerToRemove = allers[0]
			const ingr = allIngrs[i]
			completeIngrsListWithAllers.push([ingr, allerToRemove])
			break
		}
	}
	if (allerToRemove !== null) {
		allersLeft = allersLeft.map(allers => allers.filter(aller => aller !== allerToRemove))
	}
	else {
		break
	}

	// console.log(allersLeft.filter(allers => allers.length > 0).join(' '))

}

console.log(completeIngrsListWithAllers)

const sortedIngrsWithAller = completeIngrsListWithAllers.sort(([_, aller1], [__, aller2]) => aller1.localeCompare(aller2)).map(([ingr, _]) => ingr).join(',')

console.log("Part 2 - sortedIngrsWithAller:", sortedIngrsWithAller)

// const list = generateList(data)
// const allersAmount = countAllersFromList(list)

// const noAllersList = Object.entries(list).reduce((list, [ingrName, { possibleAllers, occurenceAmount }]) => {
	// 	const canBeAller = allAllers.every(aller => allersAmount[aller] > occurenceAmount)
	// 	if (canBeAller == true) list.push(ingrName)
	// 	return list
	// }, [])

	// const reducedData = data.map(([ingrs, allers]) => [ingrs.filter(ingr => !noAllersList.has(ingr)), allers])
	// const reducedList = generateList(reducedData)
	// const reducedAllersAmount = countAllersFromList(reducedList)

	// const finalNoAllersList = [...noAllersList, ...noAllersList2]

	// console.log(data)
	// console.log(list)
	// console.log(allersAmount)
	// console.log("All allers:", allAllers)
	// console.log(noAllersList)
	// console.log(reducedData)
	// console.log(finalNoAllersList)

	// const noAllersCount = data.map(([ingrs, _]) => ingrs).flat().filter(ingr => finalNoAllersList.has(ingr)).length

	// console.log(noAllersCount)

	// const sliceDataToRemove = reducedData.filter(([ingrs, allers]) => ingrs.length === allers.length)

	// console.log(sliceDataToRemove)

