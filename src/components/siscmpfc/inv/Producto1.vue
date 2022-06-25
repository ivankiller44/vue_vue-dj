<template>
  <!-- <v-app> -->
    <!-- <v-container> -->
    <b-card>
      <v-container>
      <v-row>
        <v-col>
          <v-data-table
            dense
            :headers="headers"
            :items="items"
            :search="search"
            class="elevation-1"
            :loading="loading"
            loading-text="Cargando..."
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title>Productos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="warning" dark class="mb-2" @click="iniciar">
                  <v-icon>cached</v-icon>
                </v-btn>

                <v-dialog v-model="dialog" max-width="100%" dense persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"><v-icon>add_box</v-icon></v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" >
                          <v-text-field v-model="editedItem.id" label="ID" disabled="" ></v-text-field>
                        </v-col>
                        <v-col cols="5">
                          <v-text-field v-model="editedItem.codigo" label="Código"></v-text-field>
                        </v-col>
                        <v-col cols="5">
                          <v-text-field v-model="editedItem.descripcion" label="Descripción"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-autocomplete
                            v-model="editedItem.subcategoria"
                            :items="subcategorias"
                            label="Sub Categorías"
                            item-text="descripcion"
                            item-value="id"
                            return-object
                          ></v-autocomplete>
                        </v-col>
                        <v-col>
                          <v-text-field v-model="editedItem.existencia" label="Existencia" disabled></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field v-model="editedItem.precio" label="Precio"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="pink accent-3" text @click="save">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              </v-toolbar>
            </template>
            <!-- eslint-disable-next-line -->
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon color="danger" small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="primary" @click="iniciar">Reiniciar</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <!-- <b-card>
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
                            existencia
                        </th>
                        <th  scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            precio 
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-300">
                    <tr v-for="i in items" :key="i.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{i.id}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.descripcion}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.existencia}}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{i.precio}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </b-row>
        </b-container>
        </b-card> -->

      </v-container>
    </b-card>

    <!-- </v-container> -->
  <!-- </v-app> -->
</template>

<script>
import { ApiInv } from "./ApiInv";

// import moment from "moment"


import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
// import $ from 'jquery'; 

// window.JSZip = require('jszip')
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import 'datatables.net-dt'
// import 'datatables.net-buttons-dt'
// import 'datatables.net-buttons/js/buttons.html5.js'
// import 'datatables.net-buttons/js/buttons.flash.js'
// import 'datatables.net-buttons/js/buttons.print.js'

export default {
  name: "Categoria",
  data() {
    return {
      items: [],
      api: new ApiInv(),
      loading: false,
      search: "",
      headers: [
          { text: 'ID', value: 'id' },
          {
          text: 'Código',
          align: 'start',
          sortable: true,
          value: 'codigo',
        },
          {
          text: 'Descripción',
          align: 'start',
          sortable: true,
          value: 'descripcion',
        },
        { text: 'Existencia', value: 'existencia', sortable: false },
        { text: 'Precio', value: 'precio', sortable: false },
        { text: 'Sub Categoría', value: 'scat_descripcion', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
        ],
      dialog:false,
      editedIdex:-1,
      editedItem: {
        id:-1,
        codigo:"",
        descripcion: "",
        existencia:0,
        precio:0,
        subcategoria:{"id":-1,"descripcion":""}
      },
      defaultItem: {
        id:-1,
        codigo:"",
        descripcion: "",
        existencia:0,
        precio:0,
        subcategoria:{"id":-1,"descripcion":""}
      },
      subcategorias:[]
    };
  },
  computed:{
      formTitle(){
          return (this.editedIdex === -1 ? "Nuevo": "Editar") + " Producto"
      }
  },
  watch:{
      dialog(val){
          val || this.close()
      }
  },
  methods: {
    async iniciar() {
      try {
        this.loading = true;
        let r = await this.api.getProductos();
        this.items = r;
        this.subcategorias = await this.api.getSubCategorias()

    //   setTimeout(() => { $('#tableInsumo').DataTable({
    //             scrollY: Math.round(window.innerHeight*0.62),
    //             scrollX: false,
    //             lengthMenu: [
    //                 [25, 50, 100, -1],
    //                 [25, 50, 100,"TODO"]
    //             ],
    //             // language: {
    //             //     "url": "/DataTables/Spanish.json"
    //             // },
    //             dom: 'lBfrtip',
    //             buttons: [
    //                 {
    //                     extend: 'pdfHtml5',
    //                     customize: function ( doc ) {
    //                         doc.content.splice( 1, 0, {
    //                             margin: [ 0, 0, 0, 12 ],
    //                             columns: [
    //                                 { image: 'data:image/jpeg;base64,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', 
    //                                 aligment: 'left'},
    //                                 { text: moment(new Date()).format('DD MMMM YYYY, h:mm:ss A [(Hora de Bolivia)]'), alignment: 'right'},
    //                             ],
                                                                         
    //                         },
    //                         {text: 'LISTADO DE EXISTENCIAS Y PRECIOS DE PRODUCTOS', alignment: 'center' },
    //                         {text: ' ', alignment: 'center' }
                            
    //                         );
    //                     },
    //                 },
    //                 'copy', 'excel', 'print'
    //             ],        
    //             "order": [[ 0, "asc" ]],
    //             "ordering": true,
    //             columnDefs: [
    //                 { orderable: false, targets: "no-sort"},
    //                 { "type": "num", "targets": 0 }
    //             ],
    //             });
    //             }, 500);
                console.log(this.items)
      } catch (error) {
        this.$swal("Error",error.toString())
        // alert(error)
      } finally {
        this.loading = false;
      }
    },
    close(){
        this.dialog = false
        this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
        });
    },
    editItem(item){
        this.editedIdex = this.items.indexOf(item)
        this.editedItem = Object.assign({},item)
        this.dialog = true
    },
    async save(){
       const cp = this.editedItem;
      
      const cat = cp["subcategoria"];
      
      let idCat = null;
      if(cat["id"]!==undefined){
        idCat = cat["id"]
      }
      else{
        idCat = cat;
      }
      // console.log(cat);
      const obj = {
        "id":cp["id"],
        "codigo":cp["codigo"],
        "descripcion":cp["descripcion"],
        "existencia":cp["existencia"],
        precio:cp["precio"],
        "subcategoria": idCat,
        "subcategoria_id": idCat,
      }
        try {
            this.loading = true
            await this.api.saveProducto(obj)
            this.close()
            this.iniciar()
        } catch (error) {
            alert(error)
        } finally{
            this.loading = false
        }
    },
    async deleteItem(item){
        // if(confirm('¿Borrar Sub Categoría?'))
        // {
        //     await this.api.delProducto(item.id)
        //     this.iniciar()
        // }
        this.$swal({
          title: '¿Está Seguro?',
          html: `Borrar Producto <br> <b>${item.descripcion} </b>`,
          type: 'warning',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Si, Borrarlo!',
          cancelButtonText: 'No, Mantenerlo!',
          showCloseButton: true,
          showLoaderOnConfirm: true
        }).then( async (result) => {
          if(result.value){
            await this.api.delProducto(item.id)
            this.iniciar()
            this.$swal("Borrado","Se borró satisfactoriamente el producto", "success")
          } else {
            this.$swal("Cancelado","Producto no fue borrado", "info")
          }
        })
    }
  },
  created() {
    this.iniciar();
  },
};
</script>

<style scoped>
</style>