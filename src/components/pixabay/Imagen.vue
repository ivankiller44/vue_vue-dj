<template>
    <div>
        <b-img :id="img.id" :src="img.previewURL" thumbnail fluid rounded
        v-b-popover.hover.top="img.tags" title="curso Vue + Django Etiqueta"
        @click="mostrarModal=true"
        ></b-img>
        <Modal :mostrarModal="mostrarModal" :img="img" />
    </div>
</template>

<script>
import Modal from "./Modal.vue"
export default {
    name: "Imagen",
    props:["img"],
    components:{
        Modal,
    },
    methods:{
        showModal(){
            this.$refs[this.img.id].show();
        }
    },
    data(){
        return {
            mostrarModal:false
        }
    },
    mounted(){
        this.$root.$on('bv::modal::hide', () => {
            this.mostrarModal = false;
        })
    }
}
</script>

<style>

</style>