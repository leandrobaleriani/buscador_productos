import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Producto } from "../model/Producto";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  baseUrl = "";

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.get("urlApi").then((val) => {
      this.baseUrl = val;
    });
  }

  search(valor: String): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      this.baseUrl + "/search.php?valor=" + valor
    );
  }
}
