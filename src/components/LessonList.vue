<template>
    <section class="section">
        <div class="container">
            <b-loading :is-full-page="true"
                :active.sync="lessons.length===0"
                :can-cancel="true">
            </b-loading>
            <div class="card" v-for="lesson in lessons" :key="lesson.id">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <img src="/img/gift.png">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ lesson.name }} <span v-if="lesson.isPracticeMode">(Practice Mode)</span></p>
                            <p><strong>Objective:</strong> {{ lesson.objective }}</p>
                            <div class="buttons">
                              <button class="button is-light" @click="$router.push({name: 'edit-lesson', params: {lessonId: lesson.id}})">
                                <span>Edit</span>
                              </button>
                              <button class="button is-primary" @click="$router.push({name: 'scenes', params: { lessonId: lesson.id}})">View</button>
                              <button class="button is-danger" @click="deleteLesson(lesson.id)">
                                <span class="icon">
                                  <i class="fas fa-trash-alt"></i>
                                </span>
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
    name: 'lesson-list',
    data () {
        return {
            lessons: [],
        }
    },
    methods: {
      deleteLesson: function (lessonId) {
        let self = this
        this.$buefy.dialog.confirm({
          title: 'Delete Scenario',
          message: 'Are you sure want to delete this lessons along with its scenarios? This cannot be undone.',
          type: 'is-danger',
          confirmText: 'Delete',
          hasIcon: true,
          onConfirm: ()=>{
            db.collection('scenarios').where('lessonId', '==', lessonId).get().then((snapshot) => {
              snapshot.forEach(rec => {
                db.collection('scenarios').doc(rec.id).delete()
              })
            })
            db.collection('lessons').doc(lessonId).delete().then(()=>{
              self.$buefy.toast.open({
                message: 'Lesson and its scenarios have been deleted.',
                type: 'is-success'
              })
            })
            self.lessons = self.lessons.filter(l => l.id != lessonId)
          }
        })
      }
    },
    mounted: function() {
        let self = this;
        db.collection('lessons').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                    self.lessons.push({
                        name: rec.data()['name'],
                        id: rec.id,
                        objective: rec.data()['objective'],
                        isPracticeMode: rec.data()['isPracticeMode']
                    });
                });
            });
    },
}
</script>