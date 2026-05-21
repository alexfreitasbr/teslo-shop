import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()
        const rawHeaders = req.rawHeaders;

        if (!rawHeaders) throw new InternalServerErrorException("User not found")

        if (!data) return rawHeaders

        return Object.fromEntries(
            data.map(key => [key, rawHeaders[key]])
        );
    }
);