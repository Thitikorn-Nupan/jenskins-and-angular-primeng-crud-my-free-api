import {Engine} from "./engine";

export interface Car {
  cid: string
  brand: string
  model: string
  price: number
  releaseDate: Date
  engine: Engine | undefined
}
