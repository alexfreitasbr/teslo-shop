import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as uuidValidate } from 'uuid';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) { }


  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto;


    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);
      return { ...product, images};

    } catch (error: any) {
      this.handleExeptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, skip = 0 } = paginationDto;

    const product = await this.productRepository.find({ 
      take: limit, 
      skip: skip,
      relations:{
        images:true
      }
    })
    if (!product) throw new BadRequestException(`Trouble to access data base`)
    return product.map(({images, ...rest}) => ({
      ...rest,
      images: images?.map(img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product | null;
    if (uuidValidate(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toLocaleUpperCase(),
          slug: term.toLocaleLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'productImages')
        .getOne()
    }

    if (!product) throw new NotFoundException(`Product with term ${term} not found`)
    return product
  } 

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    let product = await this.productRepository.preload({
      id,
      ...toUpdate
    })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`)

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

  

    try {
      if(images){
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }))
      }else{
        product.images = await this.productImageRepository.findBy({ product: { id } });
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();  
      
      return product;
    } catch (error: any) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleExeptions(error);
    }
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new BadRequestException(`Product with id ${id} not found`)
    return result;
  }

  private handleExeptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleExeptions(error);
    }
  }
}
