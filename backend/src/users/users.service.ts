import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async markEmailVerified(id: string): Promise<void> {
    await this.userRepository.update(id, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    });
  }

  async create(
    email: string,
    hashedPassword: string,
    role: ROLE,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }
}
