<template>
    <b-container fluid>
        <b-modal id="modal" v-model="modalShow" size="lg" title="Clientes" no-close-on-backdrop no-close-on-esc
        centered hide-header-close
        header-bg-variant="success" ok-only ok-variant="info" ok-title="Salir">
        <b-container fluid>
            <b-row>
                <b-col>
                    <b-card title="Buscar">
                        <b-row>
                            <b-col sm="11">
                                <b-form-input v-model="searchModal" type="text" autofocus @keypress.enter="buscarClientePorNombre" ></b-form-input>
                            </b-col>
                            <b-col sm="1">
                                <b-button pill variant="success" size="sm" @click="buscarClientePorNombre" :disabled="encabezado.id!=-1">
                                <b-icon-search></b-icon-search>
                                </b-button>
                            </b-col>
                        </b-row> 
                    </b-card>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-card title="Resultados">
                        <b-overlay :show="loading" spinner-variant="primary" rounded="sm">
                            <b-table
                            dense
                            striped
                            hover
                            :items="buscado"
                            primary-key="id"
                            small
                            sticky-header
                            head-variant="light"
                            fixed
                            responsive="sm"
                            :busy="loading"
                            show-empty
                            emptyText	= "No hay Datos"
                            emptyFilteredText = "No se encontró ningún registro"
                            @row-clicked="(item) => clickBuscar(item)"
                            >
                            </b-table>
                        </b-overlay>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        </b-modal>
        <b-overlay :show="loading" spinner-variant="primary" rounded="sm" >
            <template v-slot:overlay>
                <div class="text-center">
                    <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                    <p id="cancel-label">Un Momento Por favor..</p>
                </div>
            </template>
        <b-row>
            <b-col>
                <b-navbar toggleable="lg" variant="info" sticky>
                <b-navbar-nav >
                    <b-btn-toolbar>
                    <b-btn variant="danger" @click="buscar">
                        <b-icon icon="search"></b-icon>
                    </b-btn>
                    <b-btn variant="warning" @click="nueva">
                        <b-icon icon="basket3"></b-icon>
                    </b-btn>
                    </b-btn-toolbar>
                </b-navbar-nav>
                </b-navbar>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="1">
                <label for="id">No.:</label>
            </b-col>
            <b-col sm="2">
                <b-form-input v-model="encabezado.id" :disabled="!editar" type="text"></b-form-input>
            </b-col>
            <b-col sm="1">
                <label for="fecha">Fecha:</label>
            </b-col>
            <b-col sm="2">
                <b-form-input v-model="encabezado.fecha" type="text" disabled></b-form-input>
            </b-col>
            <b-col sm="1">
                <label for="cliente">Cliente:</label>
            </b-col>
            <b-col sm="1">
                <!-- <b-form-select v-model="encabezado.cliente" :options="clientes"
                value-field="id" text-field="nombre" ></b-form-select> -->
                <b-form-input v-model="encabezado.cliente.id" @blur="buscarCliente" :disabled="encabezado.id!=-1"></b-form-input>
            </b-col>
            <b-col>
                <b-form-input v-model="encabezado.cliente.nombre" disabled></b-form-input>
            </b-col>
            <b-col sm="1">
                <b-button @click="abrirModal" variant="success" :disabled="encabezado.id!=-1" >
                <b-icon-people></b-icon-people>
                </b-button>
            </b-col>
        </b-row>
        <br>
        <!-- intento de busqueda de los productos -->
        <Producto/>
        <!-- intento de busqueda de los productos -->
        <b-row>
            <b-col>
                <b-card
                title="Productos"
                class="mb-2">
                    <b-row>
                        <b-col sm="1">
                            <b-form-input v-model="detalle.producto" @blur="buscarProducto" ></b-form-input>
                        </b-col>
                        <b-col sm="6">
                            <b-form-input v-model="detalle.descripcion" disabled=""></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalle.cantidad" type="number" min="1" value="1" ></b-form-input>
                        </b-col>
                        <b-col sm="2">
                            <b-form-input v-model="detalle.precio" type="number" disabled ></b-form-input>
                        </b-col>
                        <b-col sm="1">
                            <b-btn block variant="info" @click="save">
                                <b-icon icon="cart-plus"></b-icon>
                            </b-btn>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        
        <b-row>
            <b-col>
                <b-card title="Detalle" class="mb-2">
                    <b-table
                    dense stripped hover
                    :items="items"
                    :fields="fields"
                    primary-key="id"
                    small
                    sticky-header
                    head-variant="light"
                    responsive="sm"
                    :busy="loading"
                    show-empty
                    emptyText="No hay datos"
                    emtpyFilterdText="No se encontró ningún registro"
                    foot-clone
                    >
                        <template v-slot:cell(acciones)="row">
                            <b-icon icon="trash" size="sm" @click="borrar(row.item)" class="mr-1"></b-icon>
                        </template>

                        <template v-slot:foot()>
                            <span></span>
                        </template>
                        <template v-slot:foot(producto_descripcion)>
                            <span class="text-danger">Totales</span>
                        </template>
                        <template v-slot:foot(cantidad)>
                            <span class="text-danger">{{totales.cantidad}}</span>
                        </template>
                        <template v-slot:foot(subtotal)>
                            <span class="text-danger">{{totales.subtotal}}</span>
                        </template>
                        <template v-slot:foot(descuento)>
                            <span class="text-danger">{{totales.descuento}}</span>
                        </template>
                        <template v-slot:foot(total)>
                            <span class="text-danger">{{totales.total}}</span>
                        </template>
                        <template v-slot:foot(fecha)>
                            <span class="text-danger">{{totales.fecha}}</span>
                        </template>
                    </b-table>
                </b-card>
            </b-col>
        </b-row>
        <!-- prueba reportes -->
        <br>
        <b-card>
        <b-container>
        <b-row>
          <table id="tableInsumo" class="table table-stripedk">
                <thead class="bg-gray-50">
                    <tr>
                        <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            id
                        </th>
                        <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            descripcion
                        </th>
                        <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            fecha
                        </th>
                        <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            cantidad 
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-300">
                    <tr v-for="i in items" :key="i.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{i.id}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.producto_descripcion}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.fecha}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.cantidad}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </b-row>
        </b-container>
        </b-card>
        </b-overlay>
        <!-- prueba de reportes -->
    </b-container>
    
