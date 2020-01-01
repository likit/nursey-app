import HellWorld from './components/HelloWorld.vue'
import ImageUpload from './components/ImageUpload.vue'

export const routes = [
    {
        path: '/',
        component: HellWorld
    },
    {
        path: '/image-upload',
        component: ImageUpload,
    }
]