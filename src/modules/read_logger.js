module.exports = (file) => {

    let fs = require('fs')
    const formatDate = require('./format_date.js')

    let lines = fs.readFileSync(file).toString().split("\n")
    lines = lines.slice(5, lines.length - 4)

    let dataTabel = []

    for (let i=0; i < lines.length; i += 3) {

        row1 = lines[i].trim().split('\t')
        row2 = lines[i+1].trim().split('\t')

        let values = row2.slice(3)
        values = values.map(value => parseFloat(value.replace(',','.')))
        
        console.log(values)


        
        const [d, m, y] = row1[1].split('.')
        let date = new Date(y, m , d)
        date = formatDate(date)

        dataTabel.push({
            numMetering: row1[0],
            numBraid: row1[2].match(/\[ (\d+) \]/)[1],
            date,
            time: row2[0],
            values,
            well: null,
            depth: '',
            heightTotal: '',
            heightAboveGround: ''
        })
    }

    return dataTabel
}