<template>
    
    <div>

        <v-btn color="primary" dark class="mb-2" @click="dialog">
                Открыть файл Exel
        </v-btn>
        
        <v-btn color="primary" dark class="mb-2 ml-4" @click="importData" >
            Импорт
        </v-btn>


            <v-autocomplete
                class="well-field"
                :items="clusters"
                label="Объект"
                item-text='number'
                item-value='id'
                return-object
                v-model='cluster'
            ></v-autocomplete>   




    <div>


        <div v-for="(tabel, t) in tabels" :key="t" >

                             {{t}}
                 <v-simple-table>
           
                 
                    <tbody>
                       <tr v-for="(row, i) in tabel" :key="i" >

                            <td>{{row[0]}}</td>
                            <td>{{row[1]}}</td>
                            

                        </tr>
                    </tbody>
                  
               </v-simple-table>

        </div>
         
                  {{tabels}}
          

    </div>
    



 
    </div>

</template>


<script>

const {dialog} = window.require('electron').remote;
const ipcRenderer = window.require("electron").ipcRenderer


export default {

data: () => ({

    tabels: [],
    clusters: [],
    wells: [],    
    selectedWells: [],
    showDataSelect: false,
    cluster: null,

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
  
},

watch: {

   
},




computed: {



},

methods: {

 

   

    importData() {

        let data = {}

       data.cluster = this.cluster
       data.tabel = this.tabels

       ipcRenderer.sendSync('importData', data)

    },


    dialog() {

        dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: 'Файл логгера', extensions: ['xlsx'] }],
                }).then(result => {
                
                console.log(result.canceled)
                console.log(result.filePaths[0])


                this.tabels = ipcRenderer.sendSync('readXlsx', result.filePaths[0])
              
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
        max-width: 150px;
    }    

   .panel .temperature-field { max-width: 100px;}
   .panel .comment-field { max-width: 100%;}
   .panel .well-field { max-width: 250px;}
        
    .panel div { 
        
         margin-right: 10px;
        }



</style>





