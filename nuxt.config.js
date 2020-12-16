export default {
    mode: 'spa',

    head: {
        title: 'Photobank',
        meta: [
            { 
                charset: 'utf-8' 
            },
            { 
                name: 'viewport',
                content: 'width=device-width, user-scalable=no'
            }
        ],
    },

    modules: ['@nuxtjs/axios'],

    css: [
        '~/assets/scss/main.scss'
    ]
};
