<template>
    <section class="section">
        <h1 class="title">Edit Lesson</h1>
        <h1 class="subtitle">Lesson contains one or more scenarios.</h1>
        <div class="box">
        <b-field label="Name" type="is-danger" message="required">
            <b-input v-model="name"></b-input>
        </b-field>
        <b-field label="Objective">
            <b-input type="textarea" v-model="objective"></b-input>
        </b-field>
        <b-switch v-model="isPracticeMode" true-value="yes" false-value="no">Practice Mode</b-switch>
        <div class="buttons">
            <button @click="$router.push({name: 'lessons'})"
                    class="button is-light">Back</button>
            <button @click="submitForm" class="button is-primary">Submit</button>
        </div>
        </div>
    </section>
</template>


<script>
import {firebaseApp} from '../firebase-config.js'
import firebase from 'firebase'

const db = firebaseApp.firestore();

export default {
    name: 'edit-lesson',
    data() {
        return {
            name: '',
            objective: '',
            isPracticeMode: false,
            lessonId: null
        }
    },
    methods: {
        submitForm: function() {
            let self = this;
            db.collection('lessons').doc(self.lessonId)
                .update({
                  name: self.name,
                  objective: self.objective,
                  isPracticeMode: self.isPracticeMode,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function(){
                self.snackbar();
            });
        },
        snackbar: function() {
            this.$buefy.snackbar.open({
                duration: 3000,
                message: 'The lesson data has been saved.',
                type: 'is-success',
                position: 'is-top',
                queue: false,
            });
        }
    },
    mounted() {
      let self = this
      self.lessonId = self.$route.params.lessonId
      db.collection('lessons').doc(self.lessonId).get().then(snapshot => {
        let data = snapshot.data()
        self.name = data.name
        self.objective = data.objective
        self.isPracticeMode = data.isPracticeMode
      })
    }
}
</script>