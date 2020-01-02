<template>
    <section class="section">
        <div class="container has-text-centered">
            <p class="title" v-if="holder">{{ holder.name }}</p>
            <p class="subtitle" v-if="holder">{{ holder.description }}</p>
            <button @click="save" class="button is-info">
                <span class="icon"><i class="far fa-save"></i></span>
                <span>Save</span>
            </button>
        </div>
        <b-tabs v-model="activeTab">
            <b-tab-item label="Images">
                <div class="container">
                    <div class="card" v-for="image in filteredImages" :key="image.id">
                        <div class="card-content">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image is-64x64">
                                        <img :src="image.url">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-4">{{ image.name }}</p>
                                    <p><strong>Source:</strong> {{ image.fileUrl }}</p>
                                    <p><strong>Detail:</strong> {{ image.description }}</p>
                                    <div class="buttons">
                                        <button @click="add(image)"
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
            <b-tab-item label="Holder">
                <div class="container">
                    <div class="card" v-for="image in selectedItems" :key="image.id">
                        <div class="card-content">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image is-64x64">
                                        <img :src="image.url">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-4">{{ image.name }}</p>
                                    <p><strong>Source:</strong> {{ image.fileUrl }}</p>
                                    <p><strong>Detail:</strong> {{ image.description }}</p>
                                    <div class="buttons">
                                        <button @click="remove(image)"
                                            class="button is-danger">Remove</button>
                                    </div>
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

// var storageRef = storage.ref();
var imagesRecRef = db.collection('images');
var pathRef;

export default {
    name: 'image-list',
    data () {
        return {
            images: [],
            selectedItems: [],
            activeTab: 0,
            holderId: '',
            holder: null
        }
    },
    computed: {
        filteredImages: function() {
            var self = this;
            return self.images.filter(function(item) {
                return self.selectedItems.indexOf(item) < 0;
            });
        }
    },
    methods: {
        add: function(image) {
            this.selectedItems.push(image);
        },
        remove: function(image) {
            var self = this;
            var idx = self.selectedItems.indexOf(image);
            if (idx > -1) {
                self.selectedItems.splice(idx, 1);
            }
        },
        save: function() {
            var self = this;
            var items = [];
            self.selectedItems.forEach(function(item) {
                items.push(item.id);
            });
            db.collection('holders').doc(self.holderId).update({
                images: items
            }).then(function() {
                self.snackbar();
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
    },
    mounted: function() {
        var self = this;
        self.holderId = self.$route.params.holderId;
        db.collection('holders').doc(self.holderId)
            .get().then(function(doc){
                if(doc.exists) {
                    self.holder = {
                        name: doc.data()['name'],
                        id: doc.id,
                        description: doc.data()['description'],
                        images: doc.data()['images'],
                    };
                }
        });
        imagesRecRef.get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                pathRef = storage.ref(rec.data()['fileUrl']);
                pathRef.getDownloadURL().then(function(url) {
                    var item = {
                        url: url,
                        fileUrl: rec.data()['fileUrl'],
                        id: rec.id,
                        name: rec.data()['name'],
                        description: rec.data()['description']
                    }
                    self.images.push(item);
                    if (self.holder.images.indexOf(item.id) > -1) {
                        self.selectedItems.push(item);
                    }
                });
            });
        });
    }
}
</script>