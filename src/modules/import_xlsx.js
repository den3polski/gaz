module.exports = (file) => {

    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(file, {type:'binary',cellText:false,cellDates:true});
    const sheet_name_list = workbook.SheetNames;

    let tabelFromExel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
        dateNF: 'D-M-YYYY',
        raw:   false,
        defval: ""
    })


    tabel = []

    tabelFromExel.forEach(tr => {    
        let row = Object.values(tr).slice(0, 51)

        console.log(row[0])
        if (/\d{1,2}\-\d{1,2}\-\d{4}/.test(row[0])) {
            tabel.push(row)
        }
    })
    

    let currentWellNumber = ''

    tabel.forEach((row, index) => {

        if (row[2]  != '' ) {

            let splited = row[2].split(' ')
            currentWellNumber = splited[2]
        } 

        tabel[index][2] = currentWellNumber
    
    })


    let result = {}

    tabel.forEach((row, index) => {

        if (!result[row[0]]) {
            result[row[0]] = []
        }
        
        result[row[0]] = [...result[row[0]], row]
    })

    return result 


}

