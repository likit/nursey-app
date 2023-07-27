<template>
  <section class="section">
    <div class="container has-text-centered">
      <h1 class="title" v-if="lesson">{{ lesson.name }}</h1>
      <h1 class="subtitle" v-if="lesson">{{ lesson.objective }}</h1>
      <div class="has-text-right">
        <button class="button is-primary"
                @click="addScenario(lessonId)">
          <b-icon icon="plus"></b-icon>
          <span>Scenario</span>
        </button>
      </div>
      <hr>
      <div class="card" v-for="(scenario, index) in scenarios" :key="scenario.id">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img src="/img/greeting-card.png">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4"><span class="tag is-rounded is-info">{{scenario.number}}</span>{{ scenario.title }}</p>
              <p v-if="scenario.description"><strong>Detail:</strong> {{ scenario.description }}</p>
              <div class="buttons">
                <button @click="editScenario(scenario.id)" class="button">
                  <b-icon icon="pencil"></b-icon>
                </button>
                <button class="button" @click="toggleSort(index)">
                  <span class="icon"><i class="fas fa-sort-numeric-up"></i></span>
                </button>
                <div class="field" v-if="sortEditList[index]">
                  <div class="control">
                    <input type="number" v-model="scenario.number" class="input"/>
                  </div>
                </div>
                <button @click="deleteScenario(scenario.id)" class="button is-danger">
                  <i class="fas fa-trash-alt"></i>
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
  data() {
    return {
      scenarios: [],
      lessonId: '',
      lesson: null,
      sortEditList: [],
    }
  },
  mounted: function () {
    var self = this;
    self.lessonId = self.$route.params.lessonId;
    db.collection('lessons').doc(self.lessonId).get().then(function (doc) {
      if (doc.exists) {
        self.lesson = doc.data();
      }
    });
    db.collection('scenarios').get().then(function (snapshot) {
      snapshot.forEach(function (rec) {
        let d = rec.data()
        if (d['lessonId'] === self.lessonId) {
          self.scenarios.push({
            title: d['title'],
            id: rec.id,
            number: d['number'] || '#',
            description: d['description']
          });
          self.sortEditList.push(false)
        }
      });
    });
  },
  methods: {
    addScenario: function (lessonId) {
      this.$router.push({name: 'create-scenario', params: {lessonId: lessonId}});
    },
    editScenario: function (scenarioId) {
      this.$router.push({name: 'edit-scenario', params: {scenarioId: scenarioId}});
    },
    playScenario: function (scenarioId) {
      this.$router.push({
        name: 'play-scenario',
        params: {scenarioId: scenarioId, lessonId: this.lessonId}
      });
    },
    toggleSort: function (index) {
      this.sortEditList[index] = !this.sortEditList[index]
    },
    deleteScenario: function (scenarioId) {
      let self = this
      this.$buefy.dialog.confirm({
        title: 'Delete Scenario',
        message: 'Are you sure want to delete this scenario? This cannot be undone.',
        type: 'is-danger',
        confirmText: 'Delete',
        hasIcon: true,
        onConfirm: ()=>{
          db.collection('scenarios').doc(scenarioId).delete().then(() => {
            self.scenarios = self.scenarios.filter(s => s.id != scenarioId)
            this.$buefy.toast.open({
              message: 'Scenario has been deleted.',
              type: 'is-success'
            })
          })
        }
      })
    },
  }
}
</script>