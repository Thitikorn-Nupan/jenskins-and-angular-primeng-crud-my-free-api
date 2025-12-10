import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Actor} from "../entities/actor";
import {Observable} from "rxjs";
import {ReqOrderBy} from "../entities/req-order-by";
import {Movie} from "../entities/movie";

@Injectable({
  providedIn: 'root'
})
export class ActorOneToManyService {

  private readonly baseActorEndpoint: string = environment.baseUrl+'/actor';
  private readonly baseMovieEndpoint: string = environment.baseUrl+'/movie';


  constructor(private readonly http: HttpClient) {
  }

  public getSelectAll() : Observable<Actor[]> {
    return this.http.get<Actor[]>(this.baseActorEndpoint+'/reads')
  }

  public getMovieSelectAll() : Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseMovieEndpoint+'/reads')
  }

  public getSelectOneIncludeRelationByPk(aid : string) : Observable<Actor> {
    return this.http.get<Actor>(this.baseActorEndpoint+'/read-relations/'+aid)
  }

  public getSelectAllAids()  : Observable<string[]> {
    return this.http.get<string[]>(this.baseActorEndpoint+'/reads/aid')
  }

  public getSelectAllHaveOrderBy(reqOrderBy:ReqOrderBy)  : Observable<Actor[]> {
    return this.http.post<Actor[]> (this.baseActorEndpoint+'/reads-have-request-order-by',reqOrderBy)
  }

  public postSaveOne(actor: Actor): Observable<boolean> {
    return this.http.post<boolean>(this.baseActorEndpoint+'/create',actor)
  }

  public postSaveRelation(actor: Actor): Observable<boolean> {
    return this.http.post<boolean>(this.baseActorEndpoint+'/create-with-relation',actor)
  }

  public putEditOne(actor: Actor) : Observable<boolean> {
    return this.http.put<boolean>(this.baseActorEndpoint+'/update?pk='+actor.aid,actor)
  }

  public putEditRelation(actor: any) : Observable<boolean> {
    return this.http.put<boolean>(this.baseActorEndpoint+'/update-relation?pk='+actor.aid,actor)
  }

  public deleteDeleteOneByPk(aid : string) : Observable<boolean> {
    return this.http.delete<boolean>(this.baseActorEndpoint+'/delete?pk='+aid)
  }


}
