<template>
    <div  class="media vendor-filter__item">
        <div class="media__img-block">
            <img :src="thumbnailUrl" :alt="title" class="media__img">
        </div>
        <p class="media__txt">{{ title }}</p>
        <div class="media__btns">
            <button @click="$emit('toggle-favorite')" type="button" class="media__btn-icon" :class="{ 'media__btn-icon--is-favorite' : isFavorite }"></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'media',
    props: {
        thumbnailUrl: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        isFavorite: {
            type: Boolean,
            default: false
        },
    }
};
</script>
