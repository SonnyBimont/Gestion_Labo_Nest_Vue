import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  // automatique au démarrage du serveur
  async onModuleInit() {
    // 1. On vérifie si l'admin existe déjà
    const adminExists = await this.findOneByUsername('admin');

    if (!adminExists) {
      // 2. On ne le crée QUE s'il n'existe pas
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userModel.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Compte administrateur initial créé.');
    } else {
      // Log discret pour confirmer que tout est en ordre
      console.log('ℹ️ Compte administrateur déjà présent.');
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ where: { username } });
  }
}
