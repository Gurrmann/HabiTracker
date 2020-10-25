<template>
  <div class ="def bg-dark">
    <br>
    <b-container v-if="loggedIn">
        <b-row align-h="center">
            <b-col cols="12" sm="6" md="4">
                <user-item class="items" v-bind:user="userinfo"/>
            </b-col>
        </b-row>
    </b-container>

    <b-row align-h="center">
      <b-col></b-col>
      <b-col cols="12" sm="6" md="4">
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1 bg-dark">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-1 variant="info">Personal Achievements</b-button>
        </b-card-header>
        <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
          <b-button href="AchievementPage" v-if="achFlag">{{ messagea }}click me to create one!</b-button>
          <div v-if="!achFlag">
          <b-card-body v-for="achievement in personalAch" :key="achievement._id">
                <user-achievement-item class="items" v-bind:achievementObject="achievement"/>
          </b-card-body>
          </div>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1 bg-dark">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-2 variant="info">Achievement Categories</b-button>
        </b-card-header>
        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
          <b-button href="AchievementPage" v-if="catFlag">{{ messagec }}click me to create one!</b-button>
          <div v-if="!catFlag" class="px-3 py-2">
            <b-tabs content-class="mt-3">
              <b-tab title="Fitness">
                <b-progress :value="fitnessXP" variant="warning" :striped="true" show-progress class="mt-2"></b-progress>
                <b-card-body v-for="fitness in fitnesses" :key="fitness._id">
                  <fitness-item class="items" v-bind:fitnessObject="fitness"/>
                </b-card-body>
              </b-tab>
              <b-tab title="Chores">
                <b-progress :value="choresXP" variant="warning" :striped="true" show-progress class="mt-2"></b-progress>
                <b-card-body v-for="chores in choreses" :key="chores._id">
                  <chores-item class="items" v-bind:choresObject="chores"/>
                </b-card-body>
              </b-tab>
              <b-tab title="Studies">
                <b-progress :value="studiesXP" variant="warning" :striped="true" show-progress class="mt-2"></b-progress>
                <b-card-body v-for="studies in studieses" :key="studies._id">
                  <studies-item class="items" v-bind:studiesObject="studies"/>
                </b-card-body>
              </b-tab>
            </b-tabs>
          </div>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1 bg-dark">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-3 variant="info">Budgets</b-button>
        </b-card-header>
        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
          <b-button href="BudgetPage" v-if="budFlag">{{ messageb }}click me to create one!</b-button>
          <div v-if="!budFlag">
          <b-card-body v-for="budget in budgets" :key="budget._id">
                <user-budget-item class="items" v-bind:budgetObject="budget"/>
          </b-card-body>
          </div>
        </b-collapse>
      </b-card>

      <b-card no-body class="mb-1 bg-dark">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button block v-b-toggle.accordion-4 variant="danger">Completed Achievements</b-button>
        </b-card-header>
        <b-collapse id="accordion-4" accordion="my-accordion" role="tabpanel">
          <b-card-body v-for="completed in categoriesComplete" :key="completed._id">
                <completed-item class="items" v-bind:completedObject="completed"/>
          </b-card-body>
        </b-collapse>
      </b-card>

    </div>
      </b-col>
      <b-col></b-col>
    </b-row>
  </div>
</template>

<script>
import { Api } from '@/Api'
import UserItem from '@/components/UserItem.vue'
import cookiesC from '../cookies/cookies'
import UserAchievementItem from '@/components/UserAchievementItem.vue'
import UserBudgetItem from '@/components/UserBudgetItem.vue'
import FitnessItem from '@/components/FitnessItem.vue'
import ChoresItem from '@/components/ChoresItem.vue'
import StudiesItem from '@/components/StudiesItem.vue'
import CompletedItem from '@/components/CompletedItem.vue'

