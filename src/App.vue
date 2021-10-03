<template>

<!-- App.vue -->

<v-app>
  <v-navigation-drawer app permanent>
    

    <v-list>
      <v-list-item-group mandatory color="indigo">

    <router-link to="/clusters">
        <v-list-item>           
            
          <v-icon class="mr-2" left>
                mdi-graph-outline
          </v-icon>
          <v-list-item-content>              
                <v-list-item-title>Кусты</v-list-item-title>
          </v-list-item-content>         

        </v-list-item>
   </router-link>

     <router-link to="/wells">
        <v-list-item>       
             <v-icon class="mr-2" left>
                mdi-water-well-outline
          </v-icon>   
            <v-list-item-content>
                <v-list-item-title>Скважины</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>

     <router-link to="/bills">
        <v-list-item>          

           <v-icon class="mr-2" left>
                mdi-text-box-outline
          </v-icon>   
            <v-list-item-content>
                <v-list-item-title>Ведомости</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>


      <router-link to="/measurements">
        <v-list-item>          
          
               <v-icon class="mr-2" left>
                mdi-thermometer
          </v-icon>  
            <v-list-item-content>
                <v-list-item-title>Измерения</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>


     <router-link to="/reports">
        <v-list-item>          
          
               <v-icon class="mr-2" left>
                mdi-chart-box-outline
          </v-icon>  

            <v-list-item-content>
                <v-list-item-title>Приложения</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>


     <router-link to="/settings">
        <v-list-item>          

               <v-icon class="mr-2" left>
                mdi-cog-outline
          </v-icon>  
            <v-list-item-content>
                <v-list-item-title>Настройки</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>



     <router-link to="/import">
        <v-list-item>          
          
               <v-icon class="mr-2" left>
                mdi-application-import
          </v-icon>  
          
            <v-list-item-content>
                <v-list-item-title>Импорт</v-list-item-title>
            </v-list-item-content>      
        </v-list-item>
      </router-link>

      </v-list-item-group>

    </v-list>

  
    <v-card caption
      elevation="3"
      class="mx-5 mt-15 pa-5"
    >


    <div class="text-caption">
        Количество кустов: {{countClusters}}
      </div>

      


    <div class="text-caption">
        Количество скважин: {{countWells}}
      </div>


    </v-card>


  </v-navigation-drawer>

  <v-app-bar app>
    <!-- -->
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>

</template>

<script>

const ipcRenderer = window.require("electron").ipcRenderer

export default {
  name: 'App',

  components: {

  },

  data: () => ({
    
    countWells: 0,
    countClusters: 0,
    countBills: 0,
    countMeasurements: 0,

  }),


  mounted() {

     const staistic = ipcRenderer.sendSync('getStatistic',{})
     this.countWells = staistic.countWells
     this.countClusters = staistic.countClusters

  }


}

</script>


<style>

  .v-navigation-drawer__content a {
    text-decoration: none;
  }
</style>
