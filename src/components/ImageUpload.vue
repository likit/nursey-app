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
            <b-field label="Name">
                <b-input v-model="name"></b-input>
            </b-field>
            <b-field label="Description">
                <b-input type="textarea" v-model="desc"></b-input>
            </b-field>
            <span>{{ imageFileRef }}</span>
            <button @click="uploadFile" class="button is-primary">Submit</button>
        </div>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');

var storageRef = storage.ref();

export default {
    name: 'image-upload',
    data () {
        return {
            imageFile: null,
            name: '',
            desc: '',
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
            storageRef.child('images').put(this.imageFile).then(function() {});
        }
    }
}
</script>