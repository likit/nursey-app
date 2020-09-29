<template>
    <div :id="containerId" v-if="downloaded"></div>
    <div class="placeholder" v-else>
        Downloading ...
    </div>
</template>


<script>
import PlayGame from '../game/scenes/PlayGame'
import BootGame from '../game/scenes/BootGame'
import PickItem from '../game/scenes/PickItem'
import ScenarioScene from "@/game/scenes/Scenario";
import Map from '../game/scenes/Map'
import FinishGame from "@/game/scenes/FinishGame";

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
            let self = this
            this.$nextTick(() => {
                this.gameInstance = game.launch(this.containerId)
                this.gameInstance.scenarioId = self.$route.params.scenarioId
                window.focus();
                this.gameInstance.scene.add("Map", Map)
                this.gameInstance.scene.add("PlayGame", PlayGame)
                this.gameInstance.scene.add("BootGame", BootGame)
                this.gameInstance.scene.add("PickItem", PickItem)
                this.gameInstance.scene.add("ScenarioScene", ScenarioScene)
                this.gameInstance.scene.add("FinishGame", FinishGame)
                this.gameInstance.scene.start("BootGame",
                    {scenarioId: self.$route.params.scenarioId})
                game.resizeGame(this.gameInstance);
                window.addEventListener("resize", ()=>game.resizeGame(this.gameInstance));
            })
        },
        destroyed() {
            this.gameInstance.destroy(false)
        }
    }
</script>