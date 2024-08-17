import { Component } from '@angular/core';
import {Usuario} from "../../shared/model/usuario";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuarioRestService} from "../../shared/services/usuario-rest.service";
import Swal from "sweetalert2";
import {MensagemSweetService} from "../../shared/services/mensagem-sweet.service";

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './manter-usuario.component.html',
  styleUrl: './manter-usuario.component.scss'
})
export class ManterUsuarioComponent {

  usuario: Usuario = new Usuario(0, "", 0);
  modoEdicao = false;

  constructor(private roteador: Router, private rotaAtual: ActivatedRoute,
              private usuarioService: UsuarioRestService, private mensagemService: MensagemSweetService) {

    const idParaEdicao = rotaAtual.snapshot.paramMap.get('id');
    if (idParaEdicao) {
      this.modoEdicao = true;
      usuarioService.buscar(Number(idParaEdicao)).subscribe(
        {
          next: usuario => this.usuario = usuario
        }
      )
    }
  }

  inserir() {
    if (!this.modoEdicao) {
      this.usuario = new Usuario(this.usuario.id, this.usuario.nome, this.usuario.idade)
      try {
        this.usuarioService.inserir(this.usuario).subscribe(
          {
            next: resposta => {
              this.roteador.navigate(['listagem-usuarios']);
              this.mensagemService.sucesso('Usuário cadastrado com sucesso.');
            }
          }
        );
      } catch (e: any){
        this.mensagemService.erro(e.message);
      }
    } else {
      this.usuarioService.atualizar(this.usuario).subscribe(
        {
          next: resposta => {
            this.roteador.navigate(['listagem-usuarios']);
            this.mensagemService.sucesso('Usuário alterado com sucesso.');
          }
        }
      )
    }
  }
}
