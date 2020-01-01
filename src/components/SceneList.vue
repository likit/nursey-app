<template>
    <section class="section">
        <div class="container">
            <h1 class="title" v-if="lesson">{{ lesson.name }}</h1>
            <h1 class="subtitle" v-if="lesson">{{ lesson.objective }}</h1>
            <button class="button is-primary"
                @click="addScene(lessonId)">
                <b-icon icon="plus"></b-icon>
                <span>Scenario</span>
                </button>
            <hr>
            <div class="card" v-for="scene in scenes" :key="scene.id">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-128x128">
                                <img src="img/gift.png">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ scene.title }}</p>
                            <p><strong>Detail:</strong> {{ scene.description }}</p>
                            <button class="button is-success">
                                <b-icon icon="play"></b-icon>
                                <span>Play</span>
                            </button>
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
    name: 'scene-list',
    data () {
        return {
            scenes: [],
            lessonId: '',
            lesson: null,
        }
    },
    mounted: function() {
        var self = this;
        self.lessonId = self.$route.params.lessonId;
        db.collection('lessons').doc(self.lessonId).get().then(function(doc) {
            if (doc.exists) {
                self.lesson = doc.data();
            }
        });
        db.collection('scenarios').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                    self.scenes.push({
                        title: rec.data()['title'],
                        id: rec.id,
                        description: rec.data()['description']
                    });
                });
            });
    },
    methods: {
        addScene: function(lessonId) {
            this.$router.push({name: 'create-scenario', params: { lessonId: lessonId}});
        }
    }
}
</script>