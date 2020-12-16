<template>
    <div class="vendor-filter">
        <div class="vendor-filter__header">
            <div class="vendor-filter__title">
                Фильтр:
                <div class="filters-list">
                    <label v-for="filter in filters" 
                          class="filters-list__item" 
                          :key="filter.id" 
                          :class="{ 'filters-list__item--active' : filter.id == selectedFilter }"
                    ><input type="radio" name="filter" class="d-none" :value="filter.id" v-model="selectedFilter"> {{ filter.name }}</label>
                </div>
            </div>
        </div>
        <div class="vendor-filter__scroll-wrap">
            <div class="vendor-filter__scroll scrollbar-is-hidden">
                <div class="vendor-filter__list">
                    <div v-for="(group, i) in photos" :key="i" class="media-group">
                        <h4 class="media-group__title">{{ i }}</h4>
                        <div v-for="item in group" :key="item.id" class="media vendor-filter__item">
                            <div class="media__img-block">
                                <img :src="item.thumbnailUrl" :alt="item.title" class="media__img">
                            </div>
                            <p class="media__txt">{{ item.title }}</p>
                            <div class="media__btns">
                                <button @click="item.isFavorite = !item.isFavorite" type="button" class="media__btn-icon" :class="{ 'media__btn-icon--is-favorite' : item.isFavorite }"></button>
                            </div>
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
            response: [],
            photos: [],
            filters: {
                byAZ: {
                    id: 0,
                    name: 'По алфавиту',
                },
                byAlbum: {
                    id: 1,
                    name: 'По альбомам',
                },
                byFavorites: {
                    id: 2,
                    name: 'Избранное',
                },
            },
            selectedFilter: 0
        };
    },

    computed: {
        transformPhotosByFavorites() {
            return
        }
    },

    created () {
    },

    mounted() {
        this.getPhotos()
    },

    methods: {
        async getPhotos() {
            this.response = await this.$axios.$get('http://jsonplaceholder.typicode.com/photos')
            this.transformPhotos(this.response)
        },
        transformPhotos(photos) {
            let arr = this.maxAlbumsCount(photos, 32),
                arrSorted = this.sortByField(arr, 'title'),
                arrGrouped = this.groupBySymb(arrSorted)
            
            this.photos = this.maxItemsInAlbum(arrGrouped, 10)
        },
        sortByField(arr, field) {
            return arr.sort((a, b) => a[field] > b[field] ? 1 : -1)
        },
        groupBySymb(arr) {
            let arrGrouped = {}
            arr.map((el) => {
                el['isFavorite'] = false; // add state
                let symb = this.getFirstSymb(el.title)
                if(!arrGrouped[symb]) { arrGrouped[symb] = [] }
                arrGrouped[symb].push(el)
            })
            return arrGrouped
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
