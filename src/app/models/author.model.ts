import {Deserializable} from './deserializable.model';

export class Author implements Deserializable {
    authorId: number;
    name: string;
    image: string;
    number: number;
    
    deserialize(input: any): this {
        Object.assign(this, input);        
        return this;
    }    
}