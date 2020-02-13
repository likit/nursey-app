<template>
    <section class="section">
        <h1 class="title">Create Lesson</h1>
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
            <button @click="resetForm" class="button is-danger">Reset</button>
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
    name: 'create-lesson',
    data() {
        return {
            name: '',
            objective: '',
            isPracticeMode: false,
        }
    },
    methods: {
        resetForm: function() {
            this.name = '';
            this.objective = '';
            this.isPracticeMode = false;
        },
        submitForm: function() {
            var self = this;
            db.collection('lessons').add({
                name: self.name,
                objective: self.objective,
                isPracticeMode: self.isPracticeMode,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(){
                self.snackbar();
                self.resetForm();
            });
        },
        snackbar: function() {
            this.$buefy.snackbar.open({
                duration: 3000,
                message: 'The lesson has been created.',
                type: 'is-success',
                position: 'is-top',
                queue: false,
            });
        }
    }
}
</script>