import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({
        length: 200,
        select: false
    })
    password: string;

    @Column({
        type: 'timestamp',
        precision: 6,
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    createdAt: Date;

    @OneToMany(() => Task, task => task.user, { onDelete: 'CASCADE' })
    tasks: Task[];

}
