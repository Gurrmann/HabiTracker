<template>
  <div class ="main bg-dark">
    <b-jumbotron bg-variant="dark" text-variant="white" header="Create a budget" lead="Put in your income for the specific month and it will allocate where to spend your money.">
      <p>
        <b-row align-v="start">
          <b-col></b-col>
          <b-col cols="12" sm="6" md="4"><b-form-select v-model="name" :options="options"></b-form-select></b-col>
          <b-col></b-col>
        </b-row>
      <p>
        <b-row align-v="start">
          <b-col></b-col>
          <b-col cols="12" sm="6" md="4"><b-form-input id="income" v-model="income" placeholder="Enter your income"></b-form-input></b-col>
          <b-col></b-col>
        </b-row>
      </p>
      <b-button href="BudgetDisplay" v-on:click="postBudget">Save</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'
import cookiesC from '../cookies/cookies'

export default {
  name: 'budget',
  data() {
    return {
      name: null,
      options: [
        { value: null, text: 'Select the current month' },
        { value: 'January', text: 'January' },
        { value: 'February', text: 'February' },
        { value: 'March', text: 'March' },
        { value: 'April', text: 'April' },
        { value: 'May', text: 'May' },
        { value: 'June', text: 'June ' },
        { value: 'July', text: 'July' },
        { value: 'August', text: 'August' },
        { value: 'September', text: 'September' },
        { value: 'October', text: 'October' },
        { value: 'November', text: 'November' },
        { value: 'December', text: 'Decemember' }
      ],
      budgets: [],
      message: '',
      expense: '',
      income: '',
      saving: ''
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
    postBudget() {
      var id = cookiesC.getCookieValue('id')
      const params = {
        name: this.name,
        income: this.income
      }
      Api.post(`users/${id}/budgets`, params)
        .then(request => {
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
}
</style>
