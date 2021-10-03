
const {ipcMain} = require("electron")
const {getConnection, createQueryBuilder} = require("typeorm")
require('./db.connection')
const readLogger = require('./modules/read_logger.js')
const readXlsx = require('./modules/import_xlsx.js')
const formatDate = require('./modules/format_date.js')


ipcMain.on('getEntities', async (event, args) => {
 
  let result = await getEntities(args.typeOfEntity, args.filter)
  event.returnValue = result
})

ipcMain.on('addEntity', async (event, arg) => {
  console.log(arg) 
  const newEntity = await addEntity(arg.typeOfEntity, arg.entity)
  event.returnValue = newEntity.id

})

ipcMain.on('addBill', async (event, data) => {
  console.log(data) 
  const newBill = await addBill(data)
  event.returnValue = newBill.id

})

ipcMain.on('updateEntity', async (event, arg) => {
  console.log(arg) 
  const result = await updateEntity(arg.typeOfEntity, arg.entity)
  event.returnValue = result
})

ipcMain.on('deleteEntity', async (event, arg) => {
    
    const result = await deleteEntity(arg.typeOfEntity, arg.id)
    console.log(arg) 
    console.log(result) 
    event.returnValue = result  
  })
  

  ipcMain.on('makeReport', async (event, arg) => {
    
      const result = await makeReport(arg.id)    
      event.returnValue = result  
  })


ipcMain.on('readLogger', async (event, filename) => {
    
  const tabels = readLogger(filename) 
  event.returnValue = tabels  
})

ipcMain.on('readXlsx', async (event, filename) => {
    
  const tabel = readXlsx(filename) 
  event.returnValue = tabel  
})

ipcMain.on('importData', async (event, arg) => {
    
  const result = await importData(arg) 
  event.returnValue = result  
})

ipcMain.on('getStatistic', async (event, arg) => {
    
  const statistiс = await getStatistic() 
  event.returnValue = statistiс  
})

ipcMain.on('saveReport', async (event, arg) => {
    
  const result = await saveReport(arg) 
  event.returnValue = result  
})


async function saveReport(data) {

    console.log(data)

    const path = data.path

    const XLSX = require('xlsx-js-style')


    const workbook = XLSX.utils.book_new();

    let merges = []
    let start = 0
    let end = -1
    let current = data.items[0].well.title

    data.items.forEach((item,index) => {

        if (item.well.title == current && index != data.items.length - 1) {

          end++

        } else {

          if (index == data.items.length - 1) {
            end++
          }

          merges.push({ s: { r: start+1, c: 2 }, e: { r: end + 1, c: 2 } })
          current = item.well.title
          start = index
          end = index 
        }
        
    })


    function getAvg(jsonValues) {
    
      let arr = JSON.parse(jsonValues)

      if (!Array.isArray(arr)) arr = []

      arr = arr.filter(value => parseFloat(value) == value).map(value => parseFloat(value))

      console.log(arr)

      const sum = arr.reduce((sum, current)=> sum += current, 0)

      if (arr.length > 0) {
        
        const avg = sum / arr.length
        return Math.round( avg * 100) / 100

      } else {

         return '-'
      }
   
  }


  function getArrayValues(jsonValues) {
    
    let arr = JSON.parse(jsonValues)
    
    if (!Array.isArray(arr)) arr = []

    let addToEndCount = 20 - arr.length

    for (let i = 0; i < addToEndCount; i++) {
      arr.push('-')
    }

    let result = {}

    arr.forEach((value, index) => result["m" + index] = value ? value.toString().replace('.',',') : '-')

    return result

  }


  data = data.items.map(item => ({

          date: item.date,
          temperature: item.temperature,
          title: item.title,
          depth: item.depth,
          depthProject: item.depthProject,
          ...getArrayValues(item.values),
          avg: getAvg(item.values),
          comment: item.comment,
          temperatureProject: item.temperatureProject,
          sms: item.sms,       

          
    }))

    var ws_name = "SheetJS";

  
    var ws = XLSX.utils.json_to_sheet(data);
    

    XLSX.utils.book_append_sheet(workbook, ws, ws_name);


    for (const [key, value] of Object.entries(ws)) {
     
      if (key !== '!ref') {
         
        ws[key]['s'] = {alignment: {vertical: 'center', horizontal: 'center'}}
      }

    }

    console.log(merges)


    ws["!merges"] = merges

    XLSX.writeFile(workbook, path);

}



