import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    title: string;

    @Column({ length: 250 })
    text: string;

    @Column({
        type: 'boolean',
        default: false
    })
    completed: boolean;

    @Column({
        type: 'timestamp',
        precision: 6,
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    createdAt: Date;

    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    user: User;

}
