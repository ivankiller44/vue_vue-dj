<template>
    <b-container>
        <b-row>
            <b-col>
                <div align="center"><h1>Fire Bike Service</h1></div>
                <div align="center"><img src="../assets/banner_FBS.png" alt="" width="90%" height="auto" rounded="circle" ></div>
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
        <div align="center"><img src="../assets/logo_FBS.jpg" alt="" width="25%" height="auto" rounded="circle" class='imgRedonda'></div>
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
                    url: "https://www.facebook.com/FireBikeService",
                    color: "info",
                },
                ]
        }
    }
}
</script>

<style >
.imgRedonda {
    width:300px;
    height:300px;
    border-radius:150px;
}
</style>