import { Injectable, ModuleMetadata, Type } from "@nestjs/common";
import { MulterModuleOptions } from "@nestjs/platform-express";

export interface MulterOptionsFactory {
    createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions;
  }

export interface DiskStorageOptions {
  destination?: string | (( // 1
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void
  ) => void) | undefined;
  filename?( // 2
      req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
  ): void;
}

export interface MulterModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<MulterOptionsFactory>;
  useClass?: Type<MulterOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MulterModuleOptions> | MulterModuleOptions;
  inject?: any[];
}