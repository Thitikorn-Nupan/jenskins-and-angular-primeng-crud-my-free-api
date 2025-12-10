import {Movie} from "./movie";

export interface Actor {
   aid : string
   fullname : string
   born : string
   contact : string
   movies : Movie[] | undefined
}
