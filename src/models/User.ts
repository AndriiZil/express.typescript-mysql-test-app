import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 200 })
    password: string;

    @Column({
        type: 'timestamp',
        precision: 6,
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP(6)'
    })
    createdAt: Date;

    @OneToMany(() => Task, task => task.user, { cascade: ["remove"] })
    tasks: Task[];

}
