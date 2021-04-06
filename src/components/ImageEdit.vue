<template>
<section class="section">
  <div class="container">
    <div class="columns">
      <div class="column is-two-thirds is-offset-2 has-text-centered box">
        <img :src="url" v-if="url != null">
        <b-field label="คำอธิบาย">
          <b-input v-model="description"></b-input>
        </b-field>
        <b-field label="ชื่อ">
          <b-input v-model="name"></b-input>
        </b-field>
        <b-field label="ประเภท">
          <b-select placeholder="เลือกประเภท" v-model="group" expanded>
            <option v-for="gr in itemGroups" :key="gr" :value="gr">
              {{ gr }}
            </option>
          </b-select>
        </b-field>
        <div class="buttons is-grouped-centered">
          <button class="button is-success" @click="save">
            <span>Save</span>
          </button>
          <button class="button is-light" @click="$router.back()">
            <span>Back</span>
          </button>
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
export default {
  name: "ImageEdit",
  data() {
    return {
      url: null,
      description: null,
      name: null,
      group: null,
      itemGroups: []
    }
  },
  methods: {
    save: function () {
      let self = this
      let imageId = this.$route.params.imageId;
      let imagesRecRef = db.collection('images');
      imagesRecRef.doc(imageId).update({
        name: self.name,
        group: self.group,
        description: self.description
      }).then(()=>{
        self.$buefy.toast.open({
          type: 'is-success',
          message: 'Saved data successfully'
        })
      }).catch((e)=>{
        self.$buefy.toast.open({
          type: 'is-danger',
          message: e.toString(),
        })
      })
    }
  },
  mounted() {
    let self = this;

    let imagesRecRef = db.collection('images');
    let itemGroupRef = db.collection('itemGroups')

    itemGroupRef.get().then((snapshot)=>{
      snapshot.forEach((g)=>{
        self.itemGroups.push(g.data()['name'])
      })
    })

    let imageId = this.$route.params.imageId;
    imagesRecRef.doc(imageId).get().then(function(snapshot) {
      let rec = snapshot
      let pathRef = storage.ref(rec.data()['fileUrl']);
      pathRef.getDownloadURL().then(function(url) {
        self.url = url
        self.name = rec.data()['name'],
        self.description = rec.data()['description']
        self.group = rec.data()['group']
      });
    });
  }
}
</script>

<style scoped>

</style>