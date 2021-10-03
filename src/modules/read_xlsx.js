module.exports = function readXlsx(file) {

            const XLSX = require('xlsx')

            const workbook = XLSX.readFile(file, {type:'binary',cellText:false,cellDates:true});
            const sheet_name_list = workbook.SheetNames;

            let tabel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
                dateNF:'dd-mm-yyyy',
                cellDates: true,
                raw:   false,
                defval: ""
            })

            tabel = tabel.slice(7)
            tabel.pop()

            tabel = tabel.filter(element => Object.keys(element).length > 5)

            let result = []
            let currentIndex = null

            tabel.forEach(element => {

                if (element.__EMPTY != '') {
                    currentIndex = element.__EMPTY
                }

                if (!Array.isArray(result[currentIndex])) {
                    result[currentIndex] = []
                }

                let row = Object.values(element);
            
                if (result[currentIndex].length>0) {

                    row[0] = result[currentIndex][0][0]
                    row[1] = result[currentIndex][0][1]
                }

                console.log(typeof element)
                result[currentIndex].push(row)

            })
            
            return Object.values(result)        
}