import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('items') // préfixe URL
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // '+' convertit l'ID reçu en chaîne de caractères (depuis l'URL) en nombre entier
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  // --- ROUTE SPÉCIFIQUE MÉTIER ---
  @Post(':id/decrement')
  async decrement(@Param('id') id: string, @Body() body: any) {
    // On force la conversion et on vérifie la présence de la donnée
    const amount = parseInt(body.amount, 10);

    if (isNaN(amount)) {
      throw new BadRequestException(
        "La quantité 'amount' est manquante ou invalide.",
      );
    }

    return this.itemService.decrement(+id, amount);
  }
}
