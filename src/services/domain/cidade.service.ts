import { Injectable } from "@angular/core";
import { CidadeDTO } from "../../models/cidade.dto";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CidadeService {

    constructor(public http: HttpClient) {
    }

    findAll(id: string) : Observable<CidadeDTO[]> {
        return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${id}/cidades`);
    }
}