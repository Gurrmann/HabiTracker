<template>
<div>
  <b-card
    style="background-color: #515151"
    text-variant="white"
    sub-title=""
  >
    <b-card-text  v-if="show && !putFlag">
      <p>{{achievement.name}}</p>
    </b-card-text>
    <b-card-text v-if="!show">
      <p>{{info.name}}</p>
      <hr class="my-4">
      <p>{{info.type}}</p>
      <hr class="my-4">
      <p>{{info.description}}</p>
      <hr class="my-4">
      <p>{{info.degree}}</p>
      <hr class="my-4">
      <p>Experience points: {{info.experiencePoints}}</p>
      <hr class="my-4">
    </b-card-text>
    <p>
    <button class="button blue-button" v-on:click="getAchievement">{{ details }}</button>
    </p>
    <p>
    <button class="button blue-button" v-on:click="$emit('complete-achievement', achievement._id)"> {{ status }} </button>
    </p>
    <button class="button red-button" v-on:click="$emit('del-achievement', achievement._id)">Delete Achievement</button>
  </b-card>
  </div>
</template>

<script>
import { Api } from '@/Api'
// import cookies from '../cookies/cookies'

export default {
  data() {
    return {
      show: true,
      putFlag: false,
      status: 'Mark as complete',
      details: 'See Details',
      info: {},
      name: '',
      category: '',
      description: ''
    }
  },
  name: 'achievement-item',
  props: ['achievement'],
  methods: {
    getAchievement() {
      if (this.show === false) {
        this.show = true
        this.details = 'See Details'
      } else {
        this.details = 'Hide'
        this.show = false
        Api.get(`/achievements/${this.achievement._id}`)
          .then(response => {
            this.info = {
              name: response.data.name,
              type: response.data.type,
              description: response.data.description,
              degree: response.data.degree,
              experiencePoints: response.data.experiencePoints
            }
          })
          .catch(error => {
            this.message = error.message
            this.achievement = []
          })
      }
    }
  }
}
</script>
<style>
.button {
  border: none;
  font-size: 16px;
  color: white;
  border-radius: 12px;
  padding: 5px 10px;
  margin: 0px
}
.blue-button {
  background-color: #02a2f2;
}
.blue-button:hover {
  background-color: #5202f2;
}
.red-button {
  background-color: red;
}
.red-button:hover {
  background-color: darkred;
}
</style>
