<template>
    <section class="section">
        <div class="container">
            <div class="card" v-for="lesson in lessons" :key="lesson.id">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-128x128">
                                <img src="img/gift.png">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ lesson.name }}</p>
                            <p><strong>Objective:</strong> {{ lesson.objective }}</p>
                            <button class="button is-primary">Go</button>
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
                        objective: rec.data()['objective']
                    });
                });
            });
    },
    methods: {}
}
</script>