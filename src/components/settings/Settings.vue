<template>
<div>
   <v-icon class="mr-2">
      mdi-brightness-4
   </v-icon>
   <v-list-item-title class="pr-10">
      Темный режим
   </v-list-item-title>
   <v-switch v-model="darkmode" color="primary" />

</div>

</template>
 


<script>
export default {
  data () {
    return {
      darkmode: false
    }
  },
  watch: {
    darkmode () {
      this.handledarkmode()
    }
  },
  created () {
    if (process.browser) {
      if (localStorage.getItem('DarkMode')) {
        const cookieValue = localStorage.getItem('DarkMode') === 'true'
        this.darkmode = cookieValue
      } else {
        this.handledarkmode()
      }
    }
  },
  methods: {
    handledarkmode () {
      if (process.browser) {
        if (this.darkmode === true) {
          this.$vuetify.theme.dark = true
          localStorage.setItem('DarkMode', true)
        } else if (this.darkmode === false) {
          this.$vuetify.theme.dark = false
          localStorage.setItem('DarkMode', false)
        }
      }
    }
  }
}
</script>
