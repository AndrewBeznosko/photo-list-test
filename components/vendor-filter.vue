<template>
    <div class="vendor-filter">
        <div class="vendor-filter__header">
            <div class="vendor-filter__title">
                Фильтр:
                <span class="vendor-filter__name">По альбомам</span>
                <span class="vendor-filter__name">Избранное</span>
            </div>
        </div>
        <div class="vendor-filter__scroll-wrap">
            <div class="vendor-filter__scroll scrollbar-is-hidden">
                <div v-if="photos.length" class="vendor-filter__list">
                    <div v-for="(group, i) in transformedPhotos" :key="i" class="media-group">
                        <h4 class="media-group__title">{{ i }}</h4>
                        <div v-for="item in group" :key="item.id" class="media vendor-filter__item">
                            <div class="media__img-block">
                                <img :src="item.thumbnailUrl" :alt="item.title" class="media__img">
                            </div>
                            <p class="media__txt">{{ item.title }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {},

    data () {
        return {
            photos: [],
            short_photos_list: []
        };
    },

    computed: {
        transformedPhotos() {
            let arr = this.maxAlbumsCount(this.photos, 32),
                arrSorted = this.sortByField(arr, 'title'),
                arrGrouped = {}
            
            // grouping 
            arrSorted.map((el) => {
                let symb = this.getFirstSymb(el.title)
                if(!arrGrouped[symb]) { arrGrouped[symb] = [] }
                arrGrouped[symb].push(el)
            })
            
            return this.maxItemsInAlbum(arrGrouped, 10)
        }
    },

    created () {
    },

    mounted() {
        this.getPhotos()
    },

    methods: {
        async getPhotos() {
            const photos = await this.$axios.$get('http://jsonplaceholder.typicode.com/photos')
            this.photos = photos
        },
        sortByField(arr, field) {
            return arr.sort((a, b) => a[field] > b[field] ? 1 : -1)
        },
        getFirstSymb(str) {
            return str.charAt(0).toUpperCase()
        },
        maxAlbumsCount(arr, count) {
            return arr.filter(el => +(el.albumId) <= count)
        },
        maxItemsInAlbum(obj, count) {
            let shortObj = {}
            for(let prop in obj) {
                shortObj[prop] = obj[prop].slice(0, count)
            }
            return shortObj
        }
    },
};
</script>
