<template>
    <div>

      

        <v-data-table
            :headers="headers"
            :items="items"
            sort-by="calories"
            class="elevation-1"
        >
            <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>Ведомости</v-toolbar-title>
                <v-divider
                class="mx-4"
                inset
                vertical
                ></v-divider>
            

                 <v-autocomplete clearable
                    class="mt-5"
                    :items="clusters"
                    v-model="filter.cluster"
                    item-text='number'
                    item-value='id'
                    return-object
                    label="Объект"
                    ></v-autocomplete>  

                <v-spacer></v-spacer>


                <v-dialog
                v-model="dialog"
                max-width="600px"
                >
                <template v-slot:activator="{ on, attrs }">

                    <router-link to="/bills/add">
                        <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >
                        Добавить новую
                        </v-btn>

                    </router-link>

                </template>
                <v-card>
                    <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                    <v-container>
                        <v-row>
                        
            
                        <v-col
                            cols="12"
                            sm="12"
                            md="12"
                        >

                            
                            <v-autocomplete
                                class="mt-5"
                                :items="wells"
                                label="Объект"
                                item-text='number'
                                item-value='id'
                                return-object
                                v-model="editedItem.cluster"
                            ></v-autocomplete>    

                            <v-text-field
                            v-model="editedItem.title"
                            label="title"
                            ></v-text-field>


                            <v-text-field
                            v-model="editedItem.text"
                            label="text"
                            ></v-text-field>


                        <v-text-field
                            v-model="editedItem.depthProject"
                            label="Проектная глубина"
                            ></v-text-field>


                            <v-text-field
                            v-model="editedItem.temperatureProject"
                            label="Проектные значения температуры"
                            ></v-text-field>


                            <v-text-field
                            v-model="editedItem.useGroundPrinciple"
                            label="Принцип использования грунтов основания"
                            ></v-text-field>


                            <v-text-field
                            v-model="editedItem.sms"
                            label="СМС"
                            ></v-text-field>



                        </v-col>

                        </v-row>
                    </v-container>
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                    >
                        Отменить
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                    >
                        Сохранить
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">Уверены, что хотите удалить?</v-card-title>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Отменить</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
            </template>

            <template v-slot:[`item.actions`]="{ item }">

            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
            </template>

            <template v-slot:no-data>
            <v-btn
                color="primary"
                @click="initialize"
            >
                Reset
            </v-btn>
            </template>

        </v-data-table>
    </div>
</template>


<script>

const ipcRenderer = window.require("electron").ipcRenderer


  export default {

    components: {

            
     },

    data: () => ({

      typeOfEntity: 'Bill',
      dialog: false,
      dialogDelete: false,
      headers: [
            {text: 'id', align: 'start', value: 'id'},            
            {text: 'Объект', align: 'start', value: 'cluster.number'},
               {text: 'Дата', align: 'start', value: 'date'},
            {text: 'Температура', align: 'start', value: 'temperature'},                     
            {text: 'text', value: 'text' },            
            {text: 'Actions', value: 'actions', sortable: false },

      ],
      items: [],
      wells: [],  
      filter: {cluster: null},
      editedIndex: -1,
      editedItem: {
        title: '',
        text: 0,
        depthProject: 0,
        cluster: null,
        useGroundPrinciple: '',
        sms: '',
        temperatureProject: ''
      },
      defaultItem: {
        title: '',
        text: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Добавление новой скважины' : 'Редактирование скважины'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      filter: {
          handler() {
                this.items = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Bill', filter: this.filter})     
                console.log(this.filter)
          },
          deep: true
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        this.items =  ipcRenderer.sendSync('getEntities', {typeOfEntity: this.typeOfEntity})
        this.clusters = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Cluster'})
   

      },

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {

        const isDeleted = ipcRenderer.sendSync('deleteEntity', {typeOfEntity: this.typeOfEntity, ...this.editedItem})

        if (isDeleted) {
             this.items.splice(this.editedIndex, 1)
             this.closeDelete()
        } else {

            alert('Не может быть удален')
        }
  
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {

        if (this.editedIndex > -1) {

          ipcRenderer.sendSync('updateEntity', {typeOfEntity: this.typeOfEntity, entity: this.editedItem})
          Object.assign(this.items[this.editedIndex], this.editedItem)

        } else {

          const id = ipcRenderer.sendSync('addEntity', {typeOfEntity: this.typeOfEntity, entity: this.editedItem})

          this.editedItem.id = id

          this.items.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
