<template>
    
    <div>
        
        <div class="d-flex flex-row filter-panel">


                <v-autocomplete
                    class="mr-1"
                    :items="clusters"
                    label="Объект"
                    item-text='number'
                    item-value='id'
                    return-object
                    v-model='cluster'
                ></v-autocomplete>   


                
                <v-autocomplete
                    class=""
                    :items="reports"
                    label="Приложение"
                    item-text='name'
                    item-value='id'
                    return-object
                    v-model='report'
                ></v-autocomplete>   


                <v-btn color="primary" dark class="mt-3 mb-2 ml-4" @click="makeReport">
                    Сформировать
                </v-btn>
                
                
                
                <v-btn color="primary" dark class="mt-3 mb-2 ml-4" @click="saveReport">
                    Сохранить в Exel
                </v-btn>


            </div>
         

            <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="200"
                class="elevation-1"
            ></v-data-table>

   {{items}}
    </div>

</template>


<script>

const ipcRenderer = window.require("electron").ipcRenderer
const {dialog} = window.require('electron').remote;


export default {

data: () => ({

    clusters: [],
    reports: [],

    headers: [
         { text: 'id', value: 'id' },
         { text: 'date', value: 'date' },
         { text: 'temperature', value: 'temperature' },         
         { text: 'скважина', value: 'title' },
         { text: 'depth', value: 'depth' },
         { text: 'depthProject', value: 'depthProject' },              
         { text: 'values', value: 'values' },
         { text: 'comment', value: 'comment' },               
    ],
    cluster: null,
    report: null,
    items: []
}),

mounted() {
 
    this.clusters = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Cluster'})
    this.reports = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Report'})
},

methods: {

    makeReport() {

       this.items =  ipcRenderer.sendSync('makeReport', this.cluster)

    },


   async saveReport() {

            
        var options = {
            title: "Сохранить отчет как...",
            filters: [
                {name: 'Exel', extensions: ['xlsx']}
            ]
        }

        let saveTo =  await dialog.showSaveDialog(null, options);

        console.log(saveTo.filePath);
        const result  = ipcRenderer.sendSync('saveReport', {items: this.items, path: saveTo.filePath})
        console.log(result)

    }


}

}

</script>


<style>
.filter-panel  div {
    max-width: 250px;
}
</style>


