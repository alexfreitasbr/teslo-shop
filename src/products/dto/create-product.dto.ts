import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateProductDto {

    @ApiProperty({
        example: 'Television led',
        description: 'Product name',
        nullable: false,
        minimum: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

     @ApiProperty({
        example: 0,
        description: 'Product price',
        minimum: 0
    })   
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: 0,
        description: 'Bla-bla-bla',
    })       
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: "television_led",
        description: 'Slug to SEO',
    })    
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        example: 0,
        description: 'Products in stock',
    })   
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: "['XL','XS']",
        description: 'Product size',
    })   
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: "men",
        description: 'Product gender',
    })   
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: '["house","eletronic","audio","blue thoot"]',
        description: 'Products tags',
    })   
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        example: '["front.jpg","left.jpg"]',
        description: 'Product images',
    })       
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
