<template>
    <b-container>
        <b-row>
            <b-col>
                <h1>Bienvenidos al curso de Vue + Django <small>x Ivan Gamboa Barroso</small></h1>
                <div align="center"><img src="../assets/BLASON CAPITULAR.png" alt="" width="50%" height="auto" rounded="circle"></div>
            </b-col>
        </b-row>
        <b-row>
            <b-col v-for="red in redes" :key="red.red" class="text-center">
                <b-link :href="red.url" target="_blank">
                    <b-alert :variant="red.color" show>
                        {{red.red}}
                    </b-alert>
                </b-link>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return {
            redes:[
                {
                    red: "facebook",
                    url: "https://www.facebook.com",
                    color: "info",
                },
                {
                    red: "twitter",
                    url: "https://twitter.com",
                    color: "warning",
                },
                ]
        }
    }
}
</script>

<style >
</style>