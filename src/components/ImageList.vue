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
                            <figure class="image is-128x128">
                                <img :src="image.url">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ image.name }}</p>
                            <p><strong>Source:</strong> {{ image.fileUrl }}</p>
                            <p><strong>Detail:</strong> {{ image.description }}</p>
                            <div class="buttons">
                                <button @click="confirmDelete(image.id, image.fileUrl)"
                                        class="button is-danger">
                                  Delete
                                </button>
                                <button class="button is-primary"
                                        @click="$router.push({name: 'image-edit', params: {imageRecId: image.id}})">
                                  Edit
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

const storage = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const db = firebaseApp.firestore();

// var storageRef = storage.ref();
const imagesRecRef = db.collection('images');

function sortByName(a, b) {
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  return 0;
}

export default {
    name: 'image-list',
    data () {
        return {
            images: [],
        }
    },
    mounted: function() {
        let self = this;
        imagesRecRef.get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                let pathRef = storage.ref(rec.data()['fileUrl']);
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
            self.images.sort(sortByName)
        });
    },
    methods: {
      confirmDelete: function (recId, fileUrl) {
        let self = this
        this.$buefy.dialog.confirm({
          message: 'คุณต้องการลบรายการนี้หรือไม่',
          onConfirm: () => {
            let pathRef = storage.ref(fileUrl)
            pathRef.delete()
            imagesRecRef.doc(recId).delete().then(()=>{
              self.images = self.images.filter(image => image.id !== recId)
            })
            self.images.sort(sortByName)
          }
        })
      }
    }
}
</script>