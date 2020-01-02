<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Create Scenario</h1>
            <h1 class="title" v-if="lesson">For {{ lesson.name }}</h1>
            <h1 class="subtitle">This is where fun happens!</h1>
            <b-field label="Title" type="is-danger" message="required">
                <b-input v-model="title"></b-input>
            </b-field>
            <b-field label="Description">
                <b-input v-model="description" type="textarea"></b-input>
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
    name: 'create-scenario',
    data() {
        return {
            title: '',
            description: '',
            lesson: null,
            lessionId: '',
        };
    },
    mounted: function() {
        var self = this;
        self.lessonId = self.$route.params.lessonId;
        db.collection('lessons').doc(self.lessonId).get().then(function(doc) {
            if (doc.exists) {
                self.lesson = doc.data();
            }
        });
    },
    methods: {
        resetForm: function() {
            this.title = '';
            this.description = '';
        },
        submitForm: function() {
            var self = this;
            db.collection('scenarios').add({
                title: self.title,
                description: self.description,
                lessonId: self.lessonId,
                answers: [],
                holders: [],
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(){
                self.$router.push({name: 'scenes', params: { lessonId: self.lessonId}});
            });
        },
    }
}
</script>