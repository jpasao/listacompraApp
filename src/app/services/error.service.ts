import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable()
export class ErrorService {

    constructor(public alertController: AlertController){}

    async show(message){
        const alert = await this.alertController.create({
            header: 'Esto...',
            message: message
        });
        await alert.present();
    }
}