import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  config: FormGroup;

  constructor(private formBuilder: FormBuilder, 
    public loadingController: LoadingController, 
    public toastController: ToastController,
    private storage: Storage) {
      this.config = this.formBuilder.group({
        url: ''
      });

      this.storage.get("urlApi").then((val) => {
        this.config.controls.url.setValue(val);
      });
    }

    async limpiarCache() {
      const toast = await this.toastController.create({
        color: "primary",
        message: "Cache limpia!",
        duration: 2000,
      });

      this.storage.clear().then(() => {
        toast.present();
      })
    }

    async saveConfig() {
      this.storage.remove("urlApi");
      this.storage.set("urlApi", this.config.controls.url.value);
    }
}
