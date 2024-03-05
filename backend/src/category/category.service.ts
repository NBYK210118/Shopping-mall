import { Injectable } from '@nestjs/common';
import { Category, Product } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    private prismaService: PrismaService,
    private productService: ProductService,
  ) {}

  async getAllCategory(): Promise<Category[]> {
    const result = await this.prismaService.category.findMany();

    return result;
  }

  async getAllProducts(category: string): Promise<Product[]> {
    const result = await this.productService.getAllProducts(category);

    return result;
  }
}
