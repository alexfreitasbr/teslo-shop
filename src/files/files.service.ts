import { BadRequestException, Injectable, Patch } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {
  findStaticImageProduct(imageName: string){
    const path= join( __dirname, '../../static/images/products', imageName)
    if(!existsSync(path)) throw new BadRequestException(`No product found with image ${imageName}`)

        return path
  }
}
