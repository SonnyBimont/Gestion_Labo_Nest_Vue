import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly contact: string;

  @IsEmail()
  readonly email: string;
}
