export type BaseResponseType<D = {}> = {
  resultCode: number
  messages: Array<string>
  data: D
}