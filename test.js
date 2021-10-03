// const str = '["11,24","7,49","3,29","1,34","0,45","0,14","0,01","-0,08","0,01","-0,04","-0,04","0","0,05","0,01","-0,06"]'


// //arr = arr.filter(value => parseInt(value) === value).map((value,index) => ({["m" + index] : value}))


// function getArrayValues(jsonValues) {
    
//     let arr = JSON.parse(str)

//     let result = {}

//     arr.forEach((value,index) => result["m" + index] = value)

//     return result

// }


// function getAvg(jsonValues) {
    
//     const arr = JSON.parse(jsonValues).filter(value => parseFloat(value) == value).map(value => parseFloat(value))

//     const sum = arr.reduce((sum, current)=> sum += current, 0)

//     return Math.round( (sum / arr.length) * 100) / 100

// }

// let arr = JSON.parse(str)
// values = arr.map(value => value.replace(',','.'))




// //console.log(getArrayValues(str))

// console.log(values)
  
value = 5.5 

let r = value ? value.toString().replace('.',',') : '-'

console.log(r)




const [d, m, y] = '15-8-2021'.split('-')

const date = new Date(y, m - 1 , d)

console.log(date.toISOString())