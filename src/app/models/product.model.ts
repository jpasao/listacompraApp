import {Deserializable} from './deserializable.model';

export class Product implements Deserializable {
    id: number;
    name: string;
    isChecked: string;
    checked: boolean;
    quantity: number;

    deserialize(input: any): this {
        Object.assign(this, input);
        this.checked = input.isChecked == 1;
        return this;
    }
}