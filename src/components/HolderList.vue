<template>
    <section class="section">
        <div class="container">
            <div class="card" v-for="holder in holders" :key="holder.id">
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
                            <button class="button is-primary" @click="go(holder.id)">
                                Add images
                            </button>
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
    name: 'holder-list',
    data () {
        return {
            holders: [],
        }
    },
    mounted: function() {
        var self = this;
        db.collection('holders').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                    self.holders.push({
                        name: rec.data()['name'],
                        id: rec.id,
                        description: rec.data()['description']
                    });
                });
            });
    },
    methods: {
        go: function(holderId) {
            this.$router.push({name: 'add-images', params: { holderId: holderId}});
        }
    }
}
</script>