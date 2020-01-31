<template>
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column">
                    <h1 class="title">Game Statistics</h1>
                    <table class="table is-striped is-narrow">
                        <thead>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Score</th>
                        </thead>
                        <tbody>
                            <tr v-for="stat in stats" :key="stat.id">
                                <td>{{ stat.user.data.displayName }}</td>
                                <td>{{ stat.timestamp.toDate() }}</td>
                                <td>{{ stat.score }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import {firebaseApp} from '../firebase-config.js'
const db = firebaseApp.firestore();

export default {
    data () {
        return {
            stats: [],
        }
    },
    mounted() {
        var self = this;
        db.collection('plays').get().then(function(snapshot) {
            snapshot.forEach(function(rec) {
                    self.stats.push({
                        id: rec.id,
                        user: rec.data()['user'],
                        score: rec.data()['score'],
                        timestamp: rec.data()['timestamp']
                    });
                });
            });
  }
};
</script>