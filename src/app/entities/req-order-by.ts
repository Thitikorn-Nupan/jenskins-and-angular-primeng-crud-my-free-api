import {Actor} from "./actor";

export interface ReqOrderBy {
   length : number
   orderBy : {column: string | null, direction: string}[]
   whereModel : Actor | undefined
}
