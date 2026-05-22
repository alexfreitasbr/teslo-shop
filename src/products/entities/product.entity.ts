import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import slugify from "slugify"
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {

    @ApiProperty({ 
        example:'469dae31-e802-4ec1-a70a-f01c3b577e79',
        description:'Product ID - UUID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ 
        example:'Television',
        description:'Product name',
        uniqueItems:true
    })
    @ApiProperty()
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({ 
        example:0,
        description:'Product price',
        default:0,
    })
    @ApiProperty()
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({ 
        example:'Bla bla bla bla bla',
        description:'Product Description',
        default:null,
    })
    @ApiProperty()
    @Column('text', { nullable: true })
    description: string;

    @ApiProperty({ 
        example:'Slug adress',
        description:'bla_bla_bla',
        uniqueItems:true
    })
    @ApiProperty()
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({ 
        example:0,
        description:'Qtd in stock',
        uniqueItems:true,
        default:0,
    })
    @ApiProperty()
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({ 
        example:'["XL","XS"]',
        description:'Product sizes',
    })
    @ApiProperty()
    @Column('text', { array: true, default: [] })
    sizes: string[];

    @ApiProperty({ 
        example:'["men","women","kid","unisex"]',
        description:'Product gender',
    })
    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty({ 
        example:'["house,"eletronic","audio","blue thoot"]',
        description:'Product tags',
        uniqueItems:true
    })
    @ApiProperty()
    @Column('text', { array: true, default: [] })
    tags: string[];


    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToOne(
        () => User,
        (user:User ) => user.product,
        { eager: true }
    )
    user:User;





    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = slugify(this.slug, {
            lower: true,      // convert to lower case
            strict: true,     // strip special characters except replacement
            replacement: '-'  // replace spaces with replacement character, defaults to '-'
        });
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = slugify(this.slug, {
            lower: true,      // convert to lower case
            strict: true,     // strip special characters except replacement
            replacement: '-'  // replace spaces with replacement character, defaults to '-'
        });
    }
}
