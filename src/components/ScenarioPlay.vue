<template>
<section class="section">
    <div class="container has-text-right">
        <h1 class="title" v-if="countDown>0">Time: {{ countDown }}</h1>
    </div>
    <div class="container has-text-centered">
        <div v-if="scenario">
            <h1 class="title">{{ scenario.title }}</h1>
            <h1 class="subtitle">Player: {{ user.data.displayName }}</h1>
            <b-message class="is-info" has-icon>
                <p>{{ scenario.description }}</p>
            </b-message>
        </div>
        <div v-else>
            <h1 class="title">Loading...</h1>
        </div>
        <hr>
        <div class="card" v-for="holder in selectedItems" :key="holder.id">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-64x64">
                            <img src="img/shopping-cart.png">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{{ holder.name }}</p>
                        <p><strong>Detail:</strong> {{ holder.description }}</p>
                        <button @click="open(holder)" class="button">Open</button>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <b-button type="is-link" @click="countDown=0">Finish</b-button>
        <hr>
        <h1 class="title">Your selections</h1>
        <button @click="showAnswer=true" class="button">Show Answers</button>
        <table class="table is-fullwidth">
            <thead>
                <th>รูป</th>
                <th>อุปกรณ์</th>
                <th>ผล</th>
            </thead>
            <tr v-for="img in selected" :key="img.id">
                <td>
                    <figure class="image rounded is-32x32">
                        <img :src="img.url" class="is-rounded">
                    </figure>
                </td>
                <td>
                    {{ img.name }}
                </td>
                <td>
                    <div v-if="showAnswer">
                        <span class="icon has-text-success" v-if="isCorrect(img)">
                            <i class="fas fa-check"></i>
                        </span>
                        <span class="icon has-text-danger" v-else>
                            <i class="fas fa-check"></i>
                        </span>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <b-modal :active.sync="toggleModal" scroll="keep">
        <section class="section">
            <div class="card" v-for="image in imageSets" :key="image.id">
                <div class="card-image">
                    <figure class="image is-3by2">
                        <img :src="image.url">
                    </figure>
                </div>
                <footer class="card-footer">
                    <p class="card-footer-item">
                        <a @click="pick(image)">Pick</a>
                    </p>
                    <p class="card-footer-item">
                        <a @click="drop(image)">Drop</a>
                    </p>
                    <p class="card-footer-item">
                        <span class="icon has-text-success" v-if="isPicked(image)">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </footer>
            </div>
        </section>
    </b-modal>
</section>
</template>

<script>
import { mapGetters } from "vuex";
import {firebaseApp} from '../firebase-config.js'
import firebase from 'firebase'

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

var pathRef;

export default {
    name: 'scenario-play',
    data () {
        return {
            toggleModal: false,
            holders: [],
            images: [],
            answers: [],
            imageSets: [],
            selectedItems: [],
            selected: [],
            cache: {},
            showAnswer: false,
            scenario: null,
            countDown: 0
        };
    },
    computed: {
        ...mapGetters({
        user: "user"
        }),
        selectedOrAnwsers: function() {
            if (this.showAnswer) {
                return this.answers;
            } else {
                return this.selected;
            }
        }
    },
    mounted: function() {
        var self = this;
        self.scenarioId = self.$route.params.scenarioId;
        db.collection('scenarios').doc(self.scenarioId)
            .get().then(function(doc){
                if(doc.exists) {
                    self.scenario = {
                        title: doc.data()['title'],
                        id: doc.id,
                        description: doc.data()['description'],
                        holders: doc.data()['holders'],
                        answers: doc.data()['answers'],
                    };
                    self.countDown = doc.data()['timeLimit'];
                }
        });
        db.collection('holders').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                var item = {
                    id: rec.id,
                    name: rec.data()['name'],
                    description: rec.data()['description'],
                    images: rec.data()['images']
                }
                self.holders.push(item);
                var imageItem;
                if (self.scenario.holders.indexOf(item.id) > -1) {
                    self.selectedItems.push(item);
                    self.cache[item.id] = [];
                    item.images.forEach(function(img) {
                        db.collection('images').doc(img).get().then(function(rec) {
                            if (rec.exists) {
                                pathRef = storage.ref(rec.data()['fileUrl']);
                                pathRef.getDownloadURL().then(function(url) {
                                    imageItem = {
                                        url: url,
                                        fileUrl: rec.data()['fileUrl'],
                                        id: rec.id,
                                        name: rec.data()['name'],
                                        description: rec.data()['description']
                                    }
                                    self.images.push(imageItem);
                                    self.cache[item.id].push(imageItem);
                                    if (self.scenario.answers.indexOf(imageItem.id) > -1) {
                                        self.answers.push(imageItem);
                                    }
                                });
                            }
                        });
                    });
                }
            });
            self.timer();
        });
    },
    methods: {
        toast() {
            this.$buefy.toast.open('Tims is up!')
        },
        timer: function() {
            var self = this;
            if (self.countDown>0) {
                setTimeout(() => {
                    self.countDown -= 1;
                    self.timer();
                }, 1000);
            } else {
                self.toast();
                db.collection('plays').add({
                    scenarioId: self.scenarioId,
                    user: self.user,
                    lessonId: self.$route.params.lessonId,
                    answers: self.answers,
                    selectedItems: self.selectedItems,
                    selected: self.selected,
                    score: 10,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function(){
                    self.$buefy.toast.open({ message: 'Your play record has been saved!', type: "is-success"});
                    self.$router.push({name: 'scenes', params: { lessonId: self.$route.params.lessonId}});
                });
            }
        },
        stopTimer: function() {
            clearInterval(this.timer);
        },
        open: function(holder) {
            var self = this;
            self.imageSets = self.cache[holder.id];
            self.toggleModal = true;
        },
        pick: function(image) {
            var self = this;
            if (self.selected.indexOf(image) < 0) {
                self.selected.push(image);
            }
        },
        isPicked: function(image) {
            var self = this;
            return self.selected.indexOf(image) > -1;
        },
        isCorrect: function(image) {
            var self = this;
            return self.answers.indexOf(image) > -1;
        },
        drop: function(image) {
            var self = this;
            var idx = self.selected.indexOf(image)
            if (idx > -1) {
                self.selected.splice(idx, 1);
            }
        },
    }
}
</script>