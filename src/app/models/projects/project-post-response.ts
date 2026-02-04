export interface ProjectPostResponse {
    name : string,
    description? : string,
    config : any,
    icon? : any,
    images? : any[],
    userId? : number,
    technologyIds? : number[]
}