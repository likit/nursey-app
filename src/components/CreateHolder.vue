<template>
    <section class="section">
        <h1 class="title">Create Holder</h1>
        <h1 class="subtitle">A holder contains one or more images.</h1>
        <div class="box">
        <b-field label="Name" type="is-danger" message="required">
            <b-input v-model="name"></b-input>
        </b-field>
        <b-field label="Description">
            <b-input type="textarea" v-model="description"></b-input>
        </b-field>
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
            description: ''
        }
    },
    methods: {
        resetForm: function() {
            this.name = '';
            this.description = '';
        },
        submitForm: function() {
            var self = this;
            db.collection('holders').add({
                name: self.name,
                description: self.description,
                images: [],
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(){
                self.snackbar();
                self.resetForm();
            });
        },
        snackbar: function() {
            this.$buefy.snackbar.open({
                duration: 3000,
                message: 'The holder has been created.',
                type: 'is-success',
                position: 'is-top',
                queue: false,
            });
        }
    }
}
</script>