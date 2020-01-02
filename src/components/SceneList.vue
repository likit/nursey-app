<template>
    <section class="section">
        <div class="container">
            <h1 class="title" v-if="lesson">{{ lesson.name }}</h1>
            <h1 class="subtitle" v-if="lesson">{{ lesson.objective }}</h1>
            <button class="button is-primary"
                @click="addScenario(lessonId)">
                <b-icon icon="plus"></b-icon>
                <span>Scenario</span>
                </button>
            <hr>
            <div class="card" v-for="scenario in scenarios" :key="scenario.id">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <img src="img/greeting-card.png">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ scenario.title }}</p>
                            <p><strong>Detail:</strong> {{ scenario.description }}</p>
                            <div class="buttons">
                                <button @click="playScenario(scenario.id)"
                                    class="button is-success">
                                    <b-icon icon="play"></b-icon>
                                    <span>Play</span>
                                </button>
                                <button @click="editScenario(scenario.id)" class="button">
                                    <b-icon icon="pencil"></b-icon>
                                    <span>Edit</span>
                                </button>
                            </div>
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
            scenarios: [],
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
                    self.scenarios.push({
                        title: rec.data()['title'],
                        id: rec.id,
                        description: rec.data()['description']
                    });
                });
            });
    },
    methods: {
        addScenario: function(lessonId) {
            this.$router.push({name: 'create-scenario', params: { lessonId: lessonId}});
        },
        editScenario: function(scenarioId) {
            this.$router.push({name: 'edit-scenario', params: { scenarioId: scenarioId}});
        },
        playScenario: function(scenarioId) {
            this.$router.push({name: 'play-scenario', params: { scenarioId: scenarioId}});
        }
    }
}
</script>