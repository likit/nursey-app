<template>
<section class=section>
    <div class="container">
        <div class="columns">
            <div class="column">
            <form action="#" @submit.prevent="submit">
               <b-field label="Email">
                    <b-input v-model="form.email" type="email" placeholder="Email"></b-input>
                </b-field>
                <b-field label="Password">
                    <b-input v-model="form.password" type="password" placeholder="Password"></b-input>
                </b-field>
                <b-button @click="submit()">Submit</b-button>
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
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
            this.$router.replace({ name: "home"});
        })
        .catch(err => {
          this.error = err.message;
        });
    }
  }
};
</script>