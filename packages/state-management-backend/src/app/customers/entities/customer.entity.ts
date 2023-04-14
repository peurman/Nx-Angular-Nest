import { Entity, OneToOne } from '@mikro-orm/core';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Customer extends User {
  @OneToOne(() => Address)
  address: Address;
}
