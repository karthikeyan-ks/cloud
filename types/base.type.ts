export type BaseReponse<T,H> = {
    error: boolean,
    data: H,
    message: T
}