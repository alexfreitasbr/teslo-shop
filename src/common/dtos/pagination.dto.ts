import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ 
        example:15,
        description:'How many pages do you need',
        default:10,
        minimum:1
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(()=>Number)
    readonly limit?:number

    @ApiProperty({ 
        example:0,
        description:'How many registers you need to skip',
        default:0,
        minimum:0
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(()=>Number)
    readonly skip?:number
}
