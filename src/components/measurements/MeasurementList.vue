<template>
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
        <v-toolbar-title>Измерения</v-toolbar-title>
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
          max-width="500px"
        >

          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                 
     
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.number"
                      label="номер"
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


</template>


<script>

 const ipcRenderer = window.require("electron").ipcRenderer

  export default {
    data: () => ({

      typeOfEntity: 'Measurement',
      dialog: false,
      dialogDelete: false,
      headers: [
            {text: 'id', align: 'start', value: 'id'},
            {text: 'Дата', value: 'date' },
            {text: 'Скважина', value: 'well.title' },            
            {text: 'Глубина', value: 'depth'},
            {text: 'Значения', value: 'values'},
            {text: 'Комментарий', value: 'comment'},            
            {text: 'Actions', value: 'actions', sortable: false },

      ],
      items: [],
      filter: {cluster: null},
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Добавление' : 'Редактирование'
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

                this.items = ipcRenderer.sendSync('getEntities', {typeOfEntity: 'Measurement'})     
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
