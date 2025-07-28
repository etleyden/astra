import {Goal} from '../entities';
import {EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { GoalType } from '../entities/Goal';

@ EventSubscriber()
export class GoalSubscriber implements EntitySubscriberInterface<Goal> {
    listenTo(){
        return Goal;
    }

    async beforeInsert( event: InsertEvent<Goal> ){
        const goal = event;
        // check for intervals start date
        if ( goal.entity.interval &&
            !goal.entity.start_date ) 
                throw new Error("Interval is populated but there's no start date."); 
        

        if ( goal.entity.is_recurring ){
            // check for start date and interval
            if ( !goal.entity.interval )
                throw new Error("is_recurring is true but there's no interval.")

            // check for either "save" or "aggregate"
            if ( goal.entity.type === GoalType.BALANCE )
                throw new Error("is_recurring is true but goal is enum is set to balance.");
        }
        else{
            // check for an end date
            if ( !goal.entity.end_date )
                throw new Error("End date is not populated and is_recurring is false.");
            
        }
        
        // if you either do .insert() or .save() within a try catch it will catch one of these error
           
    }

}