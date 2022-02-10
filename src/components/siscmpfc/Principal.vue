<template>
    <v-card class="color-fondo">
        <v-card-title>
            <h1 class="font-weight-bold display-6 color-texto">sistema web progresiva de gestión de mantenimiento, stock y ventas basado en el modelo Software as a Service (SaaS) - <small>Ivan Gamboa Barroso</small></h1>
        </v-card-title>
        <v-tabs>
            <v-tab>Inventario</v-tab>
            <v-tab>Compra</v-tab>
            <v-tab>Facturacion</v-tab>

            <v-tab-item><Inventario /></v-tab-item>
            <v-tab-item><Compras /></v-tab-item>
            <v-tab-item><Facturas /></v-tab-item>
        </v-tabs>
    </v-card>
</template>

<script>
import Inventario from './inv/Inventario.vue'
import Compras from './cmp/Compras.vue'
import Facturas from './fac/Facturas.vue'

export default {
    name: "Principal",
    components: {
        Inventario,
        Compras,
        Facturas
    }
}
</script>

<style >
.color-fondo{
    background-color:#FFFBE6 !important
}
.color-texto{
    color: #356859 !important
}
</style>