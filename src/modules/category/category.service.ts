import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepsitory } from './category.repositoy';

@Injectable()
export class CategoryService {
    constructor(private readonly categoryRepositoy: CategoryRepsitory) { }

    public async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.categoryRepositoy.create(createCategoryDto);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern.name === 1) {
                throw new ConflictException('Category name already exists');
            }
            console.error(error);
        }
    }

    public async getAll() {
        return await this.categoryRepositoy.getAll();
    }

    public async getById(_id: string) {

    }
}
