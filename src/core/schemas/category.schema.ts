import * as NestMongoose from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';

export type CategoryDocument = Category & Mongoose.Document;

@NestMongoose.Schema({
    collection: 'category',
    timestamps: true,
})
export class Category {
    @NestMongoose.Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
        unique: true
    })
    name: string;

    @NestMongoose.Prop({
        type: Mongoose.SchemaTypes.String,
        required: false
    })
    icon: string;

    @NestMongoose.Prop({
        type: Mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now,
    })
    createdAt: Date;

    @NestMongoose.Prop({
        type: Mongoose.SchemaTypes.Date,
        required: false,
    })
    updatedAt: Date;
}

export const CategorySchema = NestMongoose.SchemaFactory.createForClass(Category);
