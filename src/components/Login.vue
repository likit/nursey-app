<template>
<section class=section>
    <div class="container">
        <div class="columns">
          <div class="column box is-one-third is-offset-4">
            <h1 class="title has-text-centered">Log In</h1>
            <form action="#" @submit.prevent="submit">
               <b-field label="Email">
                    <b-input v-model="form.email" type="email" placeholder="Email"></b-input>
                </b-field>
                <b-field label="Password">
                    <b-input v-model="form.password" type="password" placeholder="Password"></b-input>
                </b-field>
              <div class="field">
                <div class="has-text-centered">
                  <b-button class="is-success" @click="submit()">Go</b-button>
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
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      let self = this
      firebase
        .auth()
        .signInWithEmailAndPassword(self.form.email, self.form.password)
        .then(() => {
            self.$router.replace({ name: "home"});
        })
        .catch(err => {
          self.error = err.message;
          alert("Password error")
        });
    }
  }
};
</script>