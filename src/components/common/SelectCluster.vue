<template>
        
        <v-autocomplete
           class="mt-5"
          :items="wells"
          label="Объект"
        ></v-autocomplete>    

</template>


<script>

 const ipcRenderer = window.require("electron").ipcRenderer

export default {


    props: ['value'],


    data: () => ({
        wells: []
    }),

    mounted() {
            
            const wells = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Cluster'})
            this.wells = wells.map(item => {
                return {text: item.number, value: item.id}
            })

            console.log(this.wells)
            console.log(1)
    }

}
</script>


   