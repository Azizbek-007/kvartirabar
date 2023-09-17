import { Prop, Schema } from "@nestjs/mongoose";
import { PaymentTerm } from "common/enums";
import * as Mongoose from 'mongoose';

export type HomeDocument = Home & Mongoose.Document;

@Schema({
    collection: 'home',
    timestamps: true,
})
export class Home {
    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
        length: 100,
        index: true,
    })
    title: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
        length: 512
    })
    description: string;

    @Prop({
        type: Mongoose.SchemaTypes.Number,
        required: true,
    })
    price: number;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
        enum: [PaymentTerm.DAILY, PaymentTerm.WEEKLY, PaymentTerm.MONTHLY]
    })
    payment_term: string;

    @Prop({
        type: Mongoose.SchemaTypes.String,
        required: true,
    })
    address: string;
}
