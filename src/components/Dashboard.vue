<template>
<section class="section">
    <div class="container">
        <div class="box">
            <h1 class="title">Welcome to Your Dashboard</h1>
            <h1 class="subtitle">{{ user.data.displayName }}</h1>
        </div>
    </div>
</section>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    })
  }
};
</script>