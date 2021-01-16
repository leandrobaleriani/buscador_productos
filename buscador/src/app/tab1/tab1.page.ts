import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, ToastController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Producto } from "../model/Producto";
import { ProductosService } from "../services/productos.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  busqueda: FormGroup;
  productos: Producto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private proService: ProductosService,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner
  ) {
    this.busqueda = this.formBuilder.group({
      nombre: "",
    });
  }

  search(event) {
    if (event && event.keyCode === 13) {
      this.productos = [];
      this.buscarProducto(event.target.value);
      this.busqueda.controls.nombre.reset();
    }
  }

  searchBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.buscarProducto(barcodeData);
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async buscarProducto(valor) {
    let loading = await this.loadingController.create({
      message: "Buscando...",
      spinner: "crescent",
    });

    const toast = await this.toastController.create({
      color: "danger",
      message: "Error al buscar los productos! Intente nuevamente",
      duration: 2000,
    });

    await loading.present();
    await this.storage.get(valor).then(
      (val) => {
        if (val) {
          this.productos = val;
          this.busqueda.controls.nombre.reset();
          loading.dismiss();
        } else {
          this.proService.search(valor).subscribe(
            (data) => {
              if (data.length > 0) {
                this.productos = data;
                this.busqueda.controls.nombre.reset();
                this.storage.set(valor, data);
              }

              loading.dismiss();
            },
            (error) => {
              toast.present();
              loading.dismiss();
            }
          );
        }
      },
      (error) => {
        this.proService.search(valor).subscribe(
          (data) => {
            this.productos = data;
            this.busqueda.controls.nombre.reset();
            this.storage.set(valor, data);
            loading.dismiss();
          },
          (error) => {
            toast.present();
            loading.dismiss();
          }
        );
      }
    );
  }
}
