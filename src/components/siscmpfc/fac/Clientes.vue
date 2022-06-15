<template>
    <b-container>
        <b-row>
            <b-col sm="2">
                <h4>Clientes</h4>
            </b-col>
            <b-col sm="8">
                <b-form-group
                label="Filtro"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                label-for="filterInput"
                class="mb-0">
                    <b-input-group size="sm">
                        <b-form-input
                        v-model="filter"
                        type="search"
                        id="filterInput"
                        placeholder="Escribe para Buscar">
                        </b-form-input>
                        <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''">
                                <b-icon icon="x-square" aria-hidden="true"></b-icon>
                            </b-button>
                        </b-input-group-append>                        
                    </b-input-group>
                </b-form-group>
            </b-col>
            <b-col sm="2">
                <b-button pill v-b-modal.modal variant="primary" @click="abrirModal" >
                    <b-icon icon="folder-plus" aria-hidden="true"></b-icon>
                </b-button>
                <b-button pill variant="success" @click="iniciar">
                    <b-icon icon="arrow-clockwise"></b-icon>
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-card>
                <b-table
                  dense
                  striped
                  hover
                  :items="items"
                  :fields="fields"
                  primary-key="id"
                  small
                  sticky-header
                  head-variant="light"
                  fixed
                  responsive="sm"
                  :busy="loading"
                  :filter="filter"
                  show-empty
                  emptyText = "No hay Datos"
                  emptyFilteredText = "No se encontró ningún registro"
                >
                  <template v-slot:cell(acciones)="row">
                    <!-- <b-button
                      size="sm"
                      @click="info(row.item, row.index, $event.target)"
                      class="mr-1"
                    >
                    <b-icon>pencil</b-icon>
                    </b-button>
                    <b-button
                      size="sm"
                      @click="row.toggleDetails"
                    >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-button> -->
                    <b-icon icon="pencil" size="sm" @click="editar(row.item)"></b-icon>
                    <b-icon icon="trash" size="sm" @click="borrar(row.item)"></b-icon>
                  </template>
                </b-table>
                </b-card>
                <b-modal id="modal" v-model="modalShow" size="xl" title="Clientes" no-close-on-backdrop no-close-on-esc
                hide-footer centered hide-header-close >
                    <b-container fluid>
                        <b-row class="my-1">
                            <b-col sm="1">
                            <label for="id">Id:</label>
                            </b-col>
                            <b-col sm="2">
                            <b-form-input v-model="cliente.id" disabled type="text"></b-form-input>
                            </b-col>
                            <b-col sm="1">
                            <label for="nombre">Nombre:</label>
                            </b-col>
                            <b-col>
                            <b-form-input v-model="cliente.nombre" type="text" autofocus ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="1">
                            <label for="telefono">Teléfono:</label>
                            </b-col>
                            <b-col>
                            <b-form-input v-model="cliente.telefono" type="text"></b-form-input>
                            </b-col>
                            <b-col sm="1">
                            <label for="email">E-Mail:</label>
                            </b-col>
                            <b-col>
                            <b-form-input v-model="cliente.email" type="email"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="1">
                            <b-form-checkbox v-model="cliente.estado" name="check-button" switch>
                                Estado
                            </b-form-checkbox>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                            <b-button class="mt-3" variant="outline-info" block @click="cerrar">Cancelar</b-button>
                            </b-col>
                            <b-col>
                            <b-button class="mt-3" variant="outline-danger" block @click="guardar">Guardar</b-button>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
                <br>
                <b-card>
                <b-container>
                    <b-row>
                        <table id="tableInsumo" class="table table-striped">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        id
                                    </th>
                                    <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefono
                                    </th>
                                    <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-300">
                                <tr v-for="i in items" :key="i.id">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {{i.id}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{i.nombre}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{i.telefono}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{i.email}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-row>
                </b-container>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { ApiFac } from "./ApiFac";
import { BIcon } from "bootstrap-vue";
import mensajesMixin from "../../../mixins/mensajesMixin"
import moment from "moment"

import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

window.JSZip = require('jszip')
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import 'datatables.net-dt'
import 'datatables.net-buttons-dt'
import 'datatables.net-buttons/js/buttons.html5.js'
import 'datatables.net-buttons/js/buttons.flash.js'
import 'datatables.net-buttons/js/buttons.print.js'

export default {
    name:"Cliente",
	components: {
        BIcon
    },
    mixins: [mensajesMixin],
    data() {
        return {
            modalShow: false,
            loading: false,
            filter: "",
            api: new ApiFac(),
            fields: [
                { key: "id", label: "ID", sortable: true},
                { key: "nombre", label: "Nombres", sortable: true},
                { key: "telefono", label: "Teléfono", sortable: true},
                { key: "email", label: "E-Mail", sortable: true},
                { key: "estado", label: "Activo?", sortable: true},
                { key: "acciones", label: "Acciones", sortable: false }
            ],
            items: [],
            cliente:{
                id:-1,
                nombre:"",
                telefono:"",
                email:"",
                estado:true
            },
            fecha: moment().format("DD/MM/YYYY"),
        };
    },
    created(){
        this.iniciar()
    },
    computed:{},
    methods:{
        async iniciar(){
            try {
                this.loading = true
                const r = await this.api.getCliente()
                this.items = r

                setTimeout(() => { $('#tableInsumo').DataTable({
                scrollY: Math.round(window.innerHeight*0.62),
                scrollX: false,
                lengthMenu: [
                    [25, 50, 100, -1],
                    [25, 50, 100,"TODO"]
                ],
                // language: {
                //     "url": "/DataTables/Spanish.json"
                // },
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        customize: function ( doc ) {
                            doc.content.splice( 1, 0, {
                                margin: [ 0, 0, 0, 12 ],
                                columns: [
                                    { image: 'data:image/jpeg;base64,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', 
                                    aligment: 'left'},
                                    { text: moment(new Date()).format('DD MMMM YYYY, h:mm:ss A [(Hora de Bolivia)]'), alignment: 'right'},
                                ],
                                                                         
                            },
                            {text: 'LISTADO DE CLIENTES REGISTRADOS', alignment: 'center' },
                            {text: ' ', alignment: 'center' }
                            
                            );
                        },
                    },
                    'copy', 'excel', 'print'
                ],        
                "order": [[ 0, "asc" ]],
                "ordering": true,
                columnDefs: [
                    { orderable: false, targets: "no-sort"},
                    { "type": "num", "targets": 0 }
                ],
                });
                }, 500);

            } catch (error) {
                alert(error)
            } finally {
                this.loading = false
            }

            setTimeout(() => {
            $('#tableInsumo').DataTable({
                scrollY: Math.round(window.innerHeight*0.62),
                scrollX: false,
                lengthMenu: [
                    [25, 50, 100, -1],
                    [25, 50, 100,"TODO"]
                ],
                // language: {
                //     "url": "/DataTables/Spanish.json"
                // },
                dom: 'lBfrtip',
                buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                ],        
                "order": [[ 0, "asc" ]],
                "ordering": true,
                columnDefs: [
                    { orderable: false, targets: "no-sort"},
                    { "type": "num", "targets": 0 }
                ],
                });
                }, 500);
        },
        cerrar(){
            this.modalShow = false
        },
        async guardar(){
            try {
                const c = await this.api.saveCliente(this.cliente)
                if (c.id!=undefined){
                    this.msg("Guardado Satisfactoriamente")
                    this.cliente = []
                }else{
                    this.msgError("Error Inesperado")
                }
            } catch (error) {
                this.msgError(error)
            }
            finally{
                this.cerrar()
                this.iniciar()
            }
        },
        editar(data){
            this.cliente = data
            this.modalShow = true
        },
        abrirModal(){
            this.cliente = {
                id:-1,
                nombre:"",
                telefono:"",
                email:"",
                estado:true
            }
            this.modalShow = true
        },
        async borrar(item){
            try {
                if(await this.mensajeSiNo(`¿Borrar cliente ${item.nombre}?`)){
                    this.loading = true
                    await this.api.deleteCliente(item.id)
                    this.msg("Cliente Borrado Satisfactoriamente")
                }
            } catch (error) {
                this.msgError(error)
            }
            finally{
                this.loading = false
                this.iniciar()
            }
        }
    }
}
</script>

<style>
</style>