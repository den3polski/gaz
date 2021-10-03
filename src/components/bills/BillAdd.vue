<template>
    
    <div>

        <v-btn color="primary" dark class="mb-2" @click="dialog" :disabled="!bill.cluster || tabels.length > 0">
            Добавить из Логгера
        </v-btn>
        
        <v-btn color="primary" dark class="mb-2 ml-4" @click="save" :disabled="tabels.length==0">
            Сохранить
        </v-btn>

        <v-btn color="primary" dark class="mb-2 ml-4" @click="check" :disabled="tabels.length==0">
            Проверить
        </v-btn>
 


        <div class="d-flex flex-row panel">

            <v-autocomplete
                class="well-field"
                :items="clusters"
                label="Объект"
                item-text='number'
                item-value='id'
                return-object
                :disabled="!selectClusterStatus"
                v-model='bill.cluster'
            ></v-autocomplete>   


            <v-menu
                    v-model="showDataSelect"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
              
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        class="date-field"
                        v-model="bill.date"
                        label="Дата"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    v-model="bill.date"
                    @input="showDataSelect = false"
                    ></v-date-picker>
            </v-menu>


            <v-text-field v-model="bill.temperature" label="Температура" class="temperature-field"></v-text-field>
            <v-text-field v-model="bill.heightConductor" label="Высота кондуктора" class="temperature-field"></v-text-field>
            <v-text-field v-model="bill.heightTape" label="Неучтенная высота рулетки" class="temperature-field"></v-text-field>

        </div>

        <div>
            <v-text-field v-model="bill.comment" label="Комментарий" class="comment-field"></v-text-field>
        </div>


      
    
                  


    <div>

                             
                 <v-simple-table>
           
                 
                    <tbody>
                       <tr v-for="(row) in tabels" :key="row.numMetering" >



                             <td>
                                 <div v-if="row.numMetering">
                                    {{row.numMetering}}
                                 </div>
                                <v-chip v-else color="orange">
                                    нет в логгере
                                </v-chip>

                                <div>
                                    {{row.numBraid}}
                                </div>
                             </td>    
                                                      
                             <td class="date-time-cell">
                                 <div>{{row.date}}</div>
                                 <div>{{row.time}}</div>

                             </td>
                            

                            
                            <td>
                                <v-autocomplete clearable
                                    class="mt-5"
                                    :items="availableWellsWithSelf(row.well)"
                                    v-model="row.well"                                    
                                    label="Скважина"
                                    item-text='title'
                                    item-value='id'
                                    return-object                   
                                ></v-autocomplete>   
                            </td>
                             
                             <td>
                                   <v-text-field :value="row.heightTotal" @change="value => row.heightTotal = value">
                                  </v-text-field>                                                                                                        
                             </td>

                             <td>
                                  <v-text-field :value="row.heightAboveGround" @change="value => row.heightAboveGround = value">
                                  </v-text-field>
                             </td>

                            <td>
                                 <v-text-field :value="row.comment" @change="value => row.comment = value"></v-text-field>
                            </td>


                            <td>{{filterValues(row.values, row.well)}}</td>
                            
                      

                        </tr>
                    </tbody>
                  
               </v-simple-table>


         
                  
          

    </div>
    



 
    </div>

</template>


<script>

const {dialog} = window.require('electron').remote;
const ipcRenderer = window.require("electron").ipcRenderer


export default {

data: () => ({

    selectClusterStatus: true,

    tabels: [],
    clusters: [],
    wells: [],    
    selectedWells: [],
    showDataSelect: false,

    bill: {
        date: '',
        temperature: '',
        heightConductor: '',
        heightTape: '',
        comment: '',
        cluster: null,
    }
    
}),

mounted() {
 
    this.clusters = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Cluster'})
    this.wells = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Well'})

},

watch: {

     bill: {
          
            handler() {
                this.wells = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Well', filter: {cluster: this.bill.cluster}})     
                console.log(this.bill.cluster)        
                this.selectClusterStatus = false  
            },

            deep: true
      }
},




computed: {


    availableWells() {

            console.log('availableWells')
            return this.wells.filter(a => !this.tabels.find(b => b.well == a) )            
    },



},

methods: {


    filterValues(values, well) {

        if (well && well.depthProject) {
            
            const max = Math.floor(well.depthProject)
            
            return values.slice(0, max)
            
        } else {

            return values
        }

    },

    availableWellsWithSelf(self) {

            return self ?  [self, ...this.availableWells] :  this.availableWells
    },

    check() {
                 
            const notSelectedWells = this.availableWells.map(
                well => ({
                    well: well,
                    depth: 0,
                    numMetering: "",                                      
                    time: "",
                    numBraid: "",
                    heightTotal: "",
                    heightAboveGround: "",
                    values: "",
                    date: "",
                    comment: "",
                })
            )
            
            this.tabels = [...notSelectedWells, ...this.tabels]
        
    },

    save() {

        let data = {}

        data.tabel = []

    
        this.tabels.forEach(row => {

                let measurement = {...row}

                measurement.values = JSON.stringify(row.values)
                
                data.tabel.push(measurement)
        })
     

       data.bill = this.bill

       console.log(data)
       
       const result = ipcRenderer.sendSync('addBill', data)

       console.log(result)
   
    },


    dialog() {

        dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'Файл логгера', extensions: ['vpn'] }],
                }).then(result => {
                
                console.log(result.canceled)
                console.log(result.filePaths[0])


                this.tabels = ipcRenderer.sendSync('readLogger', result.filePaths[0])
              
                }).catch(err => {
                console.log(err)
                })

    }
}

}


</script>


<style>
    .row-data {
        margin-bottom: 20px;
        margin-top: 20px;
        border: 1px solid white;
    }

  .panel   .date-field {
        max-width: 180px;
    }    

    .date-time-cell {
        min-width: 120px;
    }

   .panel .temperature-field { max-width: 100px;}
   .panel .comment-field { max-width: 100%;}
   .panel .well-field { max-width: 250px;}
        
    .panel div { 
        
         margin-right: 10px;
    }



</style>





