import HellWorld from './components/HelloWorld.vue'
import ImageUpload from './components/ImageUpload.vue'
import ImageList from './components/ImageList.vue'
import CreateLesson from './components/CreateLesson.vue'
import LessonList from './components/LessonList.vue'
import CreateScene from './components/CreateScene.vue'
import SceneList from './components/SceneList.vue'
import CreateHolder from './components/CreateHolder.vue'
import HolderList from './components/HolderList.vue'
import HolderAddImage from './components/HolderAddImage.vue'
import EditScene from './components/EditScene.vue'
import ScenarioPlay from './components/ScenarioPlay.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import PlayStat from './components/PlayStat.vue'
import Game from './components/Game.vue'

export const routes = [
    {
        path: '/',
        component: HellWorld,
        name: 'home'
    },
    {
        path: '/register',
        component: Register,
        name: 'register'
    },
    {
        path: '/login',
        component: Login,
        name: 'login'
    },
    {
        path: '/dashboard',
        component: Dashboard,
        name: 'dashboard'
    },
    {
        path: '/lessons',
        component: LessonList,
        name: 'lessons'
    },
    {
        path: '/lesson/:lessonId/scenarios',
        component: SceneList,
        name: 'scenes'
    },
    {
        path: '/holder',
        component: HolderList,
        name: 'holders'
    },
    {
        path: '/image/upload',
        component: ImageUpload,
        name: 'image-upload'
    },
    {
        path: '/images',
        component: ImageList,
        name: 'images'
    },
    {
        path: '/holder/:holderId/images/add',
        component: HolderAddImage,
        name: 'add-images'
    },
    {
        path: '/create-lesson',
        component: CreateLesson,
        name: 'create-lesson'
    },
    {
        path: '/lesson/:lessonId/scenarios/create',
        component: CreateScene,
        name: 'create-scenario'
    },
    {
        path: '/scenarios/:scenarioId/edit',
        component: EditScene,
        name: 'edit-scenario'
    },
    {
        path: '/lesson/:lessonId/scenarios/:scenarioId/play',
        component: ScenarioPlay,
        name: 'play-scenario'
    },
    {
        path: '/holder/create',
        component: CreateHolder,
        name: 'create-holder'
    },
    {
        path: '/admin/playstats',
        component: PlayStat,
        name: 'playstats'
    },
    {
        path: '/game',
        component: Game,
        name: 'game'
    }
]