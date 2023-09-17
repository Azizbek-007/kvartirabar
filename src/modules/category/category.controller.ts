import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    public async create(@Body() sreateCategoryDto: CreateCategoryDto) {
        return await this.categoryService.create(sreateCategoryDto)
    }

    @Get('/all')
    public async getAll() {
        return await this.categoryService.getAll();
    }
} 
