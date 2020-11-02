import { Component, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(private authorService: AuthorService,
                private storage: Storage) { }

    public authorList: Author[];    
    public selectedAuthor: string;
    ngOnInit() {
        this.loadAuthors();
    }

    // Check if saved data for options
    loadSavedData(){
        this.storage.get('author').then((val) => {
            if (val != null) this.selectedAuthor = val;
        });
    }

    loadAuthors(){
        // Check if already loaded
        if (this.authorService.authorList.length == 0){            
            this.authorService
                .getAuthors()
                .subscribe(authors => {
                    this.authorList = authors;                    
                    this.loadSavedData();
                });
        }
        else {
            this.loadSavedData();
        }
    }

    onAuthorChange(value: string){
        this.storage.set('author', value);
    }
}
