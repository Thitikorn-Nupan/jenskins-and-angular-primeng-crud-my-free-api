import {Actor} from "./actor";

export interface Movie {
   mid : string
   title : string
   categories : string
   rate : number
   year : string
   actors :Actor[] | undefined
}
