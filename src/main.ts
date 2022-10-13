import { createApp } from 'vue'

import router from '@/router'

import App from './App.vue'
import store from './store'
import components from './core'

import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import 'animate.css/source/animate.css'
import './global.less'

import('ant-design-vue/dist/antd.variable.min.css')

import '@/design'

createApp(App).use(store).use(router).use(components).mount('#app')

