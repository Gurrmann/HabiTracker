<template> <div class ="main bg-dark">
    <b-container>
        <h1 class ="idk">Your Achievements</h1>
        <b-row align-h="center">
            <b-col cols="12" sm="6" md="4" v-for="achievement in achievements" v-bind:key="achievement._id">
               <achievement-item class="items" v-bind:achievement="achievement" v-on:del-achievement="deleteAchievement" v-on:complete-achievement="completeAchievement"/>
            </b-col>
        </b-row>
        <p class="red">{{message}}</p>
    </b-container>
     </div>
</template>

<script>
import { Api } from '@/Api'
import AchievementItem from '@/components/AchievementItem.vue'
import cookiesC from '../cookies/cookies'

export default {
  name: 'achievement',
  components: {
    AchievementItem
  },
  mounted() {
    this.getAchievement()
    this.getCategory()
  },
  data() {
    return {
      achievements: [],
      categories: [],
      completeds: [],
      message: '',
      messages: '',
      text: '',
      completeFlag: false,
      deelte: ''
    }
  },
  methods: {
    deleteAchievement(id) {
      var userId = cookiesC.getCookieValue('id')
      Api.delete(`users/${userId}/achievements/${id}`)
        .then(response => {
          this.deelte = response.data.name
          this.deleteCategory()
          const index = this.achievements.findIndex(achievement => achievement._id === id)
          this.achievements.splice(index, 1)
        })
        .catch(error => {
          this.message = error.message
        })
    },
    deleteCategory() {
      console.log('delete category' + this.deelte)
      var userId = cookiesC.getCookieValue('id')
      for (var i = 0; i < this.categories.length; i++) {
        console.log('hello')
        if (this.categories[i].categoryType.task === this.deelte) {
          var idCat = this.categories[i]._id
          console.log(this.categories)
          Api.delete(`users/${userId}/categories/${idCat}`)
            .then(response => {
              this.categories.splice(i, 1)
              console.log('hi')
            })
            .catch(error => {
              this.message = error.message
            })
        }
      }
    },
    getCategory() {
      var userId = cookiesC.getCookieValue('id')
      Api.get(`users/${userId}/categories`)
        .then(response => {
          this.categories = response.data
          console.log(this.categories)
        })
        .catch(error => {
          error.message = 'You have no achievements yet'
          this.messages = error.message
        })
    },
    getAchievement() {
      var userId = cookiesC.getCookieValue('id')
      Api.get(`/users/${userId}/achievements`)
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].complete === false) {
              this.achievements.push(response.data[i])
            } else if (response.data[i].complete === true) {
              this.completeds.push(response.data[i])
            }
          }
        })
        .catch(error => {
          error.message = 'You have no achievements yet'
          this.message = error.message
        })
    },
    async completeAchievement(id) {
      var userId = cookiesC.getCookieValue('id')
      var userExperience
      var remainder
      var lvl
      await Api.get(`users/${userId}`)
        .then(response => {
          userExperience = response.data.experiencePoints
          lvl = response.data.level
        }).catch(error => {
          this.message = error.message
        })
      await Api.get(`users/${userId}/achievements/${id}`)
        .then(response => {
          userExperience += response.data.experiencePoints
        })
        .catch(error => {
          this.message = error.message
        })
      if (userExperience >= 100) {
        lvl += 1
        remainder = userExperience - 100
        userExperience = remainder
      }
      const paramsUser = {
        experiencePoints: userExperience,
        level: lvl
      }
      Api.patch(`users/${userId}`, paramsUser)
        .then(response => {
        })
        .catch(error => {
          this.message = error.message
        })
      const paramsAchievement = {
        complete: true
      }
      const paramsCategory = {
        categoryType: {
          complete: true
        }
      }
      /* Api.delete(`users/${userId}/achievements/${id}`)
        .then(response => {
          console.log('succesfully deleted achievement')
          this.deelte = response.data.name
          this.deleteCategory()
          const index = this.achievements.findIndex(achievement => achievement._id === id)
          this.achievements.splice(index, 1)
        })
        .catch(error => {
          console.log('delete achievement failed')
          this.message = error.message
        }) */
      Api.patch(`/achievements/${id}`, paramsAchievement)
        .then(response => {
          if (response.data.category.length > 0) {
            var idCat = response.data.category[0]
            Api.patch(`/categories/${idCat}`, paramsCategory)
              .then(response => {
              })
              .catch(error => {
                this.message = error.message
              })
          }
          alert('Congratulations on completing your goal!')
          // window.location.href = 'AchievementDisplay'
        })
        .catch(error => {
          this.message = error.message
        })
    }
  }
}
</script>

<style scoped>
.red {
    color: red;
}
.idk {
  color: white;
}
div {
  text-align: center;
}
</style>
