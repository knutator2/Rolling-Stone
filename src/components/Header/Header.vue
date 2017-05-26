<template>
    <header class="header">
        <div class="header__logo">

        </div>
        <div class="header__links">
            <router-link to="/map">Karte</router-link>
            <router-link to="/gallery">Galerie</router-link>
            <router-link to="/graph">Graph</router-link>
        </div>
    </header>
</template>

<script>
    export default {

    }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .header {
        background-color: $color-white;
        height: 46px;
        position: absolute;
        top: 10px;
        width: 100%;
    }

</style>
