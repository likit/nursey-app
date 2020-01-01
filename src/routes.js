import HellWorld from './components/HelloWorld.vue'
import ImageUpload from './components/ImageUpload.vue'
import ImageList from './components/ImageList.vue'
import CreateLesson from './components/CreateLesson.vue'

export const routes = [
    {
        path: '/',
        component: HellWorld,
        name: 'home'
    },
    {
        path: '/image-upload',
        component: ImageUpload,
        name: 'image-upload'
    },
    {
        path: '/image-list',
        component: ImageList,
        name: 'image-list'
    },
    {
        path: '/create-lesson',
        component: CreateLesson,
        name: 'create-lesson'
    }
]