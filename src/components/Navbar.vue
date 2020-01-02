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
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-primary">
                        <strong>Sign up</strong>
                    </a>
                    <a class="button is-light">
                        Log in
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    name: 'navbar'
}
</script>

<style scoped></style>