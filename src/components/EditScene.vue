<template>
    <section class="section">
        <div class="container has-text-centered">
            <div v-if="!isEditing">
              <p class="title" v-if="scenario">{{ scenario.title }}</p>
              <p class="subtitle" v-if="scenario">{{ scenario.description }}</p>
            </div>
            <div v-else>
              <div class="field">
                <div class="control">
                  <input v-model="scenario.title" class="input"/>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <textarea v-model="scenario.description" class="textarea"></textarea>
                </div>
              </div>
            </div>
            <span>Images {{ images.length }}</span>
            <div class="buttons">
              <button @click="save" class="button is-success">
                <span class="icon"><i class="far fa-save"></i></span>
                <span>Save</span>
              </button>
              <button class="button" @click="isEditing=!isEditing">
                <span class="icon"><i class="fas fa-pencil-alt"></i></span>
                <span v-if="!isEditing">Edit</span>
                <span v-else>Cancel</span>
              </button>
            </div>
        </div>
        <b-tabs v-model="activeTab">
            <b-tab-item label="Holders">
                <div class="container">
                    <div class="card" v-for="holder in filteredHolders" :key="holder.id">
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
                                    <div class="buttons">
                                        <button @click="add(holder)"
                                            class="button is-primary">
                                            <span class="icon"><i class="fas fa-plus"></i></span>
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab-item>
            <b-tab-item label="This">
                <div class="container">
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
                                    <div class="buttons">
                                        <button @click="remove(holder)"
                                            class="button is-danger">Remove</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab-item>
            <b-tab-item label="Answers">
                <div class="card" v-for="image in images" :key="image.id">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-64x64">
                                    <img :src="image.url">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">{{ image.name }}
                                    <span class="icon has-text-success" v-if="isCorrect(image)">
                                        <i class="fas fa-check"></i>
                                    </span>
                                </p>
                                <p><strong>Source:</strong> {{ image.fileUrl }}</p>
                                <p><strong>Detail:</strong> {{ image.description }}</p>
                                <div class="buttons">
                                    <button @click="mark(image)"
                                        class="button is-primary">Mark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </b-tab-item>
        </b-tabs>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

let pathRef;

export default {
    name: 'image-list',
    data () {
        return {
            isEditing: false,
            holders: [],
            selectedItems: [],
            activeTab: 0,
            scenarioId: '',
            scenario: null,
            answers: [],
            images: [],
            cache: {},
        }
    },
    computed: {
        filteredHolders: function() {
            let self = this;
            return self.holders.filter(function(item) {
                return self.selectedItems.indexOf(item) < 0;
            });
        }
    },
    methods: {
        add: function(holder) {
            let self = this;
            let imageItem;
            self.selectedItems.push(holder);
            if (holder.id in self.cache) {
                self.cache[holder.id].forEach(function(img){
                    if (self.images.indexOf(img) < 0) {
                        self.images.push(img);
                    }
                });
            } else {
                self.cache[holder.id] = [];
                holder.images.forEach(function(img) {
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
                                self.cache[holder.id].push(imageItem);
                            });
                        }
                    });
                });
            }
        },
        remove: function(holder) {
            let self = this;
            let idx = self.selectedItems.indexOf(holder);
            if (idx > -1) {
                self.selectedItems.splice(idx, 1);
            }
            self.cache[holder.id].forEach(function(img) {
                let idx = self.images.indexOf(img);
                if (idx > -1) {
                    self.images.splice(idx, 1);
                }
                idx = self.answers.indexOf(img);
                if (idx > -1) {
                    self.answers.splice(idx, 1);
                }
            });
        },
        save: function() {
            let self = this;
            let items = [];
            let anwserKeys = [];
            self.selectedItems.forEach(function(item) {
                items.push(item.id);
            });
            self.answers.forEach(function(img) {
                anwserKeys.push(img.id);
            });
            db.collection('scenarios').doc(self.scenarioId).update({
                title: self.scenario.title,
                description: self.scenario.description,
                holders: items,
                answers: anwserKeys
            }).then(function() {
                self.isEditing = false
                self.snackbar();
            });
        },
        mark: function(image) {
            let self = this;
            let idx = self.answers.indexOf(image);
            if (idx < 0) {
                self.answers.push(image);
            } else {
                self.answers.splice(idx, 1);
            }
        },
        isCorrect: function(image) {
            return this.answers.indexOf(image) > -1;
        },
        snackbar: function() {
            this.$buefy.snackbar.open({
                duration: 3000,
                message: 'The change has been recorded.',
                type: 'is-success',
                position: 'is-top',
                queue: false,
            });
        }
    },
    mounted: function() {
        let self = this;
        self.scenarioId = self.$route.params.scenarioId;
        db.collection('scenarios').doc(self.scenarioId)
            .get().then(function(doc){
                if(doc.exists) {
                    self.scenario = {
                        title: doc.data()['title'],
                        id: doc.id,
                        description: doc.data()['description'],
                        holders: doc.data()['holders'],
                        answers: doc.data()['answers']
                    };
                }
        });
        db.collection('holders').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                let item = {
                    id: rec.id,
                    name: rec.data()['name'],
                    description: rec.data()['description'],
                    images: rec.data()['images']
                }
                self.holders.push(item);
                let imageItem;
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
        });
    }
}
</script>