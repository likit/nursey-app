<template>
    <section class="section">
        <div class="container">
            <b-loading :is-full-page="true"
                :active.sync="images.length===0"
                :can-cancel="true">
            </b-loading>
            <div class="card" v-for="image in images" :key="image.id">
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
                                <button class="button is-danger">Delete</button>
                                <button class="button is-primary">Edit</button>
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
        }
    },
    mounted: function() {
        var self = this;
        imagesRecRef.get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                pathRef = storage.ref(rec.data()['fileUrl']);
                pathRef.getDownloadURL().then(function(url) {
                    self.images.push({
                        url: url,
                        fileUrl: rec.data()['fileUrl'],
                        id: rec.id,
                        name: rec.data()['name'],
                        description: rec.data()['description']
                    });
                });
            });
        });
    },
    methods: {}
}
</script>