<template>
<div class ="main bg-dark">
  <div>
    <b-jumbotron bg-variant="dark" text-variant="white" header="Create an achievement" lead="Name your achievement, select which category it belongs to, describe what you need to do in order to complete it, and finally decide on how much it will reward you!">
      <p>
        <b-row align-v="start">
          <b-col></b-col>
          <b-col cols="12" sm="6" md="4"><b-form-input id="name" v-model="name" placeholder="Name"></b-form-input></b-col>
          <b-col></b-col>
        </b-row>
      </p>
      <p>
        <b-row align-v="start">
          <b-col></b-col>
          <b-col cols="12" sm="6" md="4"><b-form-select v-model="type" :options="options1"></b-form-select></b-col>
          <b-col></b-col>
        </b-row>
      </p>
      <p>
        <b-row align-v="start">
          <b-col></b-col>
          <b-col cols="12" sm="6" md="4"><b-form-input id="description" v-model="description" placeholder="Describe it here"></b-form-input></b-col>
          <b-col></b-col>
        </b-row>
      </p>
      <p>
         <b-row align-v="start">
         <b-col></b-col>
         <b-col cols="12" sm="6" md="4"><b-form-select v-model="degree" :options="options2"></b-form-select></b-col>
         <b-col></b-col>
         </b-row>
      </p>
      <b-button v-on:click="postAchievement">Save</b-button>
      <br><br><br><br>
    </b-jumbotron>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import cookiesC from '../cookies/cookies'

export default {
  name: 'achievement',
  data() {
    return {
      type: null,
      options1: [
        { value: null, text: 'Category' },
        { value: 'Chores', text: 'Chores' },
        { value: 'Fitness', text: 'Fitness' },
        { value: 'Studies', text: 'Studies' },
        { value: 'Other', text: 'Personal' }
      ],
      degree: null,
      options2: [
        { value: null, text: 'Degree' },
        { value: 'Bronze', text: 'Bronze' },
        { value: 'Silver', text: 'Silver' },
        { value: 'Gold', text: 'Gold' }
      ],
      achievements: [],
      message: '',
      name: '',
      description: '',
      typeName: '',
      task: '',
      level: 1,
      typeExperience: 0,
      experiencePoints: 0,
      achievementID: '',
      categoryID: ''
    }
  },
  methods: {
    getMessage() {
      Api.get('/')
        .then(response => {
          this.message = response.data.message
        })
        .catch(error => {
          this.message = error
        })
    },
    postAchievement() {
      var id = cookiesC.getCookieValue('id')
      const params = {
        name: this.name,
        type: this.type,
        description: this.description,
        degree: this.degree
      }
      if (this.type === 'Fitness' || this.type === 'Chores' || this.type === 'Studies') {
        Api.post(`users/${id}/achievements`, params)
          .then(async request => {
            this.achievementID = request.data._id
            var categoryID = await this.postCategory()
            console.log(categoryID)

            Api.patch(`/achievements/${this.achievementID}`, { category: categoryID })
              .then(response => {
              })
              .catch(error => {
                this.message = error.message
              })
          })
          .catch(error => {
            this.message = error
          })
      } else {
        Api.post(`users/${id}/achievements`, params)
          .then(request => {
          })
          .catch(error => {
            this.message = error
          })
      }
      window.location.href = 'AchievementDisplay'
    },
    async postCategory() {
      await this.getAchievementInfo()
      var id = cookiesC.getCookieValue('id')
      const params = {
        categoryType: {
          typeName: this.type,
          task: this.name,
          level: this.level,
          typeExperience: this.typeExperience
        }
      }
      var catID = await Api.post(`users/${id}/categories`, params)
        .then(async request => {
          console.log(request.data)
          return request.data._id
        }, error => {
          this.message = error
        })
      return catID
    },
    async getAchievementInfo() {
      var idwow = cookiesC.getCookieValue('id')
      var id = this.achievementID
      await Api.get(`users/${idwow}/achievements/${id}`)
        .then(request => {
          this.type = request.data.type
          this.name = request.data.name
          this.level = request.data.level
          this.typeExperience = request.data.experiencePoints
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>

<style>
.btn_message {
  margin-bottom: 1em;
}
div {
  text-align: center;
  height: 100%;
}
</style>
