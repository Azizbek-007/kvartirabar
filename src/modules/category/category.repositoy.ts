import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, CategoryDocument } from "core/schemas";
import { Model } from "mongoose";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoryRepsitory {
    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
    ){}

    public async create (category: CreateCategoryDto) {
        const createdCategory = new this.categoryModel(category);
        return await createdCategory.save();
    }

    public async getAll () {
        return await this.categoryModel.find().exec();
    }
}