export default {
  name: 'users',
  props: ['loggedIn', 'logging'],
  components: {
    UserItem,
    UserAchievementItem,
    UserBudgetItem,
    FitnessItem,
    ChoresItem,
    StudiesItem,
    CompletedItem
  },
  mounted() {
    this.getAchievement()
    this.getBudget()
    this.getCategoryName()
    var id = cookiesC.getCookieValue('id')
    Api.get(`/Users/${id}`)
      .then(response => {
        this.userinfo = response.data
      })
      .catch(error => {
        this.message = error.message
        this.users = []
      })
  },
  data() {
    return {
      messagea: '',
      messageb: '',
      messagec: '',
      text: '',
      userinfo: {},
      achFlag: false,
      budFlag: false,
      catFlag: false,
      personalFlag: false,
      achievements: [],
      budgets: [],
      categories: [],
      fitnesses: [],
      choreses: [],
      studieses: [],
      fitnessXP: 0,
      choresXP: 0,
      studiesXP: 0,
      achievementID: '',
      achType: '',
      personalAch: [],
      categoriesComplete: [],
      personalAchComplete: []
    }
  },
  methods: {
    deleteUser(id) {
      Api.delete(`/users/${id}`)
        .then(response => {
          const index = this.users.findIndex(user => user._id === id)
          this.users.splice(index, 1)
        })
        .catch(error => {
          this.message = error.message
        })
    },
    deleteUserCollection() {
      Api.delete('/users')
        .then(response => {
          location.reload()
        })
        .catch(error => {
          this.message = error.message
        })
    },
    getAchievement() {
      this.personalAch = []
      var id = cookiesC.getCookieValue('id')
      console.log(id)
      Api.get(`/users/${id}/achievements`)
        .then(response => {
          this.achievements = response.data
          for (var i = 0; i < this.achievements.length; i++) {
            if (this.achievements[i].type === 'Other' && this.achievements[i].complete === false) {
              this.personalAch.push(this.achievements[i])
              this.personalFlag = true
            } else if (this.achievements[i].type === 'Other' && this.achievements[i].complete === true) {
              this.categoriesComplete.push(this.achievements[i])
              this.personalFlag = true
            }
          }
          console.log(this.personalAch)
          console.log(this.personalAchComplete)
          if (this.personalFlag === false) {
            this.achFlag = true
            this.messagea = 'You have no personalised achievements yet, '
            this.personalAch = []
          }
        })
        .catch(() => {
          this.achFlag = true
          this.messagea = 'You have no personalised achievements yet, '
          this.personalAch = []
          this.achievements = []
        })
    },
    getBudget() {
      var id = cookiesC.getCookieValue('id')
      Api.get(`/users/${id}/budgets`)
        .then(response => {
          this.budgets = response.data
        })
        .catch(() => {
          this.budFlag = true
          this.messageb = 'You have no budgets yet, '
          this.budgets = []
        })
    },
    getCategoryName() {
      var id = cookiesC.getCookieValue('id')
      Api.get(`/users/${id}/categories`)
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].categoryType.complete === false) {
              this.categories.push(response.data[i].categoryType)
            } else if (response.data[i].categoryType.complete === true) {
              this.categoriesComplete.push(response.data[i].categoryType)
            }
          }
          for (var j = 0; j < this.categories.length; j++) {
            if (this.categories[j].typeName === 'Fitness') {
              this.fitnesses.push(this.categories[j])
            } else if (this.categories[j].typeName === 'Chores') {
              this.choreses.push(this.categories[j])
            } else if (this.categories[j].typeName === 'Studies') {
              this.studieses.push(this.categories[j])
            }
          }
        })
        .catch(error => {
          console.log(error)
          this.catFlag = true
          this.messagec = 'You have no categorised achievements yet, '
          this.categories = []
        })
    }
  }
}
</script>

<style scoped>
.red {
    color: red;
}
div {
  text-align: center;
}
.def {
  min-height: 94vh;
  display: flex;
  flex-direction: column;
}
</style>
