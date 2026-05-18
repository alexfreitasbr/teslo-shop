import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import slugify from "slugify"
import { Product } from "./product.entity";

@Entity()
export class ProductImage{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;




    // @BeforeInsert()
    // checkSlugInsert() {
    //     if (!this.slug) {
    //         this.slug = this.title;
    //     }
    //     this.slug = slugify(this.slug, {
    //         lower: true,      // convert to lower case
    //         strict: true,     // strip special characters except replacement
    //         replacement: '-'  // replace spaces with replacement character, defaults to '-'
    //     });
    // }


}
