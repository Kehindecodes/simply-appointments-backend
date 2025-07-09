
export class RoleError extends Error {
    constructor(
        public message: string,
        public details?: any

    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class RoleNotFoundError extends RoleError {
    constructor(roleId?: string | number) {
        const message = roleId ? `Role with ID ${roleId} not found` : 'Role not found';
        super(message);
    }
}



export class InvalidRoleDataError extends RoleError {
    constructor() {
        super(
            'Invalid role data provided',
        );
    }
}



export class InsufficientPermissionsError extends RoleError {
    constructor(requiredPermission: string) {
        super(
            `Insufficient permissions. Required: ${requiredPermission}`
        );
    }
}
