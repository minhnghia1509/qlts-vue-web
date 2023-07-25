<template>
    <div class="body">
        <TheHeader :token="token" @loginSucces="loginSucces" @logOut="logOut"></TheHeader>
        <MainContent v-if="page==2" :token="token"></MainContent>
        <IncrementPage v-if="page==1" :token="token" :reload="reload"></IncrementPage>
    </div>
</template>


<script>
import TheHeader from '../TheHeader/TheHeader.vue';
import MainContent from '../MainContent/MainContent.vue';
import IncrementPage from '../IncrementPage/IncrementPage.vue';
export default {
    props: ['page', 'token', 'reload'],
    name: 'TheBody',
    components: {
        TheHeader,
        MainContent,
        IncrementPage,
    },
    methods: {
        logOut() {
            this.$emit('logOut');
        }
    },
}
</script>

<style>
    @import url('./TheBody.css');
</style>