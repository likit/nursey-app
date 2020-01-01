<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Upload Images</h1>
            <b-field class="imageFile">
                <b-upload v-model="imageFile" type="file">
                    <a class="button is-primary">
                        <b-icon icon="upload"></b-icon>
                        <span>Click to upload</span>
                    </a>
                </b-upload>
                <span class="file-name" v-if="imageFile">{{ imageFile.name }}</span>
            </b-field>
            <b-field label="Category">
                <b-select placeholder="Select a category for a photo"
                    v-if="categories.length > 0" v-model="category">
                    <option
                        v-for="cat in categories" :key="cat.id">
                        {{ cat.data()['name'] }}
                    </option>
                </b-select>
                <b-select placeholder="Loading data" loading v-else></b-select>
            </b-field>
            <b-field label="Name">
                <b-input v-model="name"></b-input>
            </b-field>
            <b-field label="Description">
                <b-input type="textarea" v-model="desc"></b-input>
            </b-field>
            <div class="buttons">
                <button @click="resetForm" class="button is-danger">Reset</button>
                <button @click="uploadFile" class="button is-primary">Submit</button>
            </div>
        </div>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'
import firebase from 'firebase'

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

var storageRef = storage.ref();
var categoriesRef = db.collection('categories');

export default {
    name: 'image-upload',
    data () {
        return {
            imageFile: null,
            name: '',
            desc: '',
            categories: [],
            category: null,
        }
    },
    computed: {
        imageFileRef: function() {
            if (this.imageFile) {
                return storageRef.child('images/'+this.imageFile.name);
            } else {
                return '';
            }
        }
    },
    methods: {
        uploadFile: function() {
            var self = this;
            storageRef.child('images').put(self.imageFile).then(function() {
                db.collection('images').add({
                    name: self.name,
                    description: self.desc,
                    category: self.category,
                    fileUrl: self.imageFileRef.fullPath,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                self.$router.replace({name: 'home'});
            });
        },
        resetForm: function() {
            this.imageFile = null;
            this.name = '';
            this.desc = '';
            this.category = null;
        }
    },
    mounted: function () {
        var self = this;
        categoriesRef.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                self.categories.push(doc);
            });
        });
    }
}
</script>