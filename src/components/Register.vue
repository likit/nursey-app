<template>
<section class="section">
  <div class="container">
      <div class="columns">
          <div class="column box is-one-third is-offset-4">
            <form action="#" @submit.prevent="submit">
              <h1 class="has-text-centered title">Register</h1>
                <b-field label="Name">
                    <b-input v-model="form.name" placeholder="Name"></b-input>
                </b-field>
                <b-field label="Institution">
                    <b-input v-model="form.institution" placeholder="Institution"></b-input>
                </b-field>
                <b-field label="Student ID">
                    <b-input v-model="form.studentId" placeholder="Student ID"></b-input>
                </b-field>
                <b-field label="Email">
                    <b-input v-model="form.email" type="email" placeholder="Email"></b-input>
                </b-field>
                <b-field label="Password">
                    <b-input v-model="form.password" type="password" placeholder="Password"></b-input>
                </b-field>
              <div class="field">
                <div class="has-text-centered">
                  <b-button class="is-success" @click="submit()">Submit</b-button>
                </div>
              </div>
            </form>
          </div>
      </div>
  </div>
</section>
</template>


<script>
import firebase from "firebase";

export default {
  data() {
    return {
      form: {
        name: "",
        studentId: "",
        institution: "",
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name,
              studentId: this.form.studentId,
              institution: this.form.institution
            })
            .then(() => {});
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>