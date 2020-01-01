import HellWorld from './components/HelloWorld.vue'
import ImageUpload from './components/ImageUpload.vue'
import ImageList from './components/ImageList.vue'
import CreateLesson from './components/CreateLesson.vue'
import LessonList from './components/LessonList.vue'
import CreateScene from './components/CreateScene.vue'
import SceneList from './components/SceneList.vue'

export const routes = [
    {
        path: '/',
        component: HellWorld,
        name: 'home'
    },
    {
        path: '/lessons',
        component: LessonList,
        name: 'lessons'
    },
    {
        path: '/scenes',
        component: SceneList,
        name: 'scenes'
    },
    {
        path: '/image-upload',
        component: ImageUpload,
        name: 'image-upload'
    },
    {
        path: '/images',
        component: ImageList,
        name: 'images'
    },
    {
        path: '/create-lesson',
        component: CreateLesson,
        name: 'create-lesson'
    },
    {
        path: '/create-scenario',
        component: CreateScene,
        name: 'create-scenario'
    }
]