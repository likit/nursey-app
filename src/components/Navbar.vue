<template>
    <b-navbar shadow fixed-top>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item tag="router-link" :to="{ name: 'home' }">
                Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ name: 'lessons' }">
                Lessons
            </b-navbar-item>
            <b-navbar-item href="#">
                About
            </b-navbar-item>
            <b-navbar-dropdown label="Admin">
                <b-navbar-item tag="router-link" :to="{ name: 'images' }">
                    List images
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'lessons' }">
                    List lessons
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'holders' }">
                    List holders
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'image-upload' }">
                    Upload image
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'create-lesson'} ">
                    Create lesson
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'create-holder'} ">
                    Create holder
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'playstats'} ">
                    Play Stats
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item v-if="user.loggedIn" tag="router-link" :to="{name: 'dashboard'}">
                Welcome {{ user.data.displayName }}</b-navbar-item>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <b-button tag="router-link" :to="{name: 'register'}" type="is-link">
                        <strong>Sign up</strong>
                    </b-button>
                    <b-button @click="signOut()" v-if="user.loggedIn" type="is-warning">Sign Out</b-button>
                    <b-button v-else tag="router-link" :to="{name: 'login'}" type="is-light">
                        <strong>Log In</strong>
                    </b-button>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
    name: 'navbar',
    computed: {
        ...mapGetters({
            user: "user"
        })
    },
    methods: {
        signOut() {
            firebase.auth().signOut().then(()=>{});
        }
    }
}
</script>

<style scoped></style>