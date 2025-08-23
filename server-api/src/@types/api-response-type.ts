

export type ApiResponseType = {

    success: boolean,
    message: string,
    error: string,

}

export type ApiResponseDataType = ApiResponseType & {

    data: any,
    
}