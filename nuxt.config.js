export default {
    mode: 'spa',

    head: {
        title: 'Photobank',
        meta: [
            { charset: 'utf-8' },
        ],
    },

    plugins: [],

    modules: ['@nuxtjs/axios'],

    buildModules: [],

    css: [
        '~/assets/css/main.scss'
    ]
};
