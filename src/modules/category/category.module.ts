import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'core/schemas';
import { CategoryRepsitory } from './category.repositoy';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: 'Category',
            schema: CategorySchema
        }
    ])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepsitory]
})
export class CategoryModule {}
