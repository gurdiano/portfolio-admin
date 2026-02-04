export interface RoleGetUserRoleProgressResponse {
    userId: number,
    roleId: number,
    progress: number,
    role: {
        id: number,
        name: string,
        icon: {
            id: number,
            path: string,
        }
    },
    projects: any[]
}