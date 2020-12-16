<template>
    <div class="vendor-filter">
        <div class="vendor-filter__header">
            <div class="vendor-filter__title">
                <div class="vendor-filter__controls">
                    Фильтр:
                    <div class="filters-list">
                        <label v-for="filter in filters" 
                            class="filters-list__item" 
                            :key="filter.id" 
                            :class="{ 'filters-list__item--active' : filter.id == selectedFilter }"
                        ><input type="radio" name="filter" class="d-none" :value="filter.id" v-model="selectedFilter"> {{ filter.name }}</label>
                    </div>
                </div>
                <button class="close-btn ml-auto"></button>
            </div>
        </div>
        <div class="vendor-filter__scroll-wrap">
            <div class="vendor-filter__scroll scrollbar-is-hidden">
                <div class="vendor-filter__list" :class="{ 'vendor-filter__list--no-columns' : filters.byFavorites.id == selectedFilter }">
                    <template v-if="[filters.byAZ.id, filters.byAlbum.id].includes(selectedFilter)">
                        <div v-for="(group, i) in photos" :key="i" class="media-group">
                            <h4 class="media-group__title">{{ i }}</h4>
                            <div v-for="item in group" :key="item.id" class="media vendor-filter__item">
                                <div class="media__img-block">
                                    <img :src="item.thumbnailUrl" :alt="item.title" class="media__img">
                                </div>
                                <p class="media__txt">{{ item.title }}</p>
                                <div class="media__btns">
                                    <button @click="item.isFavorite = toggleFavorite(item)" type="button" class="media__btn-icon" :class="{ 'media__btn-icon--is-favorite' : item.isFavorite }"></button>
                                </div>
                            </div>
                            <media 
                                v-for="item in group"
                                :key="`media-${item.id}`"
                                :thumbnail-url="item.thumbnailUrl"
                                :title="item.title"
                                :is-favorite="item.isFavorite"
                                @toggle-favorite="item.isFavorite = toggleFavorite(item)"
                            />
                        </div>
                    </template>
                    <template v-else-if="filters.byFavorites.id == selectedFilter">
                        <media 
                            v-for="item in favorites" 
                            :key="item.id"
                            :thumbnail-url="item.thumbnailUrl"
                            :title="item.title"
                            :is-favorite="item.isFavorite"
                            @toggle-favorite="item.isFavorite = toggleFavorite(item)"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Media from '@/components/media';

export default {
    components: { Media },
    
    data () {
        return {
            photos: [],
            favorites: [],
            shortAlbumsList: '',
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
            selectedFilter: 0,
        };
    },

    watch: {
        favorites(val) {
            localStorage.setItem('favorites', JSON.stringify(val));
        },
        selectedFilter(val) {
            localStorage.setItem('selectedFilter', JSON.stringify(val));
            this.chekFavorites(JSON.parse(this.shortAlbumsList))
            this.initFilters(val)
        }
    },

    mounted() {
        this.getPhotos()
    },

    methods: {
        async getPhotos() {
            const response = await this.$axios.$get('https://jsonplaceholder.typicode.com/photos')
            this.shortAlbumsList = JSON.stringify(this.maxAlbumsCount(response, 32))

            this.chekFavorites(JSON.parse(this.shortAlbumsList))

            let selectedFilter = JSON.parse(localStorage.getItem('selectedFilter'));
            if(selectedFilter != null) {
                this.selectedFilter = selectedFilter
                this.initFilters(selectedFilter)
            } else {
                this.transformPhotosByAZ(JSON.parse(this.shortAlbumsList))
            }
        },
        transformPhotosByAZ(photos) {
            let arrSorted = this.sortByField(photos, 'title'),
                arrGrouped = this.groupBySymb(arrSorted)
            
            this.photos = this.maxItemsInEachAlbum(arrGrouped, 10)
        },
        transformPhotosByAlbum(photos) {
            let arrSorted = this.sortByField(photos, 'title'),
                arrGrouped = this.groupByAlbum(arrSorted)
            
            this.photos = this.maxItemsInEachAlbum(arrGrouped, 10)
        },
        sortByField(arr, field) {
            return arr.sort((a, b) => a[field] > b[field] ? 1 : -1)
        },
        groupBySymb(arr) {
            let arrGrouped = {}
            arr.map((el) => {
                let symb = this.getFirstSymb(el.title)
                if(!arrGrouped[symb]) { arrGrouped[symb] = [] }
                arrGrouped[symb].push(el)
            })
            return arrGrouped
        },
        groupByAlbum(arr) {
            let arrGrouped = {}
            arr.map((el) => {
                let album = `${el.albumId} - AlbumID`
                if(!arrGrouped[album]) { arrGrouped[album] = [] }
                arrGrouped[album].push(el)
            })

            return arrGrouped
        },
        getFirstSymb(str) {
            return str.charAt(0).toUpperCase()
        },
        maxAlbumsCount(arr, count) {
            return arr.filter(el => +(el.albumId) <= count)
        },
        maxItemsInEachAlbum(obj, count) {
            let shortObj = {}
            for(let prop in obj) {
                shortObj[prop] = obj[prop].slice(0, count)
            }
            return shortObj
        },
        toggleFavorite(item) {
            let state = item.isFavorite = !item.isFavorite
            let curIndex = this.favorites.findIndex((el) => el.id == item.id)

            if(state) {
                if(curIndex < 0) this.favorites.push(item)
            } else {
                if(curIndex >= 0) this.favorites.splice(curIndex, 1)
            }
            return state
        },
        chekFavorites(arr) {
            let fav = localStorage.getItem('favorites')
            if(fav != null) this.favorites = JSON.parse(fav)

            let modifiedArr = arr.map(el => {
                for(let favorite of this.favorites) {
                    if(favorite.id == el.id) {
                        el['isFavorite'] = true
                        return el
                    }
                }
                el['isFavorite'] = false;
                return el
            });

            this.shortAlbumsList = JSON.stringify(modifiedArr)
        },
        initFilters(val) {
            if(this.filters.byAZ.id == val) {
                this.transformPhotosByAZ(JSON.parse(this.shortAlbumsList))
            } else if(this.filters.byAlbum.id == val) {
                this.transformPhotosByAlbum(JSON.parse(this.shortAlbumsList))
            }
        }
    },
};
</script>
