import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer  } from './helpers';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  
  @Get('product/:imageName')
  findImageProduct(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.findStaticImageProduct(imageName)
    
    res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({
      destination: './static/images/products',
      filename: fileNamer
    } )
  }))

  uploadProductImage(
    @UploadedFile() file: Express.Multer.File) {

    if(!file) throw new BadRequestException('Make sure that the file is an image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return secureUrl;
  }
}
