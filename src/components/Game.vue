<template>
    <div :id="containerId" v-if="downloaded"></div>
    <div class="placeholder" v-else>
        Downloading ...
    </div>
</template>


<script>
    export default {
        name: 'Game',
        data() {
            return {
                downloaded: false,
                gameInstance: null,
                containerId: 'game-container'
            }
        },
        async mounted() {
            const game = await import(/* webpackChunkName: "game" */ '@/game/game')
            this.downloaded = true
            this.$nextTick(() => {
                this.gameInstance = game.launch(this.containerId)
                window.focus();
                game.resizeGame(this.gameInstance);
                window.addEventListener("resize", ()=>game.resizeGame(this.gameInstance));
            })
        },
        destroyed() {
            this.gameInstance.destroy(false)
        }
    }
</script>