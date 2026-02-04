export interface ProjectGetByUserIdResponse {
    id: number,
    name: string,
    description: string,
    icon: string,
    user: {
      id: 3,
      name: string,
      email: string,
      config: string,
      configJson: any,
      projectNames: any[]
    },
    images: string[],
    technologies: {
        id: number,
        name: string,
        icon: {
            id: number,
            path: string
        }
    }[],
    config: string,
    configJson: any
}