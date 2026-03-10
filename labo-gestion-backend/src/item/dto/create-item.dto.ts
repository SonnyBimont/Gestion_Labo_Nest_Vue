import { IsString, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly internalRef?: string;

  @IsString()
  readonly supplierRef: string;

  @IsInt()
  @Min(0)
  readonly quantity: number;

  @IsBoolean()
  @IsOptional()
  readonly isP2?: boolean;

  @IsInt()
  @IsOptional()
  readonly lowStockThreshold?: number;

  @IsInt()
  @IsOptional()
  readonly supplierId?: number;
}
