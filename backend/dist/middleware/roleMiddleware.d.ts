import { Response, NextFunction } from 'express';
export declare const roleMiddleware: (roles: string[]) => (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=roleMiddleware.d.ts.map