async function importData(data)  {


  const wellRepository = getConnection().getRepository('Well')
  const billRepository = getConnection().getRepository('Bill')
  const measurementRepository = getConnection().getRepository('Measurement')


  for (const[key, billTabel] of Object.entries(data.tabel)) {

      const billFields = {

          date: key,
          cluster: data.cluster,
          comment: '',
          temperature: billTabel[0][1]
      }

      const bill = await billRepository.save(billFields)
          
      for (let row of billTabel) {

          const wellName = row[2]

          let well = await wellRepository.findOne({where:{title:wellName, cluster: data.cluster}})

           if (!well) {
            
            well = await wellRepository.save({

              cluster: data.cluster,
              title: wellName,   
              text: '',
              depthProject: row[4],
              temperatureProject: row[30],
              sms: row[31],
              useGroundPrinciple:  row[29],

            })
          }


          console.log(well)

          let values = row.slice(5, 20)                    
          values = values.map(value => parseFloat(value.replace(',','.')))
          values =  JSON.stringify(values)
          


          const [d, m, y] = row[0].split('-')

          let date = new Date(y, m - 1 , d)

          date = formatDate(date)

     
          const newRow = {

            bill,
            well,
            values,
            date,
            
            depth: row[3],
            comment: row[28],         
            heightTotal: row[35],
            heightAboveGround:  row[36],

          }

       
          const newMeasurement = await measurementRepository.save(newRow)

      }

  }



  return data

}


async function getStatistic()  {

  const countWells = await getConnection().getRepository('Well').count()
  
  const countClusters = await getConnection().getRepository('Cluster').count()
  
  let result = {countWells, countClusters}

  return result

}

async function getEntities(typeOfEntity, filter = []) {
   
        const repository = getConnection().getRepository(typeOfEntity)
        let entities = []
        if (filter.length == 0 || filter.cluster === null) {

          entities = await repository.find()
        
        } else {

          entities = await repository.find({cluster: filter.cluster})
        }
           
        return entities 
}

async function addEntity(typeOfEntity, addedEntity) {

    const repository = getConnection().getRepository(typeOfEntity)
  
    const newEntity = await repository.save(addedEntity)

    return newEntity

}

async function updateEntity(typeOfEntity, updatedFields) {

  const repository = getConnection().getRepository(typeOfEntity)

  const savedFileds = {
      'number': updatedFields.number
  }

  let entity = await repository.findOne(updatedFields.id)


  for (field in updatedFields) {
    entity[field] = updatedFields[field]
  }

  console.log(entity)
  
  const result = await repository.save(entity)

  return result

}



async function deleteEntity(typeOfEntity, id) {

    try {
        
        const repository = getConnection().getRepository(typeOfEntity)
        const entity = await repository.delete(id)
        return true

    } catch(error) {

        console.log(error)
        return false
    }
}




async function addBill(data) {

  const billRepository = getConnection().getRepository('Bill')

  /*
  let newBill = {

      date: '',
      comment: '',
      cluster: data.cluster
  }
*/

  const bill = await billRepository.save(data.bill)

  data.tabel.forEach(async (row) => {

          const measurementRepository = getConnection().getRepository('Measurement')
          row.bill = bill
          const newMeasurement = await measurementRepository.save(row)
  })

  return bill

}



async function makeReport(clusterId) {
  
  console.log(clusterId)

  //const repository = getConnection().getRepository('Measurement')

  //const items = await repository.find()  

  let items = await createQueryBuilder("Measurement")
      .leftJoinAndSelect("Measurement.well", "well")
      .leftJoinAndSelect("Measurement.bill", "bill")
      .where("well.clusterId = :id", { id: clusterId })
      .orderBy("well.title")
      .addOrderBy("Measurement.date")
      .getMany()

  console.log(items)

  items = items.map(row => ({

        temperature: row.bill.temperature,       
        title: row.well.title,
        depthProject: row.well.depthProject,
        temperatureProject: row.well.temperatureProject,
        sms: row.well.sms,
        useGroundPrinciple: row.well.useGroundPrinciple,

        ...row
    }))

  return items 
}
