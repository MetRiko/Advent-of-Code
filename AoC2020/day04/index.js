const fs = require('fs');
const { parse } = require('path');

// const rawdata = fs.readFileSync('input.txt').toString().split('\n')
// rawdata.pop()

// 2-7 p: pbhhzpmppb

// const data = rawdata.map(str => str.split(/[- :]+/g).map((v,i) => i < 2 ? parseInt(v) : v))

const data = fs.readFileSync('input.txt').toString().trim().split('\n\n').map(card => card.split(/[ \n]/g))
const cards = data.map(rawCard => rawCard.reduce((card, field) => {[name, value] = field.split(':'); return {...card, [name]: value}}, {}))

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const isFourDigitNumber = (str) => /^\d{4}$/.test(str)
const isNineDigitNumber = (str) => /^\d{9}$/.test(str)
const isBetween = (val, from, to) => val >= from && val <= to

const validators = {
	byr: (byr) => isFourDigitNumber(byr) && isBetween(parseInt(byr), 1920, 2002),
	iyr: (iyr) => isFourDigitNumber(iyr) && isBetween(parseInt(iyr), 2010, 2020),
	eyr: (eyr) => isFourDigitNumber(eyr) && isBetween(parseInt(eyr), 2020, 2030),
	hgt: (hgt) => {
		const [_, value, suffix] = hgt.match(/^(\d+)([a-z]+)$/) || []
	
		if (value && suffix) {
			switch(suffix) {
				case 'cm': return isBetween(parseInt(value), 150, 193) 
				case 'in': return isBetween(parseInt(value), 59, 76) 
			}
		}
		return false
	},
	hcl: (hcl) => /^#[0-9a-f]{6}$/.test(hcl),
	ecl: (ecl) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].some(color => ecl === color),
	pid: (pid) => isNineDigitNumber(pid)
}

const isValid = (card) => requiredFields.every(fieldName => card.hasOwnProperty(fieldName) && validators[fieldName](card[fieldName]))

// for (const card of cards) {
// 	console.log(card)
// 	console.log(isValid(card))
// }

console.log(cards.filter(card => isValid(card)).length)

// const isValid = (card) => requiredFields.every(fieldName => {

// 	if (!card.hasOwnProperty('byr')) return false
		
// 	return true

// 	return card.hasOwnProperty(fieldName)
// })

// const count = cards.map(isValid).filter(bool => bool).length

// console.log(count)
// console.log(cards.map(isValid))

// console.log(data.filter((_,i) => i < 10))
// console.log(cards.filter((_,i) => i < 10))
