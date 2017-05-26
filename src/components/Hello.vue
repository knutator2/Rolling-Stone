<!-- TODO: Remove this dummy component! -->

<template>
    <div class="test">
        Hello, you lovely Vue component!
        <div class="test_stuff">

        </div>
    </div>
</template>

<script>
    export default {
        test: 'true'
    }
</script>

<style lang="scss">
    @import "../styles/variables";

    .test {
        color: $color-main;
    }

    .test_stuff {
        background-color: goldenrod;
        display: block;
        height: 500px;
        width: 300px;
    }
</style>
