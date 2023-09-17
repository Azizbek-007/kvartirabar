import { Prop, Schema } from "@nestjs/mongoose"
import { RoomCount } from "common/enums";
import { SchemaTypes } from "mongoose";

@Schema({
    collection: 'homeData',
    timestamps: true,
})
export class HomeData {
    @Prop({
        type: SchemaTypes.String,
        enum: [RoomCount]
    })
    room_count: string;

    @Prop({
        type: SchemaTypes.String,
        enum: [RoomCount]
    })
    room_area: string;

}
