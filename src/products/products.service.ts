import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as uuidValidate } from 'uuid';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }


  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error: any) {
      this.handleExeptions(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, skip = 0 } = paginationDto;

    const product = await this.productRepository.find({ take: limit, skip: skip })
    if (!product) throw new BadRequestException(`Trouble to access data base`)
    return product;
  }

  async findOne(term: string) {
    let product: Product[] | Product | null

    if (uuidValidate(term)) {
      product = await this.productRepository.findBy({ id: term })
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('UPPER(title) =:title or slug=:slug', {
          title: term.toLocaleUpperCase(),
          slug: term.toLocaleLowerCase()
        }).getOne()
    }

      if (!product) throw new BadRequestException(`Product with term ${term} not found`)
      return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let product = await this.findOne(id);
    if (!product) throw new BadRequestException(`Product with id ${id} not found`)

    const updatedProduct = await this.productRepository.update(id, updateProductDto);

    return updatedProduct
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
}



