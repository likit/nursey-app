<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Edit Image Detail</h1>
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
                <button @click="$router.push({name: 'images'})"
                        class="button is-light">Back</button>
                <button @click="save" class="button is-primary">Save</button>
            </div>
        </div>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

const storageRef = storage.ref();
const categoriesRef = db.collection('categories');
const imagesRecRef = db.collection('images');

export default {
    name: 'image-edit',
    data () {
        return {
            name: '',
            desc: '',
            categories: [],
            category: null,
        }
    },
    computed: {
        imageFileRef: function() {
            if (this.imageFile) {
                return storageRef.child(this.category+'/'+this.imageFile.name);
            } else {
                return '';
            }
        }
    },
    methods: {
        save: function() {
          let self = this
          imagesRecRef.doc(this.$route.params.imageRecId).update({
            name: self.name,
            description: self.desc,
            category: self.category
          }).then(function() {
            self.snackbar()
          });
        },
        snackbar: function() {
            this.$buefy.snackbar.open({
                duration: 3000,
                message: 'The image data has been save.',
                type: 'is-success',
                position: 'is-top',
                queue: false,
            });
        }
    },
    mounted: function () {
        let self = this;
        categoriesRef.get().then(function(snapshot) {
            snapshot.forEach(function(doc) {
                self.categories.push(doc);
            });
        });
      // eslint-disable-next-line no-console
      console.log(this.$route.params.imageRecId)
      imagesRecRef.doc(this.$route.params.imageRecId).get().then(function(snapshot) {
          let rec = snapshot.data()
          self.id = rec.id
          self.name = rec.name
          self.desc = rec.description
          self.category = rec.category
        });
    }
}
</script>