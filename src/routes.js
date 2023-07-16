import HelloWorld from './components/HelloWorld.vue'
import ImageUpload from './components/ImageUpload.vue'
import ImageList from './components/ImageList.vue'
import ImageEdit from './components/ImageEdit.vue'
import CreateLesson from './components/CreateLesson.vue'
import LessonList from './components/LessonList.vue'
import EditLesson from './components/EditLesson.vue'
import CreateScene from './components/CreateScene.vue'
import SceneList from './components/SceneList.vue'
import CreateHolder from './components/CreateHolder.vue'
import HolderList from './components/HolderList.vue'
import HolderAddImage from './components/HolderAddImage.vue'
import EditScene from './components/EditScene.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import PlayStat from './components/PlayStat.vue'
import Game from './components/Game.vue'

export const routes = [
    {
        path: '/',
        component: HelloWorld,
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
        name: 'dashboard',
        meta: {
            title: 'Dashboard',
            requiresAuth: true
        }
    },
    {
        path: '/lessons',
        component: LessonList,
        name: 'lessons',
        meta: {
            title: 'Lessons',
            requiresAuth: true
        }
    },
    {
        path: '/lessons/:lessonId/edit',
        component: EditLesson,
        name: 'edit-lesson',
        meta: {
            title: 'Edit Lesson',
            requiresAuth: true
        }
    },
    {
        path: '/lesson/:lessonId/scenarios',
        component: SceneList,
        name: 'scenes',
        meta: {
            title: 'Scenes',
            requiresAuth: true
        }
    },
    {
        path: '/holder',
        component: HolderList,
        name: 'holders',
        meta: {
            title: 'Holders',
            requiresAuth: true
        }
    },
    {
        path: '/image/upload',
        component: ImageUpload,
        name: 'image-upload',
        meta: {
            title: 'Upload Image',
            requiresAuth: true
        }
    },
    {
        path: '/images/:imageRecId/edit',
        component: ImageEdit,
        name: 'image-edit',
        meta: {
            title: 'Edit Image',
            requiresAuth: true
        }
    },
    {
        path: '/images',
        component: ImageList,
        name: 'images',
        meta: {
            title: 'Image List',
            requiresAuth: true
        }
    },
    {
        path: '/holder/:holderId/images/add',
        component: HolderAddImage,
        name: 'add-images',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/create-lesson',
        component: CreateLesson,
        name: 'create-lesson',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/lesson/:lessonId/scenarios/create',
        component: CreateScene,
        name: 'create-scenario',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/scenarios/:scenarioId/edit',
        component: EditScene,
        name: 'edit-scenario',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/holder/create',
        component: CreateHolder,
        name: 'create-holder',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/admin/playstats',
        component: PlayStat,
        name: 'playstats',
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/scenario/:scenarioId/play',
        component: Game,
        name: 'play-scenario',
        meta: {
            requiresAuth: true
        }
    }
]