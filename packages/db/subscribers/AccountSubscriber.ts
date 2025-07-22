import {Account} from '../entities';
import {EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';

@ EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
    listenTo(){
        return Account;
    }

    async beforeInsert( event: InsertEvent<Account> ){
        const account = event;
        // will not allow an account to have a vendor that is not a bank
        if ( account.entity.bank.is_bank !== true )
            throw new Error("Account vendor has to be set to true.");
            // if you either do .insert() or .save() within a try catch it will catch this error
        
           
    }

}