import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from 'src/app/shared/models/usuario';
import { Proceso } from 'src/app/shared/models/Proceso';
import { AppConfig } from 'src/app/shared/services/app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _proceso: Proceso;
  private _token: string;
  private _expiration: string;
  protected urlServer = AppConfig.settings.urlServer;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && localStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(localStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get proceso(): Proceso {
    if (this._proceso != null) {
      return this._proceso;
    } else if (this._proceso == null && localStorage.getItem('proceso') != null) {
      this._proceso = JSON.parse(localStorage.getItem('proceso')) as Proceso;
      return this._proceso;
    }
    return null;
  }

  setProceso(proceso: Proceso): void {
    this._proceso = proceso;
    localStorage.setItem('proceso', JSON.stringify(this._proceso));
  }

  public get expiration(): string {
    if (this._expiration != null) {
      return this._expiration;
    } else if (this._expiration == null && localStorage.getItem('expiration') != null) {
      this._expiration = JSON.parse(localStorage.getItem('expiration')) as string;
      return this._expiration;
    }
    return null;
  }

  setExpiration(expiration: string): void {
    this._expiration = expiration;
    localStorage.setItem('expiration', JSON.stringify(this._expiration));
  }
  
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && localStorage.getItem('token') != null) {
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = this.urlServer.oauth + 'token';
    const credenciales = btoa('encuestappto' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.codigo);
    params.set('password', usuario.contrasenha);
    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }

  guardarExpiration(expires_in: number): void {
    this._expiration = (new Date().getTime() + expires_in*1000).toString();
    localStorage.setItem('expiration', this._expiration);
  }

  guardarUsuario(codigo: string, roles: string[]): void {
    this._usuario = new Usuario();
    this._usuario.codigo = codigo;
    this._usuario.roles = roles;
    localStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    localStorage.setItem('token', accessToken);
  }

  obtenerDatosToken(accessToken: string): any {
    return accessToken;
  }

  isAuthenticated(): boolean {
    if (this.token != null && this.token.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(rol: string): boolean {
    if (this.usuario.roles.includes(rol)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('proceso');
  }
}
