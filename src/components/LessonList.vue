<template>
    <section class="section">
        <div class="container">
            <b-loading :is-full-page="true"
                :active.sync="lessons.length===0"
                :can-cancel="true">
            </b-loading>
            <div class="card" v-for="lesson in lessons" :key="lesson.id">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <img src="/img/gift.png">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ lesson.name }} <span v-if="lesson.isPracticeMode">(Practice Mode)</span></p>
                            <p><strong>Objective:</strong> {{ lesson.objective }}</p>
                            <button class="button is-primary" @click="go(lesson.id)">Go</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'

const db = firebaseApp.firestore();

export default {
    name: 'image-list',
    data () {
        return {
            lessons: [],
        }
    },
    mounted: function() {
        var self = this;
        db.collection('lessons').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                    self.lessons.push({
                        name: rec.data()['name'],
                        id: rec.id,
                        objective: rec.data()['objective'],
                        isPracticeMode: rec.data()['isPracticeMode']
                    });
                });
            });
    },
    methods: {
        go: function(lessonId) {
            this.$router.push({name: 'scenes', params: { lessonId: lessonId}});
        }
    }
}
</script>