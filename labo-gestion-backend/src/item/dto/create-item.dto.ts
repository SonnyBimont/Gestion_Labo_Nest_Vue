/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly reference: string;

  @IsInt()
  @Min(0)
  readonly quantity: number;

  @IsInt()
  @IsOptional()
  readonly lowStockAlert?: number;

  @IsBoolean()
  @IsOptional()
  readonly isP2?: boolean;
}
