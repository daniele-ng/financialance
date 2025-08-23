// Define a mock AuthGuard for tests

import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

export class MockAuthGuard implements CanActivate {

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return true
    }
}