</template>

<script>
import { ApiFac } from "./ApiFac";
import { ApiInv } from "../inv/ApiInv";
import Producto from "../inv/Producto"
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
  name: "Facturar",
  components: {
      Producto,
  },
  mixins:[mensajesMixin],
  data() {
    return {
      searchModal:"",
      modalShow:false,
      buscado:[],
      api: new ApiFac(),
      apiInv : new ApiInv(),
      editar: false,
      loading: false,
      search: "",
      clientes: [],
      encabezado: {
        id: -1,
        cliente: {
          id: -1,
          nombre: ""
        },
        fecha: moment().format("DD/MM/YYYY"),
      },
      detalle: {
        id: -1,
        cabecera: -1,
        producto: -1,
        cantidad: 0,
        precio: 0,
        subtotal: 0,
        descuento: 0,
        total: 0
      },
      items: [],
      fields: [
        { key: "id", label: "ID", sortable: true },
        { key: "producto_descripcion", label: "Producto", sortable: true },
        { key: "cantidad", label: "Cantidad" },
        { key: "precio", label: "Precio" },
        { key: "subtotal", label: "Sub Total" },
        { key: "descuento", label: "Descuento" },
        { key: "total", label: "Total" },
        { key: "acciones", label: "Acciones" },
        { key: "fecha", label: "Fecha" },
      ]
    }
  },
    created(){
        this.iniciar();
    },
    computed:{
          totales(){
            let t = {
              cantidad: 0,
              subtotal: 0,
              descuento: 0,
              total: 0
            };
            if(this.items!=undefined)
            {
              this.items.reduce((i,obj)=>{
                t.cantidad += obj.cantidad;
                t.subtotal += obj.subtotal;
                t.descuento += obj.descuento;
                t.total += obj.total;
              },0)
            }
            return t;
          }
    },
    methods: {
        async iniciar() {
            try {
                this.loading = true
                const c = await this.api.getCliente();
                this.clientes = c;    
                this.nueva()

                this.loading = true;
                var facturas = await this.api.listFacturas()
                console.log(facturas);
                console.log("asdf");
                facturas.forEach(element => {
                    element.detalle.forEach(element => {
                        this.items.push(element);
                    });
                });
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
                            {text: 'LISTADO DE VENTA DE PRODUCTOS Y FECHAS', alignment: 'center' },
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
                // console.log(this.items)
            } catch (error) {
                this.msgError(error)
            } finally {
                this.loading = false
            }
        },
        async buscarCliente(){
            try {
                this.loading = true
                const c = await this.api.getCliente(this.encabezado.cliente.id)
                // console.log(c)
                if(c.detail != undefined){
                    this.msgError(c.detail)
                    this.encabezado.cliente = {}
                }else if (!c.estado){
                    this.msgError("Cliente Inactivo")
                    this.encabezado.cliente = {}
                }else{
                    this.encabezado.cliente = c
                }
            } catch (error) {
                this.msgError(error)
            }finally{
                this.loading = false
            }
            // const d = await this.api.buscarClientePorNombre("gggg")
            // console.log("--------------------")
            // console.log(d)
        },
        abrirModal(){
            this.buscado = []
            this.searchModal = ""
            this.modalShow=true
        },
        async buscarClientePorNombre(){
          this.loading=true
          this.buscados=[]
          try {
            console.log(this.searchModal)
            if (this.searchModal!=""){
              const d = await this.api.buscarClientePorNombre(this.searchModal)
              console.log(d);
              if (d.detail != undefined) {
                this.msgError(d.detail);
            } else {
              this.buscado = d
            }
            }
          } catch (error) {
            this.msgError(error)
          }
          finally{
            this.loading=false
          }
        },
        async clickBuscar(item){
          console.warn(item)
          this.encabezado.cliente.id = item.id
          await this.buscarCliente()
          this.modalShow=false
        },
        async buscarProducto(){
            if(this.detalle.producto>0){
              try {
                this.loading=true;
                const p = await this.apiInv.getProductos(this.detalle.producto)
                if(p.id!== undefined){
                  if(p.existencia>0){
                    this.detalle.producto = p.id
                    this.detalle.descripcion = p.descripcion
					this.detalle.precio = p.precio
                  }else{
                    this.msgError("NO Hay Existencia para facturar")
                    this.detalle = {};
                  }
                }else{
                  this.msgError(p.detail)
                  this.detalle = {}
                }
              } catch (error) {
                this.msgError(error)
              } finally{
                this.loading=false
              }
            }
        },
        async save(){
            let fechaFact = this.encabezado.fecha
            fechaFact = moment(fechaFact, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if(this.encabezado.cliente.id===undefined || this.encabezado.cliente.id===null || this.encabezado.cliente.nombre=="" || this.encabezado.cliente.id<1){
                this.msgError("Cliente es Requerido")
                return false
            }
            if(this.detalle.descripcion === undefined || this.detalle.descripcion===""){
                this.msgError("Producto Requerido")
                return false
            }
            if(this.detalle.cantidad===undefined || this.detalle.cantidad<=0){
                this.msgError("Cantidad Requerida o valor incorrecto")
                return false
            }
            try{
                this.loading=true
                const enc = {
                    id: this.encabezado.id,
                    cliente: this.encabezado.cliente.id,
                    fecha: fechaFact
                }
                const f = await this.api.saveEncabezado(enc)
                if(f.id===undefined){
                    this.msgError(`Falló en Guardar Encabezado con: ${f}`)
                }else{
                    let id = f.id
                    const det = {
                        id: -1,
                        cabecera : id,
                        producto : this.detalle.producto,
                        cantidad : this.detalle.cantidad,
                        precio : this.detalle.precio,
                        descuento: this.detalle.descuento
                    }
                    const d = await this.api.saveDetalle(det)
                    if(d.id===undefined){
                        this.msgError(`Fallo en Guardar Detalle con: ${d}`);
                        this.encabezado.id = f.id
                        this.refresh()
                    }else{
                        this.detalle = {id:-1}
                        this.encabezado = f;
                        this.encabezado.cliente = await this.api.getCliente(this.encabezado.cliente);
                        this.encabezado.fecha = moment(f.fecha, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    }
                }
            }catch(error){
                this.msgError(error)
            }finally{
                this.loading = false
                this.refresh()
            }
        },
        async refresh(){
          try {
            this.loading = true;
            const r = await this.api.getFacturas(this.encabezado.id)
            // this.encabezado = r;
            if (r.detail != undefined) {
              this.msgError(r.detail)
              this.nueva()
            }else{
              this.encabezado = r;
              this.encabezado.cliente = await this.api.getCliente(this.encabezado.cliente);
              this.encabezado.fecha = moment(r.fecha, 'YYYY-MM-DD').format('DD/MM/YYYY')
              this.items = r.detalle;   
            }
          } catch (error) {
            this.msgError(`Error Refrescando con: ${error}`)
          } finally {
            this.loading = false;
          }
        },
        async buscar() {
          const { value: idEnc } = await this.$swal.fire({
          title: 'Digite Número de Factura',
          input: 'text',
          allowOutsideClick: false,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Debe Digitar Id de Factura'
            }
          }
        })
        if (idEnc) {
          this.encabezado.id = idEnc
          await this.refresh()
          if(this.encabezado.id===undefined){
          this.encabezado =  {
              id: -1,
              cliente: {
                id: -1,
                nombre: ""
              },
              fecha: moment().format("DD/MM/YYYY")
            }
            this.$swal("Factura No Encontrada",idEnc,"error")
          }
        }else{
          this.$swal("Búsqueda Cancelada","","warning")
        }
        
// reportes aqui
      },
      async nueva() {
        this.encabezado = {
          id: -1,
          cliente: {
            id: -1,
            nombre: ""
          },
          fecha: moment().format("DD/MM/YYYY")
        }
        this.detalle = {
          id: -1,
          cabecera: -1,
          producto: -1,
          cantidad: 0,
          precio: 0,
          subtotal: 0,
          descuento: 0,
          total: 0,
        };
        this.editar = false
        this.items = []
      }, 
      async borrar(item){
          if(await this.mensajeSiNo(`${item.producto_descripcion}?`,"¿Borrar")){
              await this.api.deleteDetalle(item.id)
              this.refresh()
          }
      }
    }
    
}
</script>

<style>
  /* Buttons DataTable */
  div.dt-buttons {
    margin-left: 10px;
    float: right;
  }
  /* copiar csv excel pdf */ 
  .buttons-html5 {
    background-color: #008CBA; /* Green */
    border: none;
    color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 15px;
  }
  /* imprimir */
  .buttons-print {
    background-color: #008CBA; /* Green */
    border: none;
    color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 15px;
  }
</style>