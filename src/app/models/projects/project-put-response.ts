export interface ProjectPutResponse {
    id: number,
    name : string,
    description? : string,
    icon? : any,
    config : any,
    userId? : number,
    technologyIds? : number[]